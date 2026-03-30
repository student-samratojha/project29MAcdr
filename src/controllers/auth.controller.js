const auditModel = require("../db/models/audit.model");
const userModel = require("../db/models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function auditLog(req, action) {
  try {
    const logEntry = new auditModel({
      user: req.user?._id || null,
      action,
      route: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await logEntry.save();
  } catch (error) {
    console.error("Audit Log Error:", error.message);
  }
}

async function register(req, res) {
  try {
    res.render("register");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function login(req, res) {
  try {
    res.render("login");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      await auditLog(req, "Login Failed - User Not Found");
      return res.status(401).send("Invalid credentials");
    }

    if (user.isDeleted) {
      await auditLog(req, "Login Failed - Deleted Account");
      return res.status(403).send("Account deleted");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await auditLog(req, "Login Failed - Wrong Password");
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    await auditLog(req, "Login Success");

    return res.redirect(`/secure/${user.role}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function postRegister(req, res) {
  try {
    const { email, password,bio,city,country,profilePic, name } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      await auditLog(req, "Register Failed - Email Exists");
      return res.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      bio,
      city,
      country,
      profilePic,
      password: hashedPassword,
    });

    await auditLog(req, "Register Success");

    return res.redirect("/auth/login");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");

    await auditLog(req, "Logout Success");

    return res.redirect("/auth/login");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  register,
  login,
  postLogin,
  postRegister,
  logout,
  auditLog,
};
