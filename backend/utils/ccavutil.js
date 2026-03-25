// backend/utils/ccavutil.js

const crypto = require("crypto");

exports.encrypt = function (plainText, workingKey) {
  const m = crypto.createHash("md5");
  m.update(workingKey);
  const key = m.digest("binary");

  const iv = "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encoded = cipher.update(plainText, "utf8", "hex");
  encoded += cipher.final("hex");

  return encoded;
};

exports.decrypt = function (encText, workingKey) {
  // Derive 16-byte key from working key using MD5
  const key = crypto.createHash("md5").update(workingKey).digest();

  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);

  const encryptedBuffer = Buffer.from(encText, "hex");

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  decipher.setAutoPadding(true);

  let decoded = decipher.update(encryptedBuffer, "binary", "utf8");
  decoded += decipher.final("utf8");

  return decoded;
};
