import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Search from './components/Search';
import CompanyDetail from './components/CompanyDetail';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/companies/:id/details" element={<CompanyDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
