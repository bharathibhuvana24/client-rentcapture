import { loadRazorpay } from 'razorpay';
import dotnev from 'dotenv';
dotnev.config();

const handlePayment = async () => {
  const res = await axios.post(' https://rentandcapture-backend.onrender.com/api/payment', { amount: formData.price });
  const options = {
    key: process.env.RAZORPAY_KEY_ID,
    amount: res.data.amount,
    currency: 'INR',
    name: 'Camera Rental',
    description: 'Transaction',
    image: 'YOUR_LOGO_URL',
    handler: function (response) {
      alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    },
  };
  const rzp = new Razorpay(options);
  rzp.open();
};

return (
  <div>
    <button onClick={handlePayment}>Pay Now</button>
  </div>
);
