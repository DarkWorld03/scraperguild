const express = require("express");
const scrapeGuildData = require("./scraperGuild");
const subirAGithub = require("./subirAGithub");

const app = express();

// Endpoint para mantener vivo el servidor
app.get("/ping", (req, res) => {
  res.send("🏓 Ping recibido (scraperGuild)");
});

// Endpoint principal del scraper
app.get("/ejecutar-scraper", async (req, res) => {
  try {
    const data = await scrapeGuildData();
    if (!data) throw new Error("No se pudo scrapear.");

    const filename = "guild1.json";
    const content = JSON.stringify(data, null, 2);

    const subida = await subirAGithub({
      repo: "DarkWorld03/guild-data",
      path: `guild/${filename}`,
      content,
      message: "📦 Actualización automática de guild1.json",
      token: process.env.GITHUB_TOKEN,
    });

    console.log("✅ Archivo subido:", subida);
    res.send("✅ JSON generado y subido a GitHub");
  } catch (err) {
    console.error("❌ Error al ejecutar scraperGuild:", err);
    res.status(500).send("❌ Error general");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo scraperGuild en puerto ${PORT}`));



