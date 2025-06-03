
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, 'El nombre debe contener al menos 3 caracteres'],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, 'El apellido debe contener al menos 3 caracteres'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      default: ['base'],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);