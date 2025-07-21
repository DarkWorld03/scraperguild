const express = require("express");
const scrapeGuildData = require("./scraperGuild");
const subirAGithub = require("./subirAGithub");

const app = express();

app.get("/ping", (req, res) => {
  res.send("🏓 Ping recibido (scraperGuild)");
});

app.get("/ejecutar-scraper", (req, res) => {
  res.send("⏳ Scraper iniciado en segundo plano (scraperGuild)");

  setTimeout(async () => {
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
    } catch (err) {
      console.error("❌ Error en scraperGuild:", err);
    }
  }, 100);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Servidor activo scraperGuild en puerto ${PORT}`)
);




