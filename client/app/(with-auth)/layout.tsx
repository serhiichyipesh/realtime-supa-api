'use client';

import { TableDataProvider } from '@/shared/providers/table-data-provider';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WithAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
      }
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/sign-in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  return <TableDataProvider>{children}</TableDataProvider>;
}
