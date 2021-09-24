import React from 'react';
import { render } from 'react-dom';
import { SWRConfig } from 'swr';
import mangaAPIFetcher from './APIs/mangaAPI';
import Router from './router';

render(
  <SWRConfig
    value={{
      fetcher: mangaAPIFetcher,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}
  >
    <Router />
  </SWRConfig>,
  document.getElementById('root')
);
