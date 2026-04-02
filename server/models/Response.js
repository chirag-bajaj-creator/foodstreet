import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  name: { type: String },
  city: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  responses: [
    {
      category: String,
      questions: [
        {
          question: String,
          answer: { type: String, enum: ['Yes', 'No'] }
        }
      ]
    }
  ]
});

export default mongoose.model('Response', responseSchema);
