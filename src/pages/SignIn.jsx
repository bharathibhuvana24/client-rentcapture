import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const { error: reduxError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); 
      dispatch(signInStart());
      const res = await axios.post(' https://rentandcapture-backend.onrender.com/api/auth/signin', formData);
      const data = res.data;
      console.log('Received token:', data.token);  
  
      if (!data.success) {
        setFormError(data.message);
        setLoading(false);
        return;
      }
  
      localStorage.setItem('authToken', data.token);  
      console.log('Stored token:', localStorage.getItem('authToken'));  
  
      dispatch(signInSuccess(data));
      navigate('/'); 
      setLoading(false); 
    } catch (error) {
      setFormError(error.response ? error.response.data.message : error.message);
      setLoading(false); 
    }
  };
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        {formError && <p className='text-red-500 mt-5'>{formError}</p>} 
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {reduxError && <p className='text-red-500 mt-5'>{reduxError}</p>} 
    </div>
  );
}
