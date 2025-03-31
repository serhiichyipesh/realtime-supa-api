import { SupabaseClient, createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';

dotenv.config();

export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase connection settings');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getData(table: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async insertData(table: string, data: unknown) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async deleteData(table: string, id: string) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}