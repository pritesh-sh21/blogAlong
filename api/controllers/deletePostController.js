const Post = require("../models/Post");

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    return res.status(500).json({ message: "Error deleting post" });
  }
  res.status(200).json({ message: "success" });
};
