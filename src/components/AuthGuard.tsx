import { ReactNode, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      signIn();
    }
  }, [session?.user, status]);

  return <>{session?.user ? children ?? null : null}</>;
};
