export const __prod__ = process.env.NODE_ENV === 'production';
export const FRONTEND_URL = __prod__
  ? process.env.FRONT_PROD_URL
  : process.env.FRONT_DEV_URL;

export const BACKEND_URL = __prod__
  ? process.env.BACKEND_PROD_URL
  : process.env.BACKEND_DEV_URL;
