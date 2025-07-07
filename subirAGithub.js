const { Octokit } = require("@octokit/rest");

async function subirAGithub({ repo, path, content, message, token }) {
  const octokit = new Octokit({ auth: token });

  const [owner, repoName] = repo.split("/");

  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path,
    });
    sha = data.sha; // Ya existe, se va a actualizar
  } catch (err) {
    if (err.status !== 404) {
      console.error("❌ Error buscando archivo existente:", err);
      throw err;
    }
    // Archivo no existe, lo va a crear nuevo
  }

  const resultado = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    sha, // si es undefined, crea el archivo
  });

  return resultado;
}

module.exports = subirAGithub;
