import { TPayload, TSubscribeToDBChangeOptions } from './types.js';

import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';

export const subscribeToDBChange = ({
  event,
  table,
  handler,
  supabase,
  changeName = REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
  channel,
}: TSubscribeToDBChangeOptions) => {
  const subscription = supabase
    .channel(channel)
    .on(
      // @ts-expect-error - Supabase types are incorrect for realtime subscriptions
      changeName,
      {
        event,
        schema: 'public',
        table,
      },
      (payload: TPayload) => {
        handler(payload);
      }
    )
    .subscribe();

  return subscription;
};
