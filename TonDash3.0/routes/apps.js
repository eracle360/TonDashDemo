const express = require("express");
const router = express.Router();
const App = require("../models/appModel");
const appController = require("../controllers/appController");
const multer = require("multer");
const path = require("path");

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect("/users/login");
  }
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
});

// Add new app
router.post(
  "/add",
  isAuthenticated,
  upload.fields([
    { name: "screenshots", maxCount: 4 },
    { name: "uploadIcon", maxCount: 1 },
    { name: "uploadVideo", maxCount: 1 },
  ]),
  appController.addApp
);

router.post(
  "/add-user",
  upload.fields([
    { name: "screenshots", maxCount: 4 },
    { name: "uploadIcon", maxCount: 1 },
    { name: "uploadVideo", maxCount: 1 },
  ]),
  appController.addAppUser
);

// Get app details
router.get("/:id", appController.getAppDetails);

// Modify app
router.post("/:id/modify", isAuthenticated, appController.modifyApp);

// Delete app
router.post("/:id/delete", isAuthenticated, appController.deleteApp);

// Promote app
router.post("/:id/promote", isAuthenticated, appController.promoteApp);

// Remove from promoted
router.post(
  "/:id/remove-promoted",
  isAuthenticated,
  appController.removeFromPromoted
);

// Search apps
router.get("/search", appController.searchApps);

module.exports = router;
