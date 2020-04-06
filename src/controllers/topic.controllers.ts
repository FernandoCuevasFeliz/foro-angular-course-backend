import { Request, Response, response } from 'express';
import { isValidObjectId } from 'mongoose';
import { UserI } from '../models/User';
import ModelTopic, { TopicI } from '../models/Topic';
import paginateTopic from '../libs/paginate/topicsPaginate';

import paginateTopicsUser from '../libs/paginate/topicsUserPaginate';

export const createTopic = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user: UserI = req.user;
  if (user) {
    const topic = {
      title: req.body.title,
      content: req.body.content,
      code: req.body.code,
      lang: req.body.lang,
      user: user.id,
    };

    const newTopic = new ModelTopic(topic);

    await newTopic.save((err, response) => {
      if (err || !response) {
        return res.status(400).json({
          status: 'error',
          msg: 'Error creating topic',
        });
      }
    });
    return res.status(200).json({
      status: 'success',
      msg: 'Topic created',
      topic: newTopic,
    });
  }
  return res.status(400).json({
    status: 'error',
    auth: 'You are not authenticated',
  });
};

export const getTopic = async (req: Request, res: Response) => {
  const topicId = req.params.id;
  if (!isValidObjectId(topicId)) {
    return res.status(404).json({
      status: 'error',
      msg: 'Topic no found!',
    });
  }
  await ModelTopic.findOne({ _id: topicId })
    .populate('user')
    .exec((err, topic) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          msg: 'Error Query',
        });
      }

      if (!topic) {
        return res.status(404).json({
          status: 'error',
          msg: 'Topic no found!',
        });
      }
      return res.status(200).json({
        status: 'success',
        topic,
      });
    });
};

export const getTopics = (req: Request, res: Response) => {
  const numPage: any = parseInt(req.params.page);
  const result = paginateTopic(numPage);
  ModelTopic.paginate({}, result, (err, topics) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        msg: 'Query error',
        err,
      });
    }
    if (!topics) {
      return res.status(404).json({
        status: 'error',
        msg: 'There are no topics to show',
      });
    }

    return res.status(200).json({
      status: 'success',
      topics: topics.docs,
      totalDocs: topics.totalDocs,
      totalPages: topics.totalPages,
    });
  });
};

export const getTopicsByUser = async (req: Request, res: Response) => {
  // creando y validando el id de usuario
  const userId = req.params.user;
  if (!isValidObjectId(userId)) {
    return res.status(404).json({
      status: 'error',
      msg: 'Username does not exist',
    });
  }

  const numPage = req.params.page;

  //opciones de paginate
  const options = paginateTopicsUser(numPage);

  // configurando el paginate
  ModelTopic.paginate({}, options, (err, topics) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        msg: 'Query Error',
      });
    }
    if (!topics) {
      return res.status(404).json({
        status: 'error',
        msg: 'This user has no topics',
      });
    }

    return res.status(200).json({
      status: 'sucess',
      topics,
    });
  });

  //searching topics of user
  // await ModelTopic.find({ user: userId })
  //   .sort([['createdAt', 'descending']])
  //   .exec((err, topics) => {
  //     if (err) {
  //       return res.status(500).json({
  //         status: 'error',
  //         msg: 'Query Error',
  //       });
  //     }
  //     if (!topics) {
  //       return res.status(404).json({
  //         status: 'error',
  //         msg: 'This user has no topics',
  //       });
  //     }

  //     return res.status(200).json({
  //       status: 'sucess',
  //       topics,
  //     });
  //   });
};

export const upadateTopic = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user: UserI = req.user;
  if (user.id) {
    const topicId = req.params.topic;
    if (!isValidObjectId(topicId)) {
      return res.status(404).json({
        status: 'error',
        msg: 'Topic does not exist',
      });
    }
    // codigo
    const comprobationUser: TopicI = await ModelTopic.findById(
      {
        _id: topicId,
      },
      (err) => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            msg: 'Server Error',
          });
        }
      }
    );
    if (!comprobationUser) {
      return res.status(404).json({
        status: 'error',
        msg: 'topic no found!',
      });
    }
    console.log(comprobationUser.user, user.id);
    if (comprobationUser.user != user.id) {
      return res.status(400).json({
        status: 'error',
        msg: 'You are not authorized to mock this topic',
      });
    }
    //end codigo
    const topic = {
      title: req.body.title,
      content: req.body.content,
      code: req.body.code,
      lang: req.body.lang,
    };

    await ModelTopic.findByIdAndUpdate(
      { _id: topicId },
      topic,
      {
        new: true,
      },
      (err, response) => {
        if (err) {
          return res.status(400).json({
            status: 'error',
            msg: 'Query Error',
          });
        }

        if (!response) {
          return res.status(404).json({
            status: 'error',
            msg: 'Topic no updated',
          });
        }
      }
    );
    return res.status(200).json({
      status: 'sucess',
      msg: 'Topic Updated!',
    });
  }

  return res.status(400).json({
    status: 'error',
    msg: 'You are not authenticated',
  });
};

export const getMyTopics = async (req: Request, res: Response) => {
  const userReq: UserI = req.user;
  console.log(userReq.id);
  const numPage = req.params.numPage;
  if (!userReq) {
    return res.status(404).json({
      status: 'error',
      msg: 'You do not have permissions to perform this action!',
    });
  }
  if (!numPage) {
    return res.status(404).json({
      status: 'error',
      msg: 'Data missing please',
    });
  }
  //opciones de paginate
  const options = paginateTopicsUser(numPage);

  // configurando el paginate
  ModelTopic.paginate({ user: userReq.id }, options, (err, topics) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        msg: 'Query Error',
      });
    }
    if (!topics) {
      return res.status(404).json({
        status: 'error',
        msg: 'This user has no topics',
      });
    }

    return res.status(200).json({
      status: 'success',
      topics: topics.docs,
      totalDocs: topics.totalDocs,
      totalPages: topics.totalPages,
    });
  });
};

export const deleteTopic = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const topicId = req.params.topic;
  if (!topicId || !isValidObjectId(topicId)) {
    return res.status(404).json({
      status: 'error',
      msg: 'Topic no found!',
    });
  }
  const user: UserI = req.user;
  const comprobationUser = await ModelTopic.findById({ _id: topicId });

  if (!comprobationUser) {
    return res.status(500).json({
      status: 'error',
      msg: 'Topic no found!',
    });
  }
  if (user.id === topicId || user.role == 'admin') {
    await ModelTopic.findByIdAndDelete({ _id: req.params.topic });
    return res.status(200).json({
      status: 'success',
      msg: 'Topic Deleted',
    });
  }
  return res.status(400).json({
    status: 'error',
    msg: 'You are not authorized to mock this topic',
  });
};

export const topicSearch = async (req: Request, res: Response) => {
  // params
  const search = req.params.search;

  const result = await ModelTopic.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { lang: { $regex: search, $options: 'i' } },
    ],
  })
    .sort([['createdAt', 'descending']])
    .exec((err, response) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          msg: 'Server Error',
        });
      }
      if (!response || response == []) {
        return res.status(404).json({
          status: 'error',
          msg: 'No topics found',
        });
      }

      return res.status(200).json({
        status: 'success',
        msg: 'Matches found',
        response,
      });
    });
};
