const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { requireLogin } = require("../middleware/auth");

const generateSlug = (title) => {
  const slugText = title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return slugText;
};

router.post("/create", requireLogin, async (req, res) => {
  const newPost = new Post({ ...req.body, createdBy: req.user._id });
  try {
    if (!newPost.slug) {
      newPost.slug = generateSlug(newPost.title);
    }
    await newPost.save();
    res.status(201).json("Post successfully created");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Post.find({}).sort({ createdAt: -1 }).skip(req.skip).lean().exec(),
      Post.count({}),
    ]);
    res.status(200).json({
      data: results,
      itemCount,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", requireLogin, async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json("Item Not Found");
    }
    res.status(204).json("Item Successfully Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:slug", async (req, res) => {
  try {
    let post = await Post.findOne({ slug: req.params.slug }).populate("title");
    if (post) {
      post.comments = await Comment.find({ post: post._id });
      res.status(200).json(post);
    }
    res.status(404).json("Not Found");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
