import { loadRazorpay } from 'razorpay';
import dotnev from 'dotenv';
dotnev.config();

const handlePayment = async () => {
<<<<<<< HEAD
  const res = await axios.post('https://rentandcapture-backend.onrender.comapi/payment', { amount: formData.price });
=======
  const res = await axios.post('https://server-rentcapture.onrender.com/api/payment', { amount: formData.price });
>>>>>>> b3c8682706269dbd6071b63afc908f49dea081d5
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
