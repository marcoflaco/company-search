import React from 'react';
import { render} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompanyDetail from './index';

describe('CompanyDetail Component', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/companies/6/details']}>
        <CompanyDetail />
      </MemoryRouter>
    );
  });
});