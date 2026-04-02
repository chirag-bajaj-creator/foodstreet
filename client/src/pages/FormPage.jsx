import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

const FORM_STRUCTURE = [
  {
    category: 'EXTERIOR',
    questions: [
      'Check Exterior Food Court Signages are clean and in good repair',
      'All Exterior lights are clean, functioning and in good repair',
      'Façade is clean and in good repair',
      'Entrance door - Clean and functioning Air Cutter/Curtain',
      'Check Parking lot is clean and well maintained'
    ]
  },
  {
    category: 'RESTROOMS',
    questions: [
      'Verify all restroom compartments are operational (door, lock, flush, light in working condition)',
      'All Mirrors, Urinals, Sinks & Tiles are clean',
      'All restrooms have good odour and adequate toiletries (Male & Female)'
    ]
  },
  {
    category: 'FOH/DINING AREA',
    questions: [
      'FOH Temperature is maintained - 22°C to 24°C',
      'The Music is playing and is appropriately audible',
      'All Chairs & Tables are clean and in good repair',
      'Walls, Ceiling & Windows are clean and in good repair',
      'All FOH lights are functioning, clean and in good repair',
      'Dine in HK staff is well groomed',
      'Tables are cleared and cleaned within 3 minutes of guest\'s leaving',
      'Dine in Dustbins are clean and not overflowing',
      'All FOH Chemicals are labeled and kept in their designated area only'
    ]
  },
  {
    category: 'CSR COUNTER (ALL BRANDS)',
    questions: [
      'DMB, Kiosk, Menu Boards are Synced and Working',
      'Ensure availability of EDC roll, Bill roll, Manual bill book, Float, change',
      'Ensure availability of the packaging material',
      'Ensure Core Menu items are available. Report any critical availability to the Area Manager',
      'All required marketing Collaterals/Tilt cards are available in good condition and displayed',
      'Ensure Visi coller is fully stock up and All can items are available',
      'All licenses & certificates are available and displayed in customers visibility - GST, FSSAI, Fostac, FSDB, Weighing scale',
      'All TM is well groomed and CSR following all 4 MOT\'s - Greeting, Order taking, Serving & Thanking'
    ]
  }
];

export default function FormPage() {
  const navigate = useNavigate();
  useSessionTimeout(false);
  const [city, setCity] = useState('');
  const [responses, setResponses] = useState(
    FORM_STRUCTURE.map(card => ({
      category: card.category,
      questions: card.questions.map(q => ({ question: q, answer: '' }))
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleAnswerChange = (cardIndex, questionIndex, answer) => {
    const updated = [...responses];
    updated[cardIndex].questions[questionIndex].answer = answer;
    setResponses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError('Please enter your city');
      return;
    }

    const allAnswered = responses.every(card =>
      card.questions.every(q => q.answer !== '')
    );

    if (!allAnswered) {
      setError('Please answer all questions');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        '/api/responses/submit',
        { email: userId, responses, city, name: userName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Show success message
      setSuccess('✅ Response submitted successfully!');
      setError('');

      // Reset form for multiple submissions
      setCity('');
      setResponses(
        FORM_STRUCTURE.map(card => ({
          category: card.category,
          questions: card.questions.map(q => ({ question: q, answer: '' }))
        }))
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit response');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Food Street</h1>
          <button
            onClick={() => navigate('/landing')}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-16 px-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-3 text-center">
          Inspection Checklist
        </h2>
        <p className="text-gray-600 text-center mb-12 text-lg">
          Please answer all questions to complete the inspection
        </p>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* City Input */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          {responses.map((card, cardIndex) => (
            <div
              key={cardIndex}
              className="bg-white rounded-xl shadow-lg p-10 border-l-4 border-indigo-500 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-indigo-200">
                {card.category}
              </h3>

              <div className="space-y-6">
                {card.questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="flex items-start justify-between gap-6 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <label className="text-gray-700 font-medium flex-1 pt-2 leading-relaxed">
                      {qIndex + 1}. {q.question}
                    </label>
                    <select
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(cardIndex, qIndex, e.target.value)}
                      className="ml-4 px-5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[130px] font-medium"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg font-semibold">
              {success}
            </div>
          )}

          <div className="flex gap-4 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
            >
              {loading ? 'Submitting...' : 'Submit Inspection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
