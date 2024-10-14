import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dotnev from 'dotenv';
dotnev.config();

const CheckoutForm = ({ amount }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      setLoading(true);
      try {
        const { data } = await axios.post('https://server-rentcapture.onrender.com/api/payment/create-order', { amount });
        const options = {
          key: process.env.RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          order_id: data.order.id,
          handler: async (response) => {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
            const verificationData = {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            };
            const result = await axios.post('https://server-rentcapture.onrender.com/api/payment/verify-payment', verificationData);
            if (result.data.success) {
              navigate('/profile');
            } else {
              console.error('Payment verification failed');
            }
          },
          theme: {
            color: '#3399cc',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Error initiating payment:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95' disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
    </form>
  );
};

export default CheckoutForm;
