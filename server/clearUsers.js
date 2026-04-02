import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function clear() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodstreet');
  const result = await User.deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} users`);
  process.exit(0);
}

clear().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
