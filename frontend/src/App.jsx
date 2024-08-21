import './App.css'
import {BrowserRouter as Router,Routes,Route, Navigate  } from "react-router-dom"
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import NotFound from './Components/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvalidAccess from './Components/NotFound';
import UpdateUser from './Components/UpdateUser';
import UserList from './Components/UserList';


const App =()=>{
  return(
<Router>
<ToastContainer
                limit={1}
                position="top-right"
                autoClose={3000} 
            />
  <Routes>
    <Route path="/" element={<Navigate to={'/login'}/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='*' element={<NotFound/>}/>
    <Route path='invalid-access' element={<InvalidAccess/>}/>
    <Route path="/register" index element={<Register />} />
    <Route path="/all-users" index element={<UserList />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</Router>
  );
}

export default App;