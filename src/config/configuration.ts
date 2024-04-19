export default () => ({
  // port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    secretExpiresIn: process.env.JWT_SECRET_EXPIRE,
    refresh: process.env.REFRESH_JWT_SECRET_KEY,
    refreshExpiresIn: process.env.REFRESH_JWT_SECRET_KEY_EXPIRE,
  },
});
