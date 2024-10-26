


import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const { currentUser } = useSelector((state) => state.user);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    offer: false,
    available: false,
    sort: 'createdAt',
    order: 'desc',
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [startIndex, setStartIndex] = useState(0);
  const limit = 9;
  const [sortOrder, setSortOrder] = useState('createdAt_desc');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    urlParams.set('limit', limit);
    try {
      const res = await axios.get(`https://rentandcapture-backend.onrender.com/api/listing/get?${urlParams.toString()}`);
      const data = res.data;
      if (data.success) {
        let sortedListings = data.listings;
        if (sortOrder.includes('price')) {
          sortedListings = sortedListings.sort((a, b) => {
            return sortOrder === 'price_asc' ? a.price - b.price : b.price - a.price;
          });
        } else if (sortOrder.includes('createdAt')) {
          sortedListings = sortedListings.sort((a, b) => {
            return sortOrder === 'createdAt_asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
          });
        }
        setListings(startIndex === 0 ? sortedListings : [...listings, ...sortedListings]);
        setShowMore(data.listings.length === limit);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.search, startIndex, sortOrder]);

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const res = await axios.get(`https://rentandcapture-backend.onrender.com/api/listing/autocomplete?searchTerm=${searchTerm}`);
          setSuggestions(res.data.suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error.message);
          setSuggestions([]);
        }
      }
     }
     }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSelect = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    navigate(`/search?searchTerm=${suggestion}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setListings([]);
    setStartIndex(0);
    fetchData();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebardata((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setStartIndex(0);
    setListings([]); // Clear current listings before fetching new sorted data
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setStartIndex(0);
    setListings([]); // Clear current listings before fetching new sorted data
  };

  const handleShowMore = () => {
    setStartIndex((prevIndex) => prevIndex + limit);
  };

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterBrand ? listing.brand === filterBrand : true) &&
    listing.price >= priceRange[0] && listing.price <= priceRange[1]
  );


return (
  <div className='flex flex-col md:flex-row'>
    <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
        <div className='flex items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>Search Term:</label>
          <input
            type='text'
            id='searchTerm'
            value={sidebardata.searchTerm}
            onChange={handleSearchChange}
            placeholder='Search...'
            className='border rounded-lg p-3 w-full'
          />
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label className='font-semibold'>Type:</label>
          <div className='flex gap-2'>
            <input
              onChange={handleChange}
              checked={sidebardata.type === 'all'}
              type='checkbox'
              id='all'
              className='w-5'
            />
            <span>All</span>
          </div>
          <div className='flex gap-2'>
            <input
              onChange={handleChange}
              checked={sidebardata.type === 'rent'}
              type='checkbox'
              id='rent'
              className='w-5'
            />
            <span>Rent</span>
          </div>
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label className='font-semibold'>Availability:</label>
          <div className='flex gap-2'>
            <input
              onChange={handleChange}
              checked={sidebardata.available}
              type='checkbox'
              id='available'
              className='w-5'
            />
            <span>Available</span>
          </div>
          <div className='flex gap-2'>
            <input
              onChange={handleChange}
              checked={sidebardata.offer}
              type='checkbox'
              id='offer'
              className='w-5'
            />
            <span>Offer</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <label className='font-semibold'>Sort:</label>
          <select
            onChange={handleSortChange}
            defaultValue={'createdAt_desc'}
            id='sort_order'
            className='border rounded-lg p-3'
          >
            <option value='price_desc'>Price high to low</option>
            <option value='price_asc'>Price low to high</option>
          </select>
        </div>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          Search
        </button>
      </form>
    </div>
    <div className='flex-1'>
      <h1 className='text-3xl font-semibold text-center my-7'>Listing Results</h1>
      <div className='p-7 flex flex-wrap gap-4'>
        {!loading && filteredListings.length === 0 && (
          <p className='text-xl text-slate-700'>Please <Link to={'/sign-in'}> signin </Link> to view Listings!!</p>
        )}
        {loading && (<p>Loading...</p>)}
        {!loading && filteredListings && filteredListings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
        {showMore && (
            <button onClick={handleShowMore} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}