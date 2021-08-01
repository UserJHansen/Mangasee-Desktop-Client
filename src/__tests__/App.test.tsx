import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Router from '../router';

describe('App', () => {
  it('should render', () => {
    expect(render(<Router />)).toBeTruthy();
  });
});
