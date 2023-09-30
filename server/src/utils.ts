import * as crypto from "crypto";
import { Activity } from "./types/custom";

export function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + encrypted;
}

export function decrypt(encryptedText: string, key: Buffer): string {
  const iv = Buffer.from(encryptedText.slice(0, 32), "hex");
  const encryptedData = encryptedText.slice(32);

  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function getAuthTokenFromHeader(req: Request): string | false {
  const authHeader = (req.headers as any).authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return false;
  return token;
}

export function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomString += chars.charAt(randomIndex);
  }

  return randomString;
}

export function getDefaultActivities() {
  const activities = Object.values(Activity);
  const response: Partial<Record<Activity, number>> = {};
  activities.forEach((a) => (response[a] = 0));

  return response;
}
