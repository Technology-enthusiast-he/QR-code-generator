(function (root) {
    "use strict";

    function escapeWifiField(value) {
        return String(value).replace(/[\\\\;,":]/g, "\\\\$&");
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

        return "WIFI:T:WPA;S:" + escapeWifiField(ssid) +
            ";P:" + escapeWifiField(password) + ";;";
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { escapeWifiField, buildWifiPayload };
    }
    root.MatrixQRWifi = { escapeWifiField, buildWifiPayload };
})(typeof globalThis !== "undefined" ? globalThis : this);
