/**
 * @jest-environment jsdom
 */

import { Suspense } from 'react';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';

import mangaAPIFetcher, {
  storeBackupProvider,
} from '../renderer/APIs/mangaAPI';
import Router from '../renderer/Router';

describe('App', () => {
  it('should render', () => {
    expect(
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
        </Suspense>
      )
    ).toBeTruthy();
  });
});
