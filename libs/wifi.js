(function (root) {
    "use strict";

    function escapeWifiField(value) {
        return String(value).replace(/[\\;,":]/g, "\\$&");
    }

    function formatWifiSsid(value) {
        const escaped = escapeWifiField(value);
        // Quote hexadecimal-looking SSIDs so readers do not mistake the text for hex bytes.
        return /^[0-9a-f]+$/i.test(value) ? "\"" + escaped + "\"" : escaped;
    }

    function buildWifiPayload(options) {
        const settings = options || {};
        const ssid = settings.ssid;
        const password = settings.password;

        if (typeof ssid !== "string" || ssid.trim().length === 0) {
            throw new Error("WiFi network name (SSID) is required");
        }
        if (typeof password !== "string") {
            throw new Error("WiFi password must be a string");
        }

        return "WIFI:T:WPA;S:" + formatWifiSsid(ssid) +
            ";P:" + escapeWifiField(password) + ";;";
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { escapeWifiField, formatWifiSsid, buildWifiPayload };
    }
    root.MatrixQRWifi = { escapeWifiField, formatWifiSsid, buildWifiPayload };
})(typeof globalThis !== "undefined" ? globalThis : this);
