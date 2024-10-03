import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const [pickupDate, setPickupDate] = useState(null);
const [dropDate, setDropDate] = useState(null);
const [available, setAvailable] = useState(false);

const checkAvailability = async () => {
  const res = await axios.post('http://localhost:3000/api/check-availability', { pickupDate, dropDate });
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
