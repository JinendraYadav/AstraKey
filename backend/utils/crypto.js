import crypto from "crypto";

const ALGORITHM = "aes-256-ctr";
const SECRET_KEY = crypto
    .createHash("sha256")
    .update(process.env.CRYPTO_SECRET || "mydefaultsecret")
    .digest();

const IV_LENGTH = 16;

export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText) {
    try {
        if (
            !encryptedText ||
            typeof encryptedText !== "string" ||
            !encryptedText.includes(":")
        ) {
            throw new Error("Invalid encrypted text format");
        }

        const [ivHex, encryptedHex] = encryptedText.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const encrypted = Buffer.from(encryptedHex, "hex");

        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        return decrypted.toString("utf8");
    } catch (err) {
        console.error("Decryption failed:", err.message);
        return ""; // Return empty string or handle accordingly
    }
}