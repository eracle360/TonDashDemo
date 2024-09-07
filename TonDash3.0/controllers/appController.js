const App = require("../models/appModel");

// Add App
exports.addApp = (req, res) => {
  const newApp = new App({
    ...req.body,
    screenshots: req.files["screenshots"]
      ? req.files["screenshots"].map((file) => file.path)
      : [],
    icon: req.files["uploadIcon"] ? req.files["uploadIcon"][0].path : "",
    video: req.files["uploadVideo"] ? req.files["uploadVideo"][0].path : "",
    reviews: [],
    createdAt: new Date(),
  });
  newApp
    .save()
    .then(() => res.redirect("/admin/dashboard"))
    .catch((err) => res.status(500).send("Error adding app."));
};

// Add App User
exports.addAppUser = (req, res) => {
  const newApp = new App({
    ...req.body,
    screenshots: req.files["screenshots"]
      ? req.files["screenshots"].map((file) => file.path)
      : [],
    icon: req.files["uploadIcon"] ? req.files["uploadIcon"][0].path : "",
    video: req.files["uploadVideo"] ? req.files["uploadVideo"][0].path : "",
    reviews: [],
    createdAt: new Date(),
  });
  newApp
    .save()
    .then(() => res.redirect("/admin/dashboard"))
    .catch((err) => res.status(500).send("Error adding app."));
};

// Get App Details
exports.getAppDetails = (req, res) => {
  App.findById(req.params.id)
    .then((app) => {
      if (!app) {
        return res.status(404).send("App not found.");
      }
      res.render("appDetails", { app: app.toObject() });
    })
    .catch((err) => res.status(500).send("Error retrieving app details."));
};

// Modify App
exports.modifyApp = (req, res) => {
  App.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((app) => res.redirect(`/apps/${app._id}`))
    .catch((err) => res.status(500).send("Error modifying app."));
};

// Delete App
exports.deleteApp = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true })
    .then(() => res.redirect("/my-apps"))
    .catch((err) => res.status(500).send("Error deleting app."));
};

// Promote App
exports.promoteApp = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: "promoted" }, { new: true })
    .then(() => res.redirect("/admin/dashboard"))
    .catch((err) => res.status(500).send("Error promoting app."));
};

// Remove from Promoted
exports.removeFromPromoted = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true })
    .then(() => res.redirect("/admin/dashboard"))
    .catch((err) => res.status(500).send("Error removing from promoted."));
};

// Search Apps
exports.searchApps = async (req, res) => {
  try {
    const query = req.query.q;
    const results = await App.find({
      $or: [
        { appName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { caption: { $regex: query, $options: "i" } },
        { languages: { $regex: query, $options: "i" } },
      ],
    }).exec();
    res.json(results);
  } catch (error) {
    res.status(500).send("Error retrieving search results.");
  }
};
