import { useState } from 'react';
import { apiService } from '../services/api';

interface AppointmentForm {
  name: string;
  email: string;
  mobile_number: string;
  date: string;
  time: string;
  about_appoint: string;
  purity: string;
  dimond_type: string;
  jew_cate: string;
  purpose: string;
  subject: string;
}

const Appointment = () => {
  const [formData, setFormData] = useState<AppointmentForm>({
    name: '',
    email: '',
    mobile_number: '',
    date: '',
    time: '',
    about_appoint: '',
    purity: '',
    dimond_type: '',
    jew_cate: '',
    purpose: '',
    subject: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiService.submitAppointment(formData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Appointment booked successfully! We will contact you soon.' });
        setFormData({
          name: '',
          email: '',
          mobile_number: '',
          date: '',
          time: '',
          about_appoint: '',
          purity: '',
          dimond_type: '',
          jew_cate: '',
          purpose: '',
          subject: ''
        });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to book appointment. Please try again.' });
      }
    } catch (error) {
      console.error('Appointment booking error:', error);
      setMessage({ type: 'error', text: 'Failed to book appointment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Schedule a visit to our store for personalized service
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    placeholder="Mobile number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Appointment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time *
                  </label>
                  <select 
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    required
                  >
                    <option value="">Select time slot</option>
                    <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                    <option value="12:00 PM">12:00 PM - 1:00 PM</option>
                    <option value="2:00 PM">2:00 PM - 3:00 PM</option>
                    <option value="3:00 PM">3:00 PM - 4:00 PM</option>
                    <option value="4:00 PM">4:00 PM - 5:00 PM</option>
                    <option value="5:00 PM">5:00 PM - 6:00 PM</option>
                    <option value="6:00 PM">6:00 PM - 7:00 PM</option>
                    <option value="7:00 PM">7:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose of Visit *
                </label>
                <select 
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="wedding">Wedding Jewellery Consultation</option>
                  <option value="purchase">General Purchase</option>
                  <option value="custom">Custom Design Discussion</option>
                  <option value="exchange">Gold Exchange</option>
                  <option value="repair">Jewellery Repair/Service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief subject for your appointment"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gold Purity Interest
                  </label>
                  <select 
                    name="purity"
                    value={formData.purity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select purity</option>
                    <option value="24K">24K Gold</option>
                    <option value="22K">22K Gold</option>
                    <option value="18K">18K Gold</option>
                    <option value="14K">14K Gold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diamond Type Interest
                  </label>
                  <select 
                    name="dimond_type"
                    value={formData.dimond_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select diamond type</option>
                    <option value="natural">Natural Diamond</option>
                    <option value="lab-grown">Lab Grown Diamond</option>
                    <option value="both">Both</option>
                    <option value="none">No Diamond</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jewellery Category Interest
                </label>
                <select 
                  name="jew_cate"
                  value={formData.jew_cate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Select category</option>
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="chains">Chains</option>
                  <option value="pendants">Pendants</option>
                  <option value="sets">Jewellery Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="about_appoint"
                  value={formData.about_appoint}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any specific requirements or preferences..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking Appointment...' : 'Book Appointment'}
            </button>

            <div className="text-xs text-gray-500 space-y-2">
              <p>✅ You'll receive a confirmation SMS/email</p>
              <p>✅ Free consultation with our jewellery experts</p>
              <p>✅ Priority service during your visit</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
