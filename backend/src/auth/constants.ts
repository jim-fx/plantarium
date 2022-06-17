const { JWT_SECRET = 'not-so-secret', NODE_ENV, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

if (NODE_ENV === 'production' && JWT_SECRET === 'not-so-secret') {
  console.error('Using default jwt secret in production is not allowed');
  process.exit();
}

export const jwtConstants = {
  secret: JWT_SECRET,
};

export {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
}
