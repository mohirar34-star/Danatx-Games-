const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Danatx Games API is running ✅");
});

app.get("/api/ff", async (req, res) => {
  const uid = String(req.query.uid || "").trim();
  const region = String(req.query.region || "RU").trim().toUpperCase();

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      success: false,
      message: "UID нодуруст аст"
    });
  }

  try {
    const apiUrl =
      "https://free-ff-api-src-5plp.onrender.com/api/v1/account" +
      `?region=${encodeURIComponent(region)}` +
      `&uid=${encodeURIComponent(uid)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || "Player ёфт нашуд"
      });
    }

    const info = data.basicInfo;

    if (!info || !info.nickname) {
      return res.status(404).json({
        success: false,
        message: "Аккаунт ёфт нашуд"
      });
    }

    res.json({
      success: true,
      uid: info.accountId || uid,
      nickname: info.nickname,
      level: info.level,
      region: info.region
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Хатогии сервер"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Danatx Games API running on port ${PORT}`);
});
