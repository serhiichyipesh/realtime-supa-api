import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  SupabaseClient,
} from '@supabase/supabase-js';

export type TTableData = {
  created_at: string;
  id: string;
  data: Record<string, unknown>;
};

export type TPayload = { new: TTableData['data']; old: TTableData['data'] };

export type TSubscribeToDBChangeOptions = {
  event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
  table: string;
  handler: (payload: TPayload) => void;
  supabase: SupabaseClient;
  changeName?: REALTIME_LISTEN_TYPES;
  channel: string;
};
