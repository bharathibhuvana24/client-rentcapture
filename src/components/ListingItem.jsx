import { Link } from 'react-router-dom';

export default function ListingItem({ listing }) {
  console.log("ListingItem props:", listing);
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name}
          </p>
          
          <p className='text-slate-700 mt-2 text-center font-bold'>
            Price:
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.price.toLocaleString('en-US')}
          </p>
          <div className='text-slate-700 flex flex-col gap-2 text-center'>
            <div className='font-bold text-xs'>
              Brand: {listing.brand}
            </div>
            <div className='font-bold text-xs'>
              Model: {listing.model}
            </div>
            
            <div className='font-bold text-xs'>
              Available: {listing.available ? 'Yes' : 'No'}
            </div>
           
          </div>
        </div>
      </Link>
    </div>
  );
}
