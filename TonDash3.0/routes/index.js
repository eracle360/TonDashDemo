const express = require("express");
const router = express.Router();
const App = require("../models/appModel");
// const Jetton = require("../models/jettonModel");
const appController = require("../controllers/appController");
const axios = require("axios");

const COINMARKETCAP_API_KEY = "2ed1269e-0f96-46e5-a535-a870ca6a1c1f";

// Home route
router.get("/", async (req, res) => {
  try {
    const approvedApps = await App.find({ status: "approved" });
    const promotedApps = await App.find({ status: "promoted" }); // Fetch promoted apps
    // const jettons = await Jetton.find();
    // Fetch the latest 20 Jettons from CoinMarketCap
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
        params: {
          limit: 20, // Fetch only the top 20 cryptocurrencies
        },
      }
    );

    // Extract relevant data from the response
    const jettons = response.data.data;
    // console.log("first", first);

    res.render("index", { approvedApps, promotedApps, jettons }); // Pass promotedApps to the template
  } catch (error) {
    res.status(500).send("Error retrieving data.");
  }
});

// Add App route
router.get("/add-app", (req, res) => {
  res.render("addApp");
});

// Promote App route
router.get("/promote", (req, res) => {
  res.render("promote");
});

// Search route
router.get("/search", appController.searchApps);

// App details route
router.get("/app/:id", async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    // console.log("app", app);
    if (app) {
      res.render("appDetails", { app });
    } else {
      res.status(404).send("App not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving app details.");
  }
});

module.exports = router;
