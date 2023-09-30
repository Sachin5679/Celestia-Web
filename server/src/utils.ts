import * as crypto from "crypto";

export function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(16); // Generate a random IV (16 bytes for AES-256-CBC)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + encrypted; // Prepend IV to the encrypted data
}

export function decrypt(encryptedText: string, key: Buffer): string {
  const iv = Buffer.from(encryptedText.slice(0, 32), "hex"); // Extract IV from the first 32 characters
  const encryptedData = encryptedText.slice(32); // Get the encrypted data

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
