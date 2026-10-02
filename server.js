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

// Free Fire RU / CIS UID lookup
app.get("/api/ff", async (req, res) => {
  const uid = String(req.query.uid || "").trim();
  const region = String(req.query.region || "RU")
    .trim()
    .toUpperCase();

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      success: false,
      message: "UID нодуруст аст"
    });
  }

  if (!["RU", "CIS"].includes(region)) {
    return res.status(400).json({
      success: false,
      message: "Танҳо RU ё CIS иҷозат аст"
    });
  }

  const apiUrl =
    `https://freefireapis.lat/info-player` +
    `?uid=${encodeURIComponent(uid)}` +
    `&region=${encodeURIComponent(region)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(502).json({
        success: false,
        message: "Free Fire API ҷавоби дуруст надод",
        apiStatus: response.status
      });
    }

    const info = data.result?.basicInfo;

    if (!info || !info.nickname) {
      return res.status(404).json({
        success: false,
        message: "Аккаунт ёфт нашуд"
      });
    }

    return res.json({
      success: true,
      uid: info.accountId || uid,
      nickname: info.nickname,
      level: info.level ?? null,
      region: info.region || region
    });

  } catch (error) {
    console.error("FREE FIRE API ERROR:", error);

    return res.status(502).json({
      success: false,
      message: "Пайвастшавӣ ба Free Fire API ноком шуд"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Danatx Games API running on port ${PORT}`);
});
