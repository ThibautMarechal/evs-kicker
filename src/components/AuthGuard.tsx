import * as React from 'react';
import { signIn, useSession } from 'next-auth/react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      signIn();
    }
  }, [session?.user, status]);

  return <>{session?.user ? children ?? null : null}</>;
};
