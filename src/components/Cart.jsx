import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadRazorpay } from 'razorpay';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedItems = items.map(item => ({ ...item, quantity: item.quantity || 1 }));
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity += delta;
    if (updatedItems[index].quantity < 1) {
      updatedItems[index].quantity = 1;
    }
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = cartItems.filter((item, i) => i !== index);
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://rentandcapture-backend.onrender.comapi/payment/create-order', { amount: totalPrice });
      const { order } = res.data;
      const options = {
        key: 'rzp_test_j3PdL6SrWabTCJ',
        amount: order.amount,
        currency: order.currency,
        name: 'Camera Rental',
        description: 'Transaction',
        order_id: order.id,
        handler: async (response) => {
          const paymentResult = await axios.post('https://rentandcapture-backend.onrender.comapi/payment/verify', response);
          if (paymentResult.data.success) {
            alert('Payment successful!');
            localStorage.removeItem('cart');
            setCartItems([]);
            setTotalPrice(0);
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'your-email@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Camera Rental Service',
        },
        theme: {
          color: '#F37254',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Cart</h1>
      <div className='flex flex-col gap-4'>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <div className='flex items-center gap-4'>
                <img src={item.imageUrl} alt='listing cover' className='h-16 w-16 object-contain' />
                <div className='flex flex-col flex-1'>
                  <p className='text-lg font-semibold'>{item.name}</p>
                  <p>From {item.pickupDate} to {item.dropDate}</p>
                  <p>Price: ${item.totalPrice}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button 
                  onClick={() => handleQuantityChange(index, -1)}
                  className='p-3 bg-red-500 text-white rounded'
                >
                  -
                </button>
                <span><button className='p-2'>{item.quantity}</button></span>
                <button 
                  onClick={() => handleQuantityChange(index, 1)}
                  className='p-3 bg-green-500 text-white rounded'
                >
                  +
                </button>
                <button 
                  onClick={() => handleRemoveItem(index)}
                  className='p-2 bg-red-500 text-white rounded ml-4'
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
        {cartItems.length > 0 && (
          <>
            <p className='text-xl font-semibold'>Total Price: Rs.{totalPrice}</p>
            <button onClick={handlePayment} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95' disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
