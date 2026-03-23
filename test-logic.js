const crypto = require('crypto');

// נתונים מהסקריפט המקורי שלך
const SECRET_SALT = "4815162342";
const PRODUCT_CODE = "IG-ID-01";
const machineId = process.env.MAC_ID || "GITHUB_RUNNER_ID";
const testLicense = "MY-TEST-LICENSE-123";

// יצירת חתימת SHA256 תקנית ב-Node.js
function generateSignature(license, id, salt) {
    return crypto.createHash('sha256')
                 .update(license + id + salt)
                 .digest('hex');
}

const signature = generateSignature(testLicense, machineId, SECRET_SALT);

console.log("--- TEST RESULTS ---");
console.log("Machine ID: " + machineId);
console.log("Generated Signature: " + signature);
console.log("Signature Length: " + signature.length);

// בדיקה שהחתימה באורך 64 תווים (תקין)
if (signature.length === 64) {
    console.log("✅ Success: Signature is valid.");
} else {
    console.error("❌ Error: Invalid signature length: " + signature.length);
    process.exit(1);
}
