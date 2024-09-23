import Env from "./env";

export const BASE_URL = `${Env.BACKEND_URL}/api`;
export const REGISTER_URL = `${BASE_URL}/auth/register`;
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const VERIFY_CREDENTIALS_URL = `${BASE_URL}/auth/check/credentials`;
export const FORGET_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}/auth/reset-password`;
export const TAKKLE_URL = `${BASE_URL}/takkle`;
