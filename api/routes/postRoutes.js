const express = require("express");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const { createPost } = require("../controllers/createPostController");
const { getPosts } = require("../controllers/getPostController");
const { getSinglePost } = require("../controllers/getPostController");
const { deletePost } = require("../controllers/deletePostController");
const { updatePost } = require("../controllers/updatePostController");

const router = express.Router();

router.post("/post", uploadMiddleware.single("file"), createPost);
router.get("/post", getPosts);
router.get("/post/:id", getSinglePost);
router.delete("/post/:id", deletePost);
router.put("/post", uploadMiddleware.single("file"), updatePost);

module.exports = router;
