import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import './Search.css';

interface Company {
  id: string;
  name: string;
  city: string;
  zipCode: string;
  streetName: string;
  createdAt: string;
}

const Search = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCompanies = (query = '') => {
    setLoading(true);
    setError(null);
    setNoResults(false); 
    const url = `https://617c09aad842cf001711c200.mockapi.io/v1/companies${query ? `?search=${encodeURIComponent(query)}` : ''}`;
    axios.get(url)
      .then(response => {
        if (response.data.data.length === 0) {
            setNoResults(true);
          }
          else {
            setCompanies(response.data.data);
          }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setNoResults(true);
              break;
            case 500:
              setError("Server error occurred. Please try again later.");
              break;
            default:
              setError("An unexpected error occurred. Please try again.");
          }
        } else if (error.request) {
          setError("No response from server. Check your network connection.");
        } else {
          setError("Error setting up the request.");
        }
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Debounce the search call
  const debouncedSearch = debounce((query) => {
    fetchCompanies(query);
  }, 500);

  // Update search term and make debounced API call
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Function to handle immediate search on button click
  const handleSearchClick = () => {
    fetchCompanies(searchTerm);
  };

  if (error) {
    return <div className="container my-5">Error: {error}</div>;
  }

  return (
    <div className="container my-5">
    <div className="row justify-content-center">
      <div className="col-12">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search companies..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-secondary" onClick={handleSearchClick}>
            Search
          </button>
        </div>
        <h2>Company List</h2>
        {loading ? (
          <p>Loading companies...</p>
        ) : noResults ? (
          <p>No companies found matching your search criteria.</p>
        ) : (
          <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Zip Code</th>
                <th>Street Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id}>
                  <td>{company.name}</td>
        <td>{company.city}</td>
        <td>{company.zipCode}</td>
        <td>{company.streetName}</td>
                  <td>
                      <Link to={`/companies/${company.id}/details`} state={{ company }} className="btn btn-info">
                        View Details
                        </Link>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

export default Search;
