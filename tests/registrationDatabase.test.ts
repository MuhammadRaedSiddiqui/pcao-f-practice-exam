import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { validEmails, invalidEmails } from './fixtures/registrationEmails';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role supabase_auth_admin; create schema auth; create table auth.users(id text primary key, email text, last_sign_in_at text); insert into auth.users values ('legacy', 'a@b', null); grant usage on schema auth to supabase_auth_admin; grant select, insert, update on auth.users to supabase_auth_admin;");
  await db.exec(await readFile(new URL('../supabase/migrations/202610140002_registration_email.sql', import.meta.url), 'utf8'));
}, 30000);
afterAll(async () => { await db?.close(); });
describe('actual registration email migration', () => {
  it('matches browser format rules across valid and invalid syntax', async () => {
    for (const email of [...validEmails, ...invalidEmails]) {
      const { rows } = await db.query<{ valid: boolean }>('select public.valid_registration_email($1) as valid', [email]);
      expect(rows[0].valid, email).toBe(validEmails.includes(email));
    }
    expect((await db.query<{ valid: boolean }>('select public.valid_registration_email(null) as valid')).rows[0].valid).toBe(false);
  });
  it('blocks direct Auth-role insertion of a short domain without leaving an account row', async () => {
    await db.exec('set role supabase_auth_admin');
    try {
      await expect(db.query('insert into auth.users(id,email) values ($1,$2)', ['bad', 'a@b'])).rejects.toThrow('complete domain');
      expect((await db.query("select id from auth.users where id='bad'")).rows).toHaveLength(0);
      await db.query('insert into auth.users(id,email) values ($1,$2)', ['valid', 'valid@example.org']);
    } finally { await db.exec('reset role'); }
  });
  it('rejects changing a valid email to invalid syntax while keeping existing legacy users usable', async () => {
    await db.exec('set role supabase_auth_admin');
    try {
      await expect(db.query("update auth.users set email='a@b' where id='valid'")).rejects.toThrow('complete domain');
      await db.query("update auth.users set email=email, last_sign_in_at='synthetic-login' where id='legacy'");
      await db.query("update auth.users set email='fixed@example.org' where id='legacy'");
    } finally { await db.exec('reset role'); }
  });
  it('does not expose email predicate/trigger helpers to browser roles', async () => {
    for (const role of ['anon','authenticated']) {
      await db.exec('set role '+role);
      try { await expect(db.query("select public.valid_registration_email('a@b')")).rejects.toThrow('permission denied'); }
      finally { await db.exec('reset role'); }
    }
  });
});
