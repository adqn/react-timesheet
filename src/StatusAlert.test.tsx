/**
 * @jest-environment jsdom
 */

 test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { StatusAlert, StatusType } from './components/StatusAlert';

describe('StatusAlert', () => {
  test('renders StatusAlert component', () => {
    render(
      <StatusAlert
        visible={true}
        status={StatusType.failure} 
        message=""
      />);
    // const tree = renderer
      // .create(
      //   <StatusAlert
      //     visible={true}
      //     status={StatusType.failure}
      //   />
      // ).toJSON()
    // expect(tree).toMatchSnapshot();
  });
});
