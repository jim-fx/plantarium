const { PORT = 8081, GH_TOKEN, GH_REPO, GH_ORG, DB_NAME, DB_MONGO_URL, ADMIN_PASS } = process.env;

const config = {
  PORT,
  ADMIN_PASS,

  GH_TOKEN,
  GH_REPO,
  GH_ORG,

  DB_NAME,
  DB_MONGO_URL
}

export {
  PORT,
  ADMIN_PASS,

  GH_ORG,
  GH_REPO,
  GH_TOKEN,

  DB_NAME,
  DB_MONGO_URL
}

export default config;
