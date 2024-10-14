import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const {listingId} = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    condition: '',
    description: '',
    price: 0,
    discountPrice: 0,
    offer: false,
    pickupDate: '',
    dropDate: '',
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`https://server-rentcapture.onrender.com/api/listing/get/${listingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = res.data;
        console.log('Fetched Data:', data);
        if (data.success) {
          setFormData(data.listing);
        } else {
          setError('Error fetching listing data');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing data:', error);
        setError('Something went wrong!');
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);
  
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };
 
  

  const handleUpdateListing = async (e) => {
    e.preventDefault();
    console.log('FormData before update:', formData);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`https://server-rentcapture.onrender.com/api/listing/update/${listingId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      });
      const data = res.data;
      console.log('Update Response:', data);
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }
      console.log('Listing updated successfully');
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.error('Error updating listing:', error.response ? error.response.data.message : error.message);
      setError(error.response ? error.response.data.message : error.message);
      setLoading(false);
    }
  };
  
  
  

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleUpdateListing} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type='text'
            placeholder='Brand'
            className='border p-3 rounded-lg'
            id='brand'
            required
            onChange={handleChange}
            value={formData.brand}
          />
          <input
            type='text'
            placeholder='Model'
            className='border p-3 rounded-lg'
            id='model'
            required
            onChange={handleChange}
            value={formData.model}
          />
          <input
            type='text'
            placeholder='Condition'
            className='border p-3 rounded-lg'
            id='condition'
            required
            onChange={handleChange}
            value={formData.condition}
          />
          <textarea
            type='text'
            placeholder='Features'
            className='border p-3 rounded-lg'
            id='features'
            required
            onChange={handleChange}
            value={formData.features}
          />
          <input
            type='number'
            placeholder='Price'
            className='border p-3 rounded-lg'
            id='price'
            required
            onChange={handleChange}
            value={formData.price}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discounted Price</p>
              </div>
            )}
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='date'
                id='pickupDate'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.pickupDate}
              />
              <p>Pickup Date</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='date'
                id='dropDate'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.dropDate}
              />
              <p>Drop Date</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>
              Images:
              <span className='font-normal text-gray-600 ml-2'>
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className='flex gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-gray-300 rounded w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className='text-red-700 text-sm'>
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className='flex justify-between p-3 border items-center'
                >
                  <img
                    src={url}
                    alt='listing image'
                    className='w-20 h-20 object-contain rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              disabled={loading || uploading}
              type='submit'
              className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? 'Creating...' : 'Update listing'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
      </form>
    </main>
  );
}
