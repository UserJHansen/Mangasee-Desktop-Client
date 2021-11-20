import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import mangaAPIFetcher, { storeBackupProvider } from './APIs/mangaAPI';
import Router from './Router';

export default () => (
  <Suspense fallback="Loading...">
    <SWRConfig
      value={{
        fetcher: mangaAPIFetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        provider: storeBackupProvider,
        suspense: true,
      }}
    >
      <Router />
    </SWRConfig>
  </Suspense>
);
