import React from 'react';
import CreateListing from './pages/CreateListing';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <route path='/create-listing' element={<CreateListing/>}/>
      </Routes>
    </Router>
  );
}

export default App;

