import React, {useEffect, useState} from 'react';
import api from '../api/api';
import Listings from "../components/ListingCard";


export default function Listings(){
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    setLoading(true);
    api.get('/listings')
    .then(res=> setListings(res.data || []))
    .catch(err=> {
      console.error('Failed to load listings', err);
      alert('Error:could not load listings - check backend is running');
    })
    .finally(()=> setLoading(false));
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Listings</h2>
      {loading ? <p>Loading...</p> : (
        <div>
          {listings.length === 0 && <p>No listings yet.</p>}
          {listings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
       </div>
  )}
  </div>
  );
}


