import { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  

  const fetchOfferListings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/listing/get?offer=true');
      const data = res.data;
      console.log('Offer Listings:', data);

      if (data.success) {
        setOfferListings(data.listings);
      }
      fetchRentListings();
    } catch (error) {
      console.log("Error fetching offer listings:", error);
    }
  };

  const fetchRentListings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/listing/get?type=rent');
      const data = res.data;
      console.log('Rent Listings:', data);

      if (data.success) {
        setRentListings(data.listings);
      }
    } catch (error) {
      console.log("Error fetching rent listings:", error);
    }
  };

  useEffect(() => {
    fetchOfferListings();
  }, []);

  return (
    <div>
       <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
        Camera hire made easy and <span className='text-slate-500'>perfect</span>
          <br />
         come on, place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
        Welcome to Rent&capture!!!! Hire from our large selection of cameras, lenses, lighting and audio equipment.
         <br />With online verification, live availability, India-wide shipping and 24/7 online booking.
          
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
       </div>
  );
}
