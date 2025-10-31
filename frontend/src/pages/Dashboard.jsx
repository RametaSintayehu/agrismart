import React, {useEffect, useState} from 'react';
import api from '../api/api';


export default function Dashboard(){
const [listings, setListings] = useState([]);


useEffect(()=>{
// fetch user's listings - currently backend supports filtering by owner query param
api.get('/listings')
.then(res=> setListings(res.data.filter(l => l.owner && l.owner._id === (localStorage.getItem('agrismart_user_id')||''))))
.catch(err=> console.error(err));
},[]);


return (
<div style={{padding:20}}>
<h2>Dashboard</h2>
<p>Under construction: create and manage your listings here.</p>
<div>
{listings.map(l=> <div key={l._id}>{l.title}</div>)}
</div>
</div>
);
}