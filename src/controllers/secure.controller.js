const userModel = require("../db/models/user.model");
const auditModel = require("../db/models/audit.model");
const postModel = require("../db/models/post.model");
const commentModel = require("../db/models/comment.model");
const { auditLog } = require("./auth.controller");
async function adminPage(req, res) {
  try {
    const users = await userModel.find();
    const posts = await postModel.find().populate("author");
    const comments = await commentModel
      .find()
      .populate("author")
      .populate("post");
    const audits = await auditModel
      .find()
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(10);
    res.render("admin", { users, audits, posts, comments, user: req.user });
  } catch (error) {
    console.error("Error rendering admin page:", error);
    res.status(500).send("Internal Server Error");
  }
}
async function userPage(req, res) {
  try {
    if (req.user.role === "admin") {
      return res.redirect("/secure/admin?redirect=admin");
    }
    const posts = await postModel
      .find({ author: req.user._id, isDeleted: false })
      .populate("author");
    const comments = await commentModel
      .find({ author: req.user._id })
      .populate("author")
      .populate("post");
    res.render("user", { user: req.user, posts, comments });
  } catch (error) {
    console.error("Error rendering user page:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteAccount(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog(
        req,
        `Failed account deletion attempt - user not found (ID: ${id})`,
      );
      return res.redirect("/secure/admin?deletion=notfound");
    }
    user.isDeleted = true;
    await user.save();
    await auditLog(req, `Account deleted - user ID: ${id}`);
    res.redirect("/secure/admin?deletion=success");
  } catch (error) {
    console.error("Error deleting account:", error);
    res.redirect("/secure/admin?deletion=error");
  }
}

async function restoreAccount(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog(
        req,
        `Failed account restore attempt - user not found (ID: ${id})`,
      );
      return res.redirect("/secure/admin?restore=notfound");
    }
    user.isDeleted = false;
    await user.save();
    await auditLog(req, `Account restored - user ID: ${id}`);
    res.redirect("/secure/admin?restore=success");
  } catch (error) {
    console.error("Error restoring account:", error);
    res.redirect("/secure/admin?restore=error");
  }
}

async function editAccount(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog(
        req,
        `Failed account edit attempt - user not found (ID: ${id})`,
      );
      return res.redirect("/secure/user?edit=notfound");
    }
    res.render("edit", { user, currentUser: req.user });
  } catch (error) {
    console.error("Error editing account:", error);
    res.redirect("/secure/user?edit=error");
  }
}

async function updateAccount(req, res) {
  try {
    const { name, email, id, bio, city, country, profilePic } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog(
        req,
        `Failed account update attempt - user not found (ID: ${id})`,
      );
      return res.redirect(`/secure/${req.user.role}?update=notfound`);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.city = city || user.city;
    user.country = country || user.country;
    user.profilePic = profilePic || user.profilePic;
    await user.save();
    await auditLog(req, `Account updated - user ID: ${id}`);
    res.redirect(`/secure/${req.user.role}?update=success`);
  } catch (error) {
    console.error("Error updating account:", error);
    res.redirect("/secure/user?update=error");
  }
}
async function adminProfile(req, res) {
  try {
    res.render("adminProfile", { admin: req.user });
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?profile=error");
  }
}

module.exports = {
  adminPage,
  adminProfile,
  userPage,
  deleteAccount,
  updateAccount,
  restoreAccount,
  editAccount,
};
