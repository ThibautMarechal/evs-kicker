import Head from 'next/head';
import Link from 'next/link';
import '../styles/index.css';
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
          <div className="h-full flex flex-col">
            <div className="flex-none navbar m-4 mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
              <div className="flex-1 px-2 mx-2">
                <Link href="/">
                  <a className="text-base md:text-lg font-bold whitespace-nowrap">EVS Kicker</a>
                </Link>
              </div>
              <div className="flex-none px-2 mx-2 sm:flex">
                <div className="flex items-stretch">
                  <Link href="/stats/">
                    <a className="btn btn-ghost btn-sm rounded-btn text-sm md:text-base">Stats</a>
                  </Link>
                  <Link href="/players/">
                    <a className="btn btn-ghost btn-sm rounded-btn text-sm md:text-base">Players</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <Component {...pageProps} />
            </div>
          </div>
        </AuthGuard>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
