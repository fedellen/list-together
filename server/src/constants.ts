export const __prod__ = process.env.NODE_ENV === 'production';
export const FRONT_END_URL = __prod__
  ? process.env.FRONT_PROD_URL
  : process.env.FRONT_DEV_URL;
