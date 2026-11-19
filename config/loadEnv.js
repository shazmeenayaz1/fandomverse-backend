/**
 * Loads backend/.env regardless of the folder the server is started from.
 *
 * This module MUST be imported before any other local module in server.js,
 * because ES module imports are evaluated in order - authroute -> email.js
 * needs EMAIL_USER / JWT_SECRET to already be present in process.env.
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Ensure critical defaults exist in serverless environments where .env is gitignored
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "mySuperSecretKey";
}
if (!process.env.EMAIL_USER) {
  process.env.EMAIL_USER = "shazmeenayaz1@gmail.com";
}
if (!process.env.EMAIL_PASS) {
  process.env.EMAIL_PASS = "mlrlypxsbxkwvtga";
}

export const envLoadedFrom = path.resolve(__dirname, "..", ".env");

export default envLoadedFrom;
