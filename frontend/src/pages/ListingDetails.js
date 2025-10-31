import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(err => {
        console.error(err);
        alert('Error loading listing');
      });
  }, [id]);

  if (!listing) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <div>Price: {listing.price}</div>
      <div>Quantity: {listing.quantity} {listing.unit}</div>
      <div>Location: {listing.location}</div>
      <div>Owner: {listing.owner?.name} — {listing.owner?.email}</div>
    </div>
  );
}