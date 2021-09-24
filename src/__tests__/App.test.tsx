/**
 * @jest-environment jsdom
 */

import React from 'react';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';

import mangaAPIFetcher from '../APIs/mangaAPI';
import Router from '../router';

describe('App', () => {
  it('should render', () => {
    expect(
      render(
        <SWRConfig
          value={{
            fetcher: mangaAPIFetcher,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          <Router />
        </SWRConfig>
      )
    ).toBeTruthy();
  });
});
