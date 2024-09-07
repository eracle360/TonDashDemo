const express = require("express");
const router = express.Router();
const axios = require("axios");

// Replace with your CoinMarketCap API key
const COINMARKETCAP_API_KEY = "2ed1269e-0f96-46e5-a535-a870ca6a1c1f";

// Fetch Jettons data from CoinMarketCap and render EJS view
router.get("/", async (req, res) => {
  try {
    // Fetch the latest 20 Jettons from CoinMarketCap
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
        params: {
          limit: 50, // Fetch only the top 20 cryptocurrencies
        },
      }
    );

    // Extract relevant data from the response
    const jettons = response.data.data;

    // Render the jettons.ejs template with the CoinMarketCap data
    res.render("jettons", { jettons });
  } catch (error) {
    console.error("Error fetching data from CoinMarketCap:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch Jettons data from CoinMarketCap." });
  }
});

module.exports = router;
