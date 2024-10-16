

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { FaShare, FaCamera } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';



const Listing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropDate, setDropDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken'); 
        console.log('Auth Token:', token);

        const res = await axios.get(` https://rentandcapture-backend.onrender.com/api/listing/get/${listingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        const data = res.data;
        console.log('Listing Data:', data);

        if (data.success) {
          setListing(data.listing);
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const isDateAvailable = (date) => {
    const pickupDate = new Date(listing.pickupDate);
    const dropDate = new Date(listing.dropDate);
    return date >= pickupDate && date <= dropDate;
  };

  useEffect(() => {
    if (pickupDate && dropDate) {
      const timeDiff = new Date(dropDate).getTime() - new Date(pickupDate).getTime();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      const pricePerDay = listing.offer ? listing.discountPrice : listing.price;
      const calculatedTotalPrice = days * pricePerDay;
      
      // Log prices to console
      console.log(`Price per day: ${pricePerDay}`);
      console.log(`Total price for ${days} days: ${calculatedTotalPrice}`);
      
      setTotalPrice(calculatedTotalPrice);
    }
  }, [pickupDate, dropDate, listing]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = {
      imageUrl: listing.imageUrls[0],
      name: listing.name,
      pickupDate: new Date(pickupDate).toLocaleDateString(),
      dropDate: new Date(dropDate).toLocaleDateString(),
      totalPrice,
    };
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/cart');
    }, 2000);
  };

  return (
    <main>
      {listing && (
        <div>
          <Swiper navigation>
        {listing.imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div className='relative h-80'>
              <img
                src={url}
                alt={listing.name}
                className='object-contain h-full w-full transition duration-300 ease-in-out transform hover:scale-105'
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} 
                         </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaCamera className='text-green-700' /> <span className='font-semibold text-black'>Brand:</span>
             <span className='text-slate-800'> {listing.brand}</span>
            </p>
            <p className='text-slate-800'>
              
              <span className='font-semibold text-black'>Model:</span>
             <span className='text-slate-800'> {listing.model}</span>
               
            </p>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Price: </span>
              ${listing.price}/day
            </p>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>What is included in this rental? </span>
              {listing.features || 'N/A'}
            </p>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Available Dates: </span>
              {`Pickup: ${new Date(listing.pickupDate).toLocaleDateString()} - Drop: ${new Date(listing.dropDate).toLocaleDateString()}`}
            </p>

            <div className='flex gap-4'>
              <DatePicker 
                selected={pickupDate} 
                onChange={(date) => setPickupDate(date)} 
                placeholderText="Select Pickup Date" 
                className='p-3 border border-gray-300 rounded-lg'
                filterDate={isDateAvailable}
              />
              <DatePicker 
                selected={dropDate} 
                onChange={(date) => setDropDate(date)} 
                placeholderText="Select Drop Date" 
                className='p-3 border border-gray-300 rounded-lg'
                filterDate={isDateAvailable}
              />
            </div>
            
            <p>Total Price: ${totalPrice}</p>

            {currentUser && listing.userRef !== currentUser._id && (
              <button onClick={handleAddToCart}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
