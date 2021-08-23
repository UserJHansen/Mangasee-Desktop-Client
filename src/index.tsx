import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { SWRConfig } from 'swr';
import mangaAPIFetcher from './APIs/mangaAPI';
import Router from './router';

render(
  <Suspense fallback={<>Loading... </>}>
    <SWRConfig
      value={{
        fetcher: mangaAPIFetcher,
      }}
    >
      <Router />
    </SWRConfig>
  </Suspense>,
  document.getElementById('root')
);
