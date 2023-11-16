import Head from 'next/head';
import Link from 'next/link';
import App, { AppContext, AppProps } from 'next/app';
import '../styles/index.css';
import 'tailwindcss/tailwind.css';
import { getSession, SessionProvider } from 'next-auth/react';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { queryClient } from '../react-query/queryClient';
import { AuthGuard } from '../components/AuthGuard';

export const MyApp = ({ Component, pageProps: { session, dehydratedState, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session} refetchInterval={360}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState} queryClient={queryClient}>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>EVS Kicker</title>
          </Head>
          <AuthGuard>
            <div className="h-full flex flex-col">
              <div className="flex-none navbar mb-2 shadow-lg bg-neutral text-neutral-content">
                <div className="flex-1 px-2 mx-2">
                  <Link href="/"className="text-base md:text-lg font-bold whitespace-nowrap">
                    EVS Kicker
                  </Link>
                </div>
                <div className="flex-none px-2 mx-2 sm:flex">
                  <div className="flex items-stretch">
                    <Link href="/stats/" className="btn btn-ghost btn-sm rounded-btn text-sm md:text-base">
                      Stats
                    </Link>
                    <Link href="/players/" className="btn btn-ghost btn-sm rounded-btn text-sm md:text-base">
                      Players
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <Component {...pageProps} />
              </div>
            </div>
          </AuthGuard>
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const session = await getSession(context.ctx);
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      session,
    },
  };
};

export default MyApp;
