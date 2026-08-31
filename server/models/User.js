import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pantryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'A valid email address is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: 8,
      select: false, // never returned by default
    },
    pantry: {
      type: [pantryItemSchema],
      default: [],
    },
    // Stores Recipe.recipeId strings (not ObjectId refs — recipes can also be
    // AI-generated at request time and never persisted to the Recipe collection).
    savedRecipes: {
      type: [String],
      default: [],
    },
    // SHA-256 hashes of currently-valid refresh tokens (one per logged-in device).
    // Never store raw refresh tokens. Capped at 5 so old devices roll off.
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

// Hash password before save, only when it changes
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never leak password or refresh token hashes to the client
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
export default User;
