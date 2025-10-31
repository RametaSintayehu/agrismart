import React from 'react';
import {Link } from "react-router-dom";


export default function Home() {
  return (
    <div style={{padding:20}}>
      <h1>Welcome to AgriSmart</h1>
      <p>Find local produce from farmers near you.</p> 
      <Link to = '/listings'>Browse listings</Link>
      </div>
  );
}