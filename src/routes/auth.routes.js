const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
router.get("/login", authController.login);
router.get("/register", authController.register);
router.post("/login", authController.postLogin);
router.post("/register", authController.postRegister);
router.get("/logout", verifyToken, authController.logout);
module.exports = router;
