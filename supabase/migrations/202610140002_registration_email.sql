-- Enforce the rule for direct Supabase Auth signup calls as well as the app.
-- Existing accounts are untouched; unchanged legacy emails still permit login.
create function public.valid_registration_email(value text)
returns boolean language sql immutable set search_path = '' as $email_rule$
  select coalesce(
    length(value) <= 254
    and length(split_part(value, '@', 1)) <= 64
    and split_part(value, '@', 1) ~ $local$^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+([.][A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$$local$
    and value ~ $domain$^[^@]+@([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?[.])+([A-Za-z]{2,63}|[xX][nN]--[A-Za-z0-9]([A-Za-z0-9-]{0,57}[A-Za-z0-9])?)$$domain$,
    false
  );
$email_rule$;

create function public.enforce_registration_email()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.email is not distinct from old.email then
    return new;
  end if;
  if not public.valid_registration_email(new.email) then
    raise exception 'Enter an email with a complete domain, such as name@example.com.'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke all on function public.valid_registration_email(text) from public, anon, authenticated;
revoke all on function public.enforce_registration_email() from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.valid_registration_email(text) to supabase_auth_admin;
grant execute on function public.enforce_registration_email() to supabase_auth_admin;

create trigger enforce_registration_email
before insert or update of email on auth.users
for each row execute function public.enforce_registration_email();
