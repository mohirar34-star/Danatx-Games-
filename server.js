const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Danatx Games API works ✅"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API test works ✅"
  });
});

// Free Fire API diagnostic test
app.get("/api/ff-test", async (req, res) => {
  const uid = String(req.query.uid || "").trim();

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      success: false,
      message: "UID нодуруст аст"
    });
  }

  const apiUrl =
    `https://api2.nftoken.info/player-info?uid=${encodeURIComponent(uid)}`;

  try {
    const response = await fetch(apiUrl);
    const body = await response.text();

    return res.json({
      success: response.ok,
      upstreamStatus: response.status,
      upstreamBody: body.slice(0, 5000)
    });

  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Пайвастшавӣ ба Free Fire API ноком шуд",
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Danatx Games API running on port ${PORT}`);
});
