import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className=" header text-white text-center p-3">
      <h1><Link to="/" className="text-decoration-none text-white">KVK</Link></h1>
    </header>
  );
}

export default Header;
