import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const [pickupDate, setPickupDate] = useState(null);
const [dropDate, setDropDate] = useState(null);
const [available, setAvailable] = useState(false);

const checkAvailability = async () => {
<<<<<<< HEAD
  const res = await axios.post('https://rentandcapture-backend.onrender.comapi/check-availability', { pickupDate, dropDate });
=======
  const res = await axios.post('https://server-rentcapture.onrender.com/api/check-availability', { pickupDate, dropDate });
>>>>>>> b3c8682706269dbd6071b63afc908f49dea081d5
  setAvailable(res.data.available);
};

return (
  <div>
    <DatePicker selected={pickupDate} onChange={(date) => setPickupDate(date)} placeholderText="Select Pickup Date" />
    <DatePicker selected={dropDate} onChange={(date) => setDropDate(date)} placeholderText="Select Drop Date" />
    <button onClick={checkAvailability}>Check Availability</button>
    {available ? 'Available' : 'Not Available'}
  </div>
);
