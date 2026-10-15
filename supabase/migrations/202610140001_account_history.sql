-- Additive migration. Browser roles never write immutable report payloads.
create table public.account_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  automatic_backup_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.account_preferences enable row level security;
revoke all on public.account_preferences from anon, authenticated;
grant select, insert, update on public.account_preferences to authenticated;
create policy own_preferences on public.account_preferences for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table public.attempt_reports (
  report_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attempt_id text not null check (length(attempt_id) between 1 and 200),
  payload_schema_version integer not null check (payload_schema_version = 1),
  hash_version integer not null check (hash_version = 1),
  payload jsonb, payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  exam_id text, dataset_version text, difficulty text check (difficulty in ('intermediate', 'advanced')),
  title text, started_at bigint, submitted_at bigint,
  submission_reason text check (submission_reason in ('manual', 'time expired')),
  correct_count integer, total_count integer, practice_score integer, practice_passed boolean,
  uploaded_at timestamptz not null default now(), deleted_at timestamptz,
  unique(user_id, attempt_id),
  constraint report_lifecycle check (
    (deleted_at is null and payload is not null and exam_id is not null and dataset_version is not null
      and title is not null and started_at is not null and submitted_at >= started_at
      and submission_reason is not null and correct_count is not null and total_count is not null
      and practice_score is not null and practice_passed is not null and submitted_at is not null
      and correct_count between 0 and total_count
      and total_count = 60 and practice_score = round(correct_count * 1000.0 / total_count)
      and practice_passed = (correct_count * 1000 >= 720 * total_count)
      and octet_length(payload::text) <= 1048576)
    or (deleted_at is not null and payload is null and exam_id is null and dataset_version is null
      and title is null and difficulty is null and started_at is null and submitted_at is null
      and submission_reason is null and correct_count is null and total_count is null
      and practice_score is null and practice_passed is null)
  )
);
create index account_history_order on public.attempt_reports(user_id, submitted_at desc, report_id desc) where deleted_at is null;
alter table public.attempt_reports enable row level security;
revoke all on public.attempt_reports from anon, authenticated;
grant select on public.attempt_reports to authenticated;
create policy own_reports on public.attempt_reports for select to authenticated using ((select auth.uid()) = user_id);

-- Server-only configuration; adjustable after measuring the operating budget.
create table public.archive_limits (
  singleton boolean primary key default true check(singleton),
  max_reports integer not null default 1000 check(max_reports > 0),
  max_bytes bigint not null default 262144000 check(max_bytes > 0),
  writes_per_minute integer not null default 30 check(writes_per_minute > 0)
);
insert into public.archive_limits(singleton) values (true);
create table public.archive_rates (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_at timestamptz not null, writes integer not null
);
alter table public.archive_limits enable row level security;
alter table public.archive_rates enable row level security;
revoke all on public.archive_limits, public.archive_rates from anon, authenticated;

create function public.protect_report() returns trigger language plpgsql set search_path = '' as $$
begin
  if old.deleted_at is not null or new.deleted_at is null
    or new.report_id <> old.report_id or new.user_id <> old.user_id or new.attempt_id <> old.attempt_id
    or new.payload_hash <> old.payload_hash or new.hash_version <> old.hash_version
    or new.payload_schema_version <> old.payload_schema_version or new.uploaded_at <> old.uploaded_at
  then raise exception 'ARCHIVE_IMMUTABLE'; end if;
  return new;
end;
$$;
create trigger immutable_report before update on public.attempt_reports for each row execute function public.protect_report();

create function public.archive_backup(p_user_id uuid, p_report jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  existing public.attempt_reports; inserted public.attempt_reports;
  limits public.archive_limits; used_count bigint; used_bytes bigint; calls integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  select * into existing from public.attempt_reports where user_id=p_user_id and attempt_id=p_report->>'attempt_id';
  if found then
    if existing.deleted_at is not null then raise exception 'ARCHIVE_DELETED'; end if;
    if existing.payload_hash <> p_report->>'payload_hash' then raise exception 'ARCHIVE_CONFLICT'; end if;
    return jsonb_build_object('status','already-backed-up','reportId',existing.report_id,'hash',existing.payload_hash);
  end if;
  select * into limits from public.archive_limits where singleton;
  select count(*), coalesce(sum(octet_length(payload::text)),0) into used_count,used_bytes
    from public.attempt_reports where user_id=p_user_id and deleted_at is null;
  if used_count >= limits.max_reports or used_bytes + octet_length((p_report->'payload')::text) > limits.max_bytes
    then raise exception 'ARCHIVE_QUOTA'; end if;
  insert into public.archive_rates(user_id,window_at,writes) values(p_user_id,now(),1)
    on conflict(user_id) do update set
      writes = case when public.archive_rates.window_at < now()-interval '1 minute' then 1 else public.archive_rates.writes+1 end,
      window_at = case when public.archive_rates.window_at < now()-interval '1 minute' then now() else public.archive_rates.window_at end
    returning writes into calls;
  if calls > limits.writes_per_minute then raise exception 'ARCHIVE_RATE'; end if;
  insert into public.attempt_reports(user_id,attempt_id,payload_schema_version,hash_version,payload,payload_hash,
    exam_id,dataset_version,difficulty,title,started_at,submitted_at,submission_reason,
    correct_count,total_count,practice_score,practice_passed)
  values(p_user_id,p_report->>'attempt_id',1,1,p_report->'payload',p_report->>'payload_hash',
    p_report->>'exam_id',p_report->>'dataset_version',p_report->>'difficulty',p_report->>'title',
    (p_report->>'started_at')::bigint,(p_report->>'submitted_at')::bigint,p_report->>'submission_reason',
    (p_report->>'correct_count')::integer,(p_report->>'total_count')::integer,
    (p_report->>'practice_score')::integer,(p_report->>'practice_passed')::boolean)
  returning * into inserted;
  return jsonb_build_object('status','created','reportId',inserted.report_id,'hash',inserted.payload_hash);
end;
$$;

create function public.archive_delete(p_user_id uuid,p_attempt_id text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
  update public.attempt_reports set deleted_at=now(),payload=null,exam_id=null,dataset_version=null,
    difficulty=null,title=null,started_at=null,submitted_at=null,submission_reason=null,
    correct_count=null,total_count=null,practice_score=null,practice_passed=null
  where user_id=p_user_id and attempt_id=p_attempt_id and deleted_at is null;
end;
$$;
revoke all on function public.protect_report() from public,anon,authenticated;
revoke all on function public.archive_backup(uuid,jsonb),public.archive_delete(uuid,text) from public,anon,authenticated;
grant execute on function public.archive_backup(uuid,jsonb),public.archive_delete(uuid,text) to service_role;
grant all on public.attempt_reports,public.archive_rates,public.archive_limits,public.account_preferences to service_role;
