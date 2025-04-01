import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private supabase;
    constructor(_supabase: SupabaseClient);
    getData(table: string): Promise<any[]>;
    insertData(table: string, data: unknown): Promise<any>;
    deleteData(table: string, id: string): Promise<boolean>;
}
