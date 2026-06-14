// Supabase-клиент — заглушка для Фазы 2.
// В Фазе 2 сюда подключим @supabase/supabase-js (CDN), anon-ключ и общие запросы (tasks, checks).
// Пока данные хранятся локально (localStorage) внутри каждой вкладки.
//
// План Фазы 2:
//   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
//   export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
//   export async function getTasks(){ ... }
//   export async function addCheck(taskId, date){ ... }
//   RLS гарантирует, что пользователь видит только свои строки.
export const PHASE = 1;
