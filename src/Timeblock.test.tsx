/**
 * @jest-environment jsdom
 */

 test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};

import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { Timeblock } from './Pages/Timeblock';

describe('Timeblock', () => {
  test('renders Timeblock and gets roles', () => {
    render(<Timeblock />);
    // screen.getByRole('');
  });
});