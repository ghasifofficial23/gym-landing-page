import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wuxizdgotkbxaetbaiag.supabase.co';
const supabaseAnonKey = 'sb_publishable_fjLq85ufj5MwciuKzKkKLg_sOjxTits';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
