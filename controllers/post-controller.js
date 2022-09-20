const Post = require("../models/post-model");

class PostController {
  async getAll(req, res, next) {
    try {
      const posts = await Post.find().populate("user").exec();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    try {
      const doc = new Post({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.user.id,
      })

      const post = await doc.save();
      res.json(post);
    } catch (error) {
      res.status(500).json({
        message: "post not created",
      });
    }
  }

  async getOne(req, res, next) {
    try {
      const postId = req.params.id;
      Post.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $inc: { viewCount: 1 },
        },
        {
          returnDocument: "after",
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "Unable to return article!",
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: "Article not found!",
            });
          }
          res.json(doc);
        }
      ).populate('user');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const postId = req.params.id;
      Post.findOneAndDelete(
        {
          _id: postId,
        },

        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "Unable to return article!",
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: "Article not found!",
            });
          }
          res.json({
            message: true,
          });
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const postId = req.params.id;
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          tags: req.body.tags,
          user: req.user.id,
        }
      );
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
