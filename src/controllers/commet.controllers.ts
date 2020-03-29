import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import ModelTopic from '../models/Topic';
import { UserI } from '../models/User';
import { CommentI } from '../models/Comment';

export const createComment = async (req: Request, res: Response) => {
  const user: UserI = req.user;
  if (!user) {
    return res.status(400).json({
      status: 'Error',
      msg: 'You are not authenticated',
    });
  }

  // id topic
  const topicId = req.params.topic;
  if (!topicId || !isValidObjectId(topicId)) {
    return res.status(404).json({
      status: 'error',
      msg: 'Topic no found!',
    });
  }

  //  searching topic
  const topic = await ModelTopic.findById({ _id: topicId });

  if (!topic) {
    return res.status(404).json({
      status: 'error',
      msg: 'Topic no found!',
    });
  }
  //  object commnet
  const comment: CommentI = {
    content: req.body.content,
    user: user.id,
  };

  topic.comments.push(comment);

  topic.save();

  return res.status(201).json({
    status: 'success',
    msg: 'Commnet created',
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const user: UserI = req.user;

  // authenticated
  if (!user) {
    return res.status(400).json({
      status: 'Error',
      msg: 'You are not authenticated',
    });
  }

  const commentId = req.params.comment;
  if (!commentId || !isValidObjectId(commentId)) {
    return res.status(404).json({
      status: 'Error',
      msg: 'Comment no found',
    });
  }

  const topic: TopicI = await ModelTopic.findOne({
    'comments._id': commentId,
  });

  if (!topic) {
    return res.status(404).json({
      status: 'Error',
      msg: 'Topic no found',
    });
  }

  const comment = topic.comments.id(commentId);

  if (user.id == comment.user) {
    await ModelTopic.findOneAndUpdate(
      {
        'comments._id': commentId,
      },
      {
        $set: {
          'comments.$.content': req.body.content,
        },
      }
    );

    return res.status(200).json({
      status: 'sucess',
      msg: 'comment update',
    });
  }
  return res.status(400).json({
    status: 'error',
    msg: 'You are not authorized',
  });
};

export const deleteComment = async (req: Request, res: Response) => {
  const user: UserI = req.user;

  // authenticated
  if (!user) {
    return res.status(400).json({
      status: 'Error',
      msg: 'You are not authenticated',
    });
  }

  const commentId = req.params.comment;
  if (!commentId || !isValidObjectId(commentId)) {
    return res.status(404).json({
      status: 'Error',
      msg: 'Comment no found',
    });
  }

  const topic: TopicI = await ModelTopic.findOne({
    'comments._id': commentId,
  });

  if (!topic) {
    return res.status(404).json({
      status: 'Error',
      msg: 'Topic no found',
    });
  }

  const comment = topic.comments.id(commentId);

  if (
    user.id == comment.user ||
    user.id == comment.user ||
    user.role == 'admin'
  ) {
    await comment.remove();

    await topic.save();
    return res.status(200).json({
      status: 'success',
      msg: 'comment deleted',
      topic,
    });
  }
  return res.status(400).json({
    status: 'error',
    msg: 'You are not authorized',
  });
};
