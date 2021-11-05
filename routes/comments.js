const router = require("express").Router();
const Comment = require("../models/Comment");
const { requireLogin } = require("../middleware/auth");

router.post("/create/:postId", requireLogin, async (req, res) => {
  try {
    const newComment = new Comment({
      ...req.body,
      createdBy: req.user._id,
      post: req.params.postId,
    });
    await newComment.save();
    res.status(200).json("Comment Successfully Added");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", requireLogin, async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Comment.find({}).sort({ createdAt: -1 }).skip(req.skip).lean().exec(),
      Comment.count({}),
    ]);
    console.log(results);
    console.log(req.params.id);
    res.status(200).json({
      data: results.filter((data) => data.post == req.params.id),
      itemCount,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
