import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
      <Link to='/' style={{ marginRight: 12 }}>AgriSmart</Link>
      <Link to='/listings' style={{ marginRight: 12 }}>Listings</Link>
      <Link to='/login' style={{ marginRight: 12 }}>Login</Link>
      <Link to='/register'>Register</Link>
    </nav>
  );
}