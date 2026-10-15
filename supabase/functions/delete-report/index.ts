import { backend } from '../_shared/backend.ts';
import { createArchiveHandler } from '../_shared/handlers.ts';
const url = Deno.env.get('SUPABASE_URL')!;
const key = Deno.env.get('SUPABASE_ANON_KEY')!;
const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const origins = (Deno.env.get('ARCHIVE_ALLOWED_ORIGINS') ?? '').split(',').map(value => value.trim()).filter(Boolean);
Deno.serve(createArchiveHandler('delete-report', backend(url, key, secret), origins));
