import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CompanyDetail.css';

interface CompanyDetails {
  id: string;
  name: string;
  city: string;
  zipCode: string;
  streetName: string;
  logo: string;
  catchPhrase: string;
  website: string;
  phoneNumber: string;
}

interface LocationState {
  company: CompanyDetails;
}

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state && state.company) {
      setCompany(state.company);
    }

    axios.get(`https://617c09aad842cf001711c200.mockapi.io/v1/companies/${id}/details`)
      .then(response => {
        const details = response.data.data[0];
        setCompany(prevCompany => ({
          ...prevCompany,
          ...details
        }));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch additional company details: ' + err.message);
        setLoading(false);
      });
  }, [id, state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!company) return <div>No company found.</div>;

  return (
    <div>
      <h1>Company Details: {company?.name}</h1>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>Company ID</th>
            <td>{company?.id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{company?.name}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{company?.city}</td>
          </tr>
          <tr>
            <th>Zip Code</th>
            <td>{company?.zipCode}</td>
          </tr>
          <tr>
            <th>Street Name</th>
            <td>{company?.streetName}</td>
          </tr>
          <tr>
            <th>Topic</th>
            <td>{company?.catchPhrase}</td>
          </tr>
          <tr>
            <th>Website</th>
            <td>{company?.website ? <a href={company?.website} target="_blank" rel="noopener noreferrer">{company?.website}</a> : 'N/A'}</td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>{company?.phoneNumber || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompanyDetail;
