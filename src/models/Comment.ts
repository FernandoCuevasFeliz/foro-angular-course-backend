import { Schema, model, Document } from 'mongoose';

export interface CommentI extends Document {
  content: string;
  user: string;
}

export const CommentSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default model<CommentI>('comment', CommentSchema);
