import { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { CommentSchema } from './Comment';

export interface TopicI extends Document {
  title: string;
  content: string;
  code: string;
  lang: string;
  user: string;
  comments: any[];
}

const TopicSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
    },

    code: {
      type: String,
      trim: true,
    },

    lang: {
      type: String,
      trim: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);
// plugins
TopicSchema.plugin(mongoosePaginate);

export default model<TopicI>('topic', TopicSchema);
