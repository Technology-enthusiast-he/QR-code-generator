# MatrixQR main-site UI redesign

## Visual direction
Modern Minimal Tech: warm-neutral surfaces, deep navy typography, restrained teal accents, clear borders, generous spacing, and low-elevation shadows.

## Tokens
- Page: #F6F8FA
- Surface: #FFFFFF
- Soft surface: #EEF2F5
- Ink: #1B2B40
- Muted: #627184
- Border: #DCE3E9
- Accent: #287F78
- Accent hover: #216C66

## Scope
Homepage generator, navigation, form controls, customization, preview/export panel, About page, and responsive states. The menu subdomain is intentionally excluded.

## Safety
This pass changes presentation only. Preserve QR payload construction, rendering, download behavior, translations, metadata, canonical URLs, and structured data. Test all QR types and custom color/logo flows before production.
