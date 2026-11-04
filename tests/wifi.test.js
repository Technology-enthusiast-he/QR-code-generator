const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeWifiField, buildWifiPayload } = require("../libs/wifi.js");

test("builds the standard WPA WiFi payload", () => {
    assert.equal(
        buildWifiPayload({ ssid: "OfficeGuest", password: "guest-password" }),
        "WIFI:T:WPA;S:OfficeGuest;P:guest-password;;"
    );
});

test("escapes all reserved WiFi field characters", () => {
    assert.equal(
        escapeWifiField("A\\B;C,D\"E:F"),
        "A\\\\B\\;C\\,D\\\"E\\:F"
    );
});

test("quotes hexadecimal-looking SSIDs to avoid hex interpretation", () => {
    assert.equal(
        buildWifiPayload({ ssid: "ABCD1234", password: "passphrase" }),
        'WIFI:T:WPA;S:"ABCD1234";P:passphrase;;'
    );
});

test("does not quote ordinary non-hex SSIDs", () => {
    assert.equal(
        buildWifiPayload({ ssid: "Cafe5G", password: "passphrase" }),
        "WIFI:T:WPA;S:Cafe5G;P:passphrase;;"
    );
});

test("escapes SSID and password independently", () => {
    assert.equal(
        buildWifiPayload({ ssid: "Cafe;Guest", password: 'p:a,"b\\c' }),
        "WIFI:T:WPA;S:Cafe\\;Guest;P:p\\:a\\,\\\"b\\\\c;;"
    );
});

test("preserves leading and trailing spaces in credentials", () => {
    assert.equal(
        buildWifiPayload({ ssid: " Guest Network ", password: " pass with spaces " }),
        "WIFI:T:WPA;S: Guest Network ;P: pass with spaces ;;"
    );
});

test("rejects a missing or whitespace-only SSID", () => {
    assert.throws(() => buildWifiPayload({ ssid: "", password: "secret" }), /required/i);
    assert.throws(() => buildWifiPayload({ ssid: "   ", password: "secret" }), /required/i);
});

test("requires the password to be a string", () => {
    assert.throws(() => buildWifiPayload({ ssid: "Guest", password: null }), /password must be a string/i);
});
