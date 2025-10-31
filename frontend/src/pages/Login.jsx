import React, {useState} from 'react';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';


export default function Login(){
const [form, setForm] = useState({ email:'', password:'' });
const navigate = useNavigate();
const [error, setError] = useState(null);


const handle = e => setForm({...form, [e.target.name]: e.target.value});
const submit = async e => {
e.preventDefault();
setError(null);
try{
const res = await api.post('/auth/login', form);
saveToken(res.data.token);
navigate('/dashboard');
}catch(err){
console.error(err);
setError(err.response?.data?.message || 'Login failed');
}
};


return (
<div style={{padding:20}}>
<h2>Login</h2>
{error && <div style={{color:'red'}}>{error}</div>}
<form onSubmit={submit} style={{maxWidth:400}}>
<input name="email" placeholder="Email" value={form.email} onChange={handle} required /><br/>
<input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required /><br/>
<button type="submit">Login</button>
</form>
</div>
);
}