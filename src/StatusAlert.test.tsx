import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { StatusAlert, StatusType } from './components/StatusAlert';

describe('StatusAlert', () => {
  test('renders StatusAlert component', () => {
    const tree = renderer
      .create(
        <StatusAlert
          visible={true}
          status={StatusType.success}
        />
      ).toJSON()
    screen.debug();
    expect(tree).toMatchSnapshot();
  });
});