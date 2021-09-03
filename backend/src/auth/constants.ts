const { JWT_SECRET = 'not-so-secret', NODE_ENV } = process.env;

if (NODE_ENV === 'production' && JWT_SECRET === 'not-so-secret') {
  console.error('Using default jwt secret in production is not allowed');
  process.exit();
}

export const jwtConstants = {
  secret: JWT_SECRET,
};
