// פונקציית SHA256 מותאמת ל-Node.js (ללא פוליפילים מיותרים)
var sha256 = (function(){
    var i, j, primes = [], max = 311;
    for (i = 2; i < max; i++) {
        var isPrime = true;
        for (j = 2; j < i; j++) { if (i % j === 0) isPrime = false; }
        if (isPrime) primes.push(i);
    }
    function frac(x) { return ((x - Math.floor(x)) * 4294967296) | 0; }
    var k = primes.map(function (p) { return frac(Math.pow(p, 1/3)); });
    var h0 = primes.map(function (p) { return frac(Math.pow(p, 1/2)); });
    function r(x, n) { return (x >>> n) | (x << (32-n)); }
    return function (m) {
        var h = h0.slice(0), words = [], m_len = m.length * 8;
        m += String.fromCharCode(0x80);
        while ((m.length % 64) !== 56) m += String.fromCharCode(0);
        for (i = 0; i < m.length; i+=4) {
            words.push((m.charCodeAt(i) << 24) | (m.charCodeAt(i+1) << 16) | (m.charCodeAt(i+2) << 8) | m.charCodeAt(i+3));
        }
        words.push(0); words.push(m_len);
        for(j=0; j<words.length; j+=16) {
            var w = words.slice(j, j+16);
            var a=h[0], b=h[1], c=h[2], d=h[3], e=h[4], f=h[5], g=h[6], hh=h[7];
            for(i=0; i<64; i++) {
                if(i>=16) {
                    var g0 = w[i-15], g1 = w[i-2];
                    w[i] = ((r(g1,17)^r(g1,19)^(g1>>>10)) + w[i-7] + (r(g0,7)^r(g0,18)^(g0>>>3)) + w[i-16]) | 0;
                }
                var ch = (e&f)^((~e)&g), maj = (a&b)^(a&c)^(b&c);
                var t1 = (hh + (r(e,6)^r(e,11)^r(e,25)) + ch + k[i] + w[i]) | 0;
                var t2 = ((r(a,2)^r(a,13)^r(a,22)) + maj) | 0;
                hh=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
                h[0]=(h[0]+a)|0; h[1]=(h[1]+b)|0; h[2]=(h[2]+c)|0; h[3]=(h[3]+d)|0;
                h[4]=(h[4]+e)|0; h[5]=(h[5]+f)|0; h[6]=(h[6]+g)|0; h[7]=(h[7]+hh)|0;
            }
        }
        return h.map(function(x) { return ("00000000" + (x >>> 0).toString(16)).slice(-8); }).join('');
    };
})();

// קבועים מהסקריפט המקורי שלך
var SECRET_SALT = "4815162342";
var machineId = process.env.MAC_ID || "GITHUB_RUNNER_ID";
var testLicense = "MY-TEST-LICENSE-123";

// יצירת חתימה
var signature = sha256(testLicense + machineId + SECRET_SALT);

console.log("--- TEST RESULTS ---");
console.log("Machine ID: " + machineId);
console.log("Signature: " + signature);
console.log("Signature Length: " + signature.length);

if (signature.length === 64 && !signature.includes('.')) {
    console.log("✅ Success: Signature is valid (64 chars, hex only).");
} else {
    console.error("❌ Error: Invalid signature format.");
    process.exit(1);
}
