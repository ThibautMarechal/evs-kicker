import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../react-query/queryClient';
import { AuthGuard } from '../components/AuthGuard';

export const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session} refetchInterval={360}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>EVS Kicker</title>
        </Head>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
