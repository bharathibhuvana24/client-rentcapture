import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Cart() {
  const { currentUser } = useSelector((state) => state.user);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser || !currentUser._id) {
        navigate('/sign-in');
        return;
      }
      try {
        const res = await axios.get(`https://rentandcapture-backend.onrender.com/api/cart/${currentUser._id}`);
        const { cart } = res.data;
        console.log('Fetched Cart:', cart);
        setCartItems(cart?.items || []);
        calculateTotalPrice(cart?.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, [currentUser, navigate]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = async (index, delta) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity += delta;
    if (updatedItems[index].quantity < 1) {
      updatedItems[index].quantity = 1;
    }
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
    try {
      const res = await axios.post(`https://rentandcapture-backend.onrender.com/api/cart/update/${currentUser._id}`, { items: updatedItems });
      console.log('Updated Cart:', res.data.cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (index) => {
    const updatedItems = cartItems.filter((item, i) => i !== index);
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
    try {
      const res = await axios.post(`https://rentandcapture-backend.onrender.com/api/cart/update/${currentUser._id}`, { items: updatedItems });
      console.log('Updated Cart:', res.data.cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://rentandcapture-backend.onrender.com/api/payment/create-order', { amount: totalPrice });
      const { order } = res.data;
      const options = {
        key: 'rzp_test_j3PdL6SrWabTCJ',
        amount: order.amount,
        currency: order.currency,
        name: 'Camera Rental',
        description: 'Transaction',
        order_id: order.id,
        handler: async (response) => {
          const paymentResult = await axios.post('https://rentandcapture-backend.onrender.com/api/payment/verify', response);
          if (paymentResult.data.success) {
            setPaymentSuccess(true);
            await axios.post(`https://rentandcapture-backend.onrender.com/api/cart/clear/${currentUser._id}`);
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
        {paymentSuccess ? (
          <div className='text-center'>
            <h2 className='text-2xl font-semibold'>Thank You!</h2>
            <p>Your order has been successfully placed.</p>
            <button
              onClick={() => navigate('/search')}
              className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 mt-4'
            >
              Shop More
            </button>
          </div>
        ) : (
          <>
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
                <button
                  onClick={handlePayment}
                  className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
