import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserI extends Document {
  name: string;
  surname: string;
  sex: string;
  email: string;
  password: string;
  image: string;
  role: string;
}

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    surname: {
      type: String,
      trim: true,
      required: true,
    },
    sex: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      trim: true,
      minlength: 6,
      required: true,
    },

    image: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      trim: true,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<UserI>('save', async function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

export default model<UserI>('user', UserSchema);
