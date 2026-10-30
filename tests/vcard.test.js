const test = require("node:test");
const assert = require("node:assert/strict");
const { buildVCard3 } = require("../libs/vcard.js");

test("creates a vCard 3.0 with required VERSION, N, and FN properties", () => {
    const result = buildVCard3({ formattedName: "John Doe", familyName: "Doe", givenName: "John" });
    assert.match(result, /^BEGIN:VCARD\r\nVERSION:3\.0\r\nN:Doe;John;;;\r\nFN:John Doe\r\nEND:VCARD\r\n$/);
});

test("escapes backslashes, commas, semicolons, and embedded newlines", () => {
    const result = buildVCard3({
        formattedName: "Doe, John; Jr.\nTeam",
        familyName: "Doe; Sr.",
        givenName: "John, Jr.",
        organization: "Research; Development, Inc.\\Labs"
    });
    assert.ok(result.includes("N:Doe\\; Sr.;John\\, Jr.;;;"));
    assert.ok(result.includes("FN:Doe\\, John\\; Jr.\\nTeam"));
    assert.ok(result.includes("ORG:Research\\; Development\\, Inc.\\\\Labs"));
});

test("omits optional properties when their values are empty", () => {
    const result = buildVCard3({ formattedName: "Jane Doe" });
    assert.ok(result.includes("N:;;;;\r\nFN:Jane Doe"));
    assert.ok(!result.includes("ORG:"));
    assert.ok(!result.includes("TEL;TYPE=CELL:"));
    assert.ok(!result.includes("EMAIL:"));
});

test("folds long lines at no more than 75 UTF-8 octets", () => {
    const result = buildVCard3({ formattedName: "名".repeat(40), familyName: "B".repeat(100) });
    for (const line of result.split("\r\n").filter(Boolean)) {
        assert.ok(Buffer.byteLength(line, "utf8") <= 75);
    }
});

test("rejects a missing formatted name", () => {
    assert.throws(() => buildVCard3({ organization: "Example" }), /formatted name is required/i);
});
