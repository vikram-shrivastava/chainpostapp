import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  clerkuserid: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  imageUrl: { type: String, default: null },

  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    autosave: { type: Boolean, default: false },
  },

  notifications: {
    emailNotifications: { type: Boolean, default: true },
    newFeatures: { type: Boolean, default: true },
    weeklySummary: { type: Boolean, default: false },
  },

  storage: {
    used: { type: Number, default: 0 },
    limit: { type: Number, default: 10737418240 }, // 10 GB
  },

  billing: {
    plan: { type: String, default: 'free' },
    paymentMethod: { type: String, default: 'none' },
    customerId: { type: String, default: null },
  },

  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

const User =  mongoose.models.User || mongoose.model('User', userSchema);
export default User;