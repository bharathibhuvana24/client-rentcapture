import React from 'react';

const HowItWorks = () => {
  return (
    <section className='py-12' style={{ backgroundColor: 'rgb(200, 230, 200)' }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-extrabold text-gray-900 text-center mb-8'>
          How It Works
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          <div className='bg-blue-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Browse and Select</h3>
              <p className='text-gray-600'>
                Visit our website to browse our inventory. Use filters to find the perfect gear for your needs.
              </p>
            </div>
          </div>
          
          <div className='bg-green-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Reserve Your Gear</h3>
              <p className='text-gray-600'>
                Select the items you need, choose your rental dates, and make a reservation. It's that easy!
              </p>
            </div>
          </div>
          
          <div className='bg-yellow-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Pick Up or Delivery</h3>
              <p className='text-gray-600'>
                Choose to pick up your gear from our location or have it delivered to your doorstep.
              </p>
            </div>
          </div>
          
          <div className='bg-red-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Capture and Create</h3>
              <p className='text-gray-600'>
                Use our equipment to bring your vision to life. Need help? Our support team is just a call away.
              </p>
            </div>
          </div>
          
          <div className='bg-purple-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Return and Repeat</h3>
              <p className='text-gray-600'>
                Once your rental period is over, return the gear. Need it longer? Extend your rental with a few clicks.
              </p>
            </div>
          </div>
          
          <div className='bg-pink-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Customer Support</h3>
              <p className='text-gray-600'>
                We're here to assist you with any questions or issues. Our support team is available 24/7.
              </p>
            </div>
          </div>
          
          <div className='bg-teal-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Exclusive Offers</h3>
              <p className='text-gray-600'>
                Join our community for exclusive offers, discounts, and the latest updates on new gear.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
