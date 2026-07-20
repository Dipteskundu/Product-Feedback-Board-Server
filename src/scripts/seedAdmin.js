import mongoose from 'mongoose';
import Actor from '../models/Actor.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@feedbackboard.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin';

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Actor.findOne({ email }).select('+password');
    if (existing) {
      existing.role = 'admin';
      existing.type = 'registered';
      existing.password = password;
      await existing.save();
      console.log(`Updated existing user ${email} to admin role`);
    } else {
      await Actor.create({
        type: 'registered',
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(`Created admin user: ${email}`);
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedAdmin();
