import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



export default function Profile() {
  
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const token = localStorage.getItem('authToken'); // Retrieve token
      console.log('User updated successfully');
  
      const res = await axios.post(`https://rentandcapture-backend.onrender.comapi/user/update/${currentUser._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      });
  
      const data = res.data;
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }
  
      dispatch(updateUserSuccess(data));
      console.log("user updated successfully");
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.response ? error.response.data.message : error.message));
    }
  };
  const handleCreateListingNavigate = () => {
 
      navigate('/create-listing');
  };

    const isAuthorizedUser = currentUser.username === 'upload' && currentUser.email === 'upload@gmail.com';

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem('authToken');
  
      const res = await axios.delete(`https://rentandcapture-backend.onrender.comapi/user/delete/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data = res.data;
      console.log('Response data:', data);
  
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        navigate('/sign-up');
        return;
      }
      dispatch(deleteUserSuccess(data));
      console.log('User deleted successfully');
  
      // Clear token and navigate to home page
      localStorage.removeItem('authToken');
      dispatch(signOutUser());
      navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error.response ? error.response.data.message : error.message));
      console.log('Error:', error);
    }
  };
  
  

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const token = localStorage.getItem('authToken');
      console.log('Token before request:', token); // Log token
  
      const res = await axios.post('https://rentandcapture-backend.onrender.comapi/auth/signout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = res.data;
      console.log('Response data:', data); // Log response data
  
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
  
      localStorage.removeItem('authToken');
      console.log('Token cleared'); // Log after clearing token
  
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.response ? error.response.data.message : error.message));
      console.log('Error:', error); // Log error details
    }
  };
  
  
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const token = localStorage.getItem('authToken');
  
      const res = await axios.get(`https://rentandcapture-backend.onrender.comapi/user/listings/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token
        },
      });
  
      const data = res.data;
      console.log('User Listings Response:', data); // Log response
  
      if (!data.success) {
        setShowListingsError(true);
        return;
      }
      console.log('Setting User Listings:', data.listings); // Log data being set
      setUserListings(data.listings); // Ensure data.listings is used
    } catch (error) {
      console.error("Error fetching listings:", error);
      setShowListingsError(true);
    }
  };
  console.log('Fetched Listings:', userListings);

  
  // Logging the state update
  useEffect(() => {
    console.log('User Listings State:', userListings); // Log state update
  }, [userListings]);
  
  
  const handleListingDelete = async (listingId) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.delete(`https://rentandcapture-backend.onrender.comapi/listing/delete/${listingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = res.data;
      if (!data.success) {
        console.log('Delete Error:', data.message);
        return;
      }
      console.log('Listing deleted successfully');
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error.response ? error.response.data.message : error.message);
    }
  };
  
  
  ([]);


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])}
          type='file' ref={fileRef}  hidden accept='image/*'  />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb) </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type='text' placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type='email' placeholder='email' id='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' placeholder='password' onChange={handleChange} id='password' className='border p-3 rounded-lg'/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
          {isAuthorizedUser && (
            
            <button
              className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              onClick={handleCreateListingNavigate}
            >
              Create Listing
            </button>
          
          
        )}
        
      </form>
  
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
  
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
     
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings && userListings.length > 0 && (
  <div className='flex flex-col gap-4'>
    <h1 className='text-center mt-7 text-2xl font-semibold'>
      Your Listings
    </h1>
    {userListings.map((listing) => (
      <div
        key={listing._id}
        className='border rounded-lg p-3 flex justify-between items-center gap-4'
      >
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]}
            alt='listing cover'
            className='h-16 w-16 object-contain'
          />
        </Link>
        <Link
          className='text-slate-700 font-semibold hover:underline truncate flex-1'
          to={`/listing/${listing._id}`}
        >
          <p>{listing.name}</p>
        </Link>

        <div className='flex flex-col items-center'>
          <button
            onClick={() => handleListingDelete(listing._id)}
            className='text-red-700 uppercase'
          >
            Delete
          </button>
          <Link to={`/update-listing/${listing._id}`}>
            <button className='text-green-700 uppercase'>Edit</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)}
  

    </div>
  )}

 
