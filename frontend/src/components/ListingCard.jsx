import React from 'react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3>
        <Link to={`/listings/${listing._id}`}>{listing.title}</Link>
      </h3>
      <p>{listing.description}</p>
      <div>Price: {listing.price} | Qty: {listing.quantity} {listing.unit}</div>
      <div>Location: {listing.location}</div>
      <div>Farmer: {listing.owner?.name || '—'}</div>
    </div>
  );
}
