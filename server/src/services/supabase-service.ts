import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(_supabase: SupabaseClient) {
    this.supabase = _supabase;
  }

  async getData(table: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .not('data', 'is', null)
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
    const { error } = await this.supabase.from(table).delete().eq('id', id);

    if (error) throw error;
    return true;
  }
}
