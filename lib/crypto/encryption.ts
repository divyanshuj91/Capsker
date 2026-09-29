import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
    const raw = process.env.SMTP_ENCRYPTION_KEY;

    if (!raw) {
        throw new Error("SMTP_ENCRYPTION_KEY is not configured");
    }

    const key = Buffer.from(raw, "hex");

    if (key.length !== 32) {
        throw new Error(
            "SMTP_ENCRYPTION_KEY must be a 64-character hexadecimal string"
        );
    }

    return key;
}

export function encrypt(text: string): string {
    const key = getKey();

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex"),
    ].join(":");
}

export function decrypt(payload: string): string {
    const key = getKey();

    const [ivHex, authTagHex, encryptedHex] = payload.split(":");

    if (!ivHex || !authTagHex || !encryptedHex) {
        throw new Error("Invalid encrypted SMTP password");
    }

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, "hex")),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}