(function (root, factory) {
    const buildVCard3 = factory();
    if (typeof module !== "undefined" && module.exports) {
        module.exports = { buildVCard3 };
    }
    if (root) root.buildVCard3 = buildVCard3;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function escapeText(value) {
        return String(value == null ? "" : value)
            .replace(/\r\n?/g, "\n")
            .replace(/\\/g, "\\\\")
            .replace(/\n/g, "\\n")
            .replace(/,/g, "\\,")
            .replace(/;/g, "\\;");
    }

    function foldLine(line, maxOctets) {
        const limit = maxOctets || 75;
        const encoder = new TextEncoder();
        let output = "";
        let current = "";
        let octets = 0;
        for (const character of line) {
            const size = encoder.encode(character).length;
            if (octets + size > limit && current) {
                output += current + "\r\n ";
                current = "";
                octets = 1;
            }
            current += character;
            octets += size;
        }
        return output + current;
    }

    function buildVCard3(contact) {
        const data = contact || {};
        const formattedName = String(data.formattedName || "").trim();
        if (!formattedName) throw new Error("A formatted name is required to create a vCard.");

        const familyName = String(data.familyName || "").trim();
        const givenName = String(data.givenName || "").trim();
        const lines = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "N:" + escapeText(familyName) + ";" + escapeText(givenName) + ";;;",
            "FN:" + escapeText(formattedName)
        ];

        const optionalFields = [
            ["ORG", data.organization],
            ["TEL;TYPE=CELL", data.telephone],
            ["EMAIL", data.email]
        ];
        for (const [property, rawValue] of optionalFields) {
            const value = String(rawValue == null ? "" : rawValue).trim();
            if (value) lines.push(property + ":" + escapeText(value));
        }
        lines.push("END:VCARD");
        return lines.map(line => foldLine(line, 75)).join("\r\n") + "\r\n";
    }
    return buildVCard3;
});
