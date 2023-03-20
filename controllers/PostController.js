import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot display posts'
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot display posts'
    });
  }
};

export const getOne = async (req, res) => {
  const postId = await req.params.id;
  PostModel.findOneAndUpdate(
    {
      _id: postId
    },
    {
      $inc: { viewsCount: 1 }
    },
    {
      returnDocument: 'after'
    }
  )
    .populate('user')
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Post is not available'
        });
      }
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: 'Cannot display post'
      });
    });
  //   return result;
};

export const remove = async (req, res) => {
  const postId = req.params.id;

  PostModel.findOneAndDelete({
    _id: postId
  })
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Post is not available'
        });
      }
      res.json({
        success: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: 'Cannot display post'
      });
    });
};

export const create = async (req, res) => {
  console.log('tags', req.body.tags.length);
  try {
    //prepare the user before saving
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.length > 0 ? req.body.tags.split(',') : null,
      imageUrl: req.body.imageUrl,
      user: req.userId
    });

    //save to database
    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to create a post'
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.length > 0 ? req.body.tags.split(',') : null
      }
    );

    res.json({
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to update post'
    });
  }
};
