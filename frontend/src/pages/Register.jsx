import React, {useState} from 'react';
import api from '../api/api';
import {saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Register(){
    const [form, setForm] = useState({name:'', email:'', password:''});
    const navigate = useNavigate();
    const [error, setError] = useState(null);


    const handle = e=> setForm({...form, [e.target.name]: e.target.value});
    const submit = async e=>{
        e.preventDefault();
        setError(null);
        try{
            const res = await api.post('/auth/register', form);
            saveToken(res.data.token);
            navigate('/dashboard');
        } catch(err){
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{padding:20}}>
            <h2>Register</h2>
            {error && <div style={{color:'red'}}>{error}</div>}
            <form onSubmit={submit} style={{maxWidth:400}}>
                <input name='name' placeholder="name" value={form.name} onchange={handle} required /> <br/>
            <input name="email" placeholder="Email" value={form.email} onChange={handle} required /><br/>
<input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required /><br/>
<input name="location" placeholder="Location" value={form.location} onChange={handle} /><br/>
<select name="role" value={form.role} onChange={handle}>
<option value="farmer">Farmer</option>
<option value="buyer">Buyer</option>
</select><br/>
<button type="submit">Register</button>
</form>
</div>
    );
}