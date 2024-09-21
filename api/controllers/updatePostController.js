const Post = require("../models/Post");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.secret;

exports.updatePost = (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, decodedInfo) => {
    if (err) throw err;
    const { title, summary, content, id } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor =
      JSON.stringify(postDoc.author) === JSON.stringify(decodedInfo.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json(postDoc);
  });
};
