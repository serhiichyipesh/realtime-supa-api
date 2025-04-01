export class SupabaseService {
    supabase;
    constructor(_supabase) {
        this.supabase = _supabase;
    }
    async getData(table) {
        const { data, error } = await this.supabase
            .from(table)
            .select('*')
            .not('data', 'is', null)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    async insertData(table, data) {
        const { data: result, error } = await this.supabase
            .from(table)
            .insert(data)
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async deleteData(table, id) {
        const { error } = await this.supabase.from(table).delete().eq('id', id);
        if (error)
            throw error;
        return true;
    }
}
//# sourceMappingURL=supabase-service.js.map