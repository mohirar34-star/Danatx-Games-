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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Danatx Games API running on port ${PORT}`);
});
