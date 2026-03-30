const postModel = require("../db/models/post.model");
const userModel = require("../db/models/user.model");
const commentModel = require("../db/models/comment.model");
const auditModel = require("../db/models/audit.model");
const { auditLog } = require("./auth.controller");
async function createPost(req, res) {
  try {
    res.render("createPost");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function postCreatePost(req, res) {
  try {
    const { title, content, image } = req.body;
    const post = await postModel.findOne({ title });
    if (post) {
      await auditLog(req, "Post Creation Failed - Duplicate Title");
      return res.status(400).send("Post with this title already exists");
    }
    const newPost = new postModel({
      title,
      author: req.user._id,
      content,
      image,
    });
    await newPost.save();
    await auditLog(req, `Created Post - ${newPost._id}`);
    res.redirect("/secure/user?postCreated=true");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.body;
    const post = await postModel.findById(id);
    if (!post) {
      await auditLog(req, "Post Deletion Failed - Post Not Found");
      return res.status(404).send("Post not found");
    }
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      await auditLog(req, "Post Deletion Failed - Unauthorized");
      return res.status(403).send("Unauthorized");
    }
    post.isDeleted = true;
    await post.save();
    await auditLog(req, `Deleted Post - ${post._id}`);
    res.redirect(`/secure/${req.user.role}?postDeleted=true`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function toggleLike(req, res) {
  try {
    const { id } = req.body;
    const post = await postModel
      .findById(id)
      .populate("likes")
      .populate("author");
    if (!post) {
      await auditLog(req, "Toggle Like Failed - Post Not Found");
      return res.status(404).send("Post not found");
    }
    const userId = req.user._id.toString();
    const hasLiked = post.likes.some((like) => like._id.toString() === userId);
    if (hasLiked) {
      post.likes = post.likes.filter((like) => like._id.toString() !== userId);
      await auditLog(req, `Unliked Post - ${post._id}`);
    } else {
      post.likes.push(req.user._id);
      await auditLog(req, `Liked Post - ${post._id}`);
    }
    await post.save();
    res.redirect(`/secure/user?postLiked=${post._id}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function commentOnPost(req, res) {
  try {
    const { id, comment } = req.body;
    const post = await postModel.findById(id);
    if (!post) {
      await auditLog(req, "Comment Failed - Post Not Found");
      return res.status(404).send("Post not found");
    }
    const newComment = new commentModel({
      content: comment,
      author: req.user._id,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    await auditLog(req, `Commented on Post - ${post._id}`);
    res.redirect(`/secure/user?commentAdded=${post._id}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function getPosts(req, res) {
    try {
        const posts = await postModel
            .find({ isDeleted: false })
            .populate("author")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    model: "User",
                },
            });
        res.render("posts", { posts, user: req.user });
    }
        catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {
  createPost,
  getPosts,
  postCreatePost,
  deletePost,
  toggleLike,
  commentOnPost,
};
