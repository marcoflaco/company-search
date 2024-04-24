import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './index';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Search Component', () => {
  beforeEach(() => {
   
    mockedAxios.get.mockClear();
    mockedAxios.get.mockResolvedValue({
      data: {
        data: []
      }
    });
  });

  it('renders the search component with an input field and search button', async () => {
    render(<Search />, { wrapper: BrowserRouter });
    expect(screen.getByPlaceholderText('Search companies...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('performs a search and makes API call with the correct query', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: '1', name: 'Company A', city: 'City A', zipCode: '10001', streetName: 'Street A' }
        ]
      }
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    render(<Search />, { wrapper: BrowserRouter });
    fireEvent.change(screen.getByPlaceholderText('Search companies...'), { target: { value: 'Company A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    const cityElement = await screen.findByText('City A');
    expect(cityElement).toBeInTheDocument();

    const companyElement = await screen.findByText('Company A');
    expect(companyElement).toBeInTheDocument();

    const zipElement = await screen.findByText('10001');
    expect(zipElement).toBeInTheDocument();

    const streetElement = await screen.findByText('Street A');
    expect(streetElement).toBeInTheDocument();
      });

  it('handles no results found', async () => {
    mockedAxios.get.mockResolvedValue({ data: { data: [] } });

    render(<Search />, { wrapper: BrowserRouter });
    fireEvent.change(screen.getByPlaceholderText('Search companies...'), { target: { value: 'Unknown' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('No companies found matching your search criteria.')).toBeInTheDocument();
    });
  });

  it('displays an error message when the API call fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    render(<Search />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

  
    await waitFor(() => {
      expect(screen.getByText(/Error setting up the request/)).toBeInTheDocument();
    });
  });
  
});
