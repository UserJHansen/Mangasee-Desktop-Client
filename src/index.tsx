import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { SWRConfig } from 'swr';
import mangaAPIFetcher, { storeBackupProvider } from './APIs/mangaAPI';
import Router from './router';

render(
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
  </Suspense>,
  document.getElementById('root')
);
