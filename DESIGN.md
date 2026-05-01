# Design Brief — EDUCERT

## Purpose & Tone
Official DRC Ministry of Professional Training platform. Institutional, authoritative, trustworthy. Designed for government certification, course generation, and learner progress tracking. Emphasizes legitimacy, transparency, and verifiable credentials.

## Visual Direction
Institutional modernism with DRC national color palette. Royal blue primary (trust, authority), gold/yellow accent (achievement, certification), red for destructive actions, emerald for success states. Card-based layout with clear structural zones and high contrast for accessibility. Official government aesthetic—dignified, serious, verifiable.

## Typography
| Role | Font | Size | Usage |
|------|------|------|-------|
| Display | Bricolage Grotesque 600–900 | 28–48px | Ministry headers, course titles, certificates |
| Body | DM Sans 400–500 | 14–16px | Content, instructions, labels, descriptions |
| Mono | Geist Mono 400 | 12–14px | Resource metadata, QR data, verification codes |

## Color Palette (OKLCH)
| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|----------|---------|
| Primary | 0.4 0.18 258 (Royal Blue) | 0.58 0.16 258 | Ministry branding, buttons, primary UI elements |
| Accent | 0.68 0.22 75 (Gold/Yellow) | 0.72 0.2 75 | Certifications, success badges, achievements |
| Destructive | 0.52 0.24 15 (Red) | 0.62 0.22 18 | Cancel, delete, warnings, invalid states |
| Success | 0.65 0.18 142 (Emerald Green) | 0.7 0.16 142 | Course completion, certification granted |
| Neutral | 0.92–0.98 0 0 (Light Grey) | 0.12–0.24 0 258 (Dark Slate) | Backgrounds, cards, subtle elements |

## Structural Zones
| Zone | Treatment | Detail |
|------|-----------|--------|
| Header/Nav | bg-primary/primary-foreground with ministry branding | Logo, org name "EDUCERT - Ministère RDC", role-based nav, account menu |
| Admin Dashboard | bg-background with sectioned cards | Resource library (upload zone + filter list), generation history, admin controls |
| AI Generation UI | bg-card with sequential progress indicators | Form for course description, AI step progress (DeepSeek→Qwen→GPT-4o), live status |
| Certificate View | bg-card watermark-pattern with gradient-ministry accent | Ministry seal placeholder, QR code, emerald certification badge, DRC flag iconography |
| Course Cards | bg-card shadow-card with 2px border-primary | Resource type icon, title, status badge, metadata, action button |
| Footer | bg-secondary with border-t | Ministry branding, links, verification info |

## Shape Language
- Border radius: 0px (input fields, tight controls), 8px (buttons), 12px (cards), 16px (modals), 24px (badges, large accents)
- Spacing: 4px (micro), 8px (tight), 12px (comfortable), 16px (breathing), 24px (section separation)
- Borders: 1–2px borders on cards and inputs for clarity and official appearance
- Density: Card-heavy with 16–20px padding, high line-height (1.6), ample whitespace for readability

## Component Patterns
- Buttons: Primary (primary/foreground, bold 16px padding), Secondary (secondary/foreground), Outline (border-primary), Accent (accent/foreground for CTAs)
- Cards: 2px border-primary, shadow-card, hover:shadow-elevated transition-smooth
- Progress: Linear progress bar with primary fill, label with percentage and status text
- Input: bg-input border-2 border-primary rounded-lg, focus:ring-2 ring-accent
- Badge: Pill shape with foreground/background, accent color for certification states, emerald for success
- Resource List: Rows with icon, title, type, date, action menu with clear affordances

## Motion Choreography
- Entrance: fade-in (300ms) on page load, staggered list items (50ms intervals)
- AI Generation: Progress indicator pulse-subtle with step highlighting
- State change: bg + text transitions (300ms), progress growth animated
- Focus: All interactive elements show ring-accent on focus-visible
- Loading: pulse-subtle (3s cycle) on submission, progress bars

## Elevation & Depth
- Base: flat bg-background
- Layer 1: bg-card with 1px border-primary (shadow-card)
- Layer 2: bg-card with shadow-elevated (panels, dropdowns)
- Layer 3: bg-card with shadow-modal (modals, full-screen dialogs)

## Accessibility & Compliance
- Minimum contrast: WCAG AAA on all text (primary foreground on backgrounds)
- Ministry watermark: Subtle diagonal stripes (0.03 opacity) behind certificate content
- QR codes: 96px minimum size, high contrast black-on-white
- Touch targets: 44px minimum for all buttons and interactive elements
- Focus indicators: Visible ring-accent on :focus-visible
- Semantic structure: Heading hierarchy, aria-labels, dynamic content announcements

## Signature Detail
Ministry watermark pattern on certificates (diagonal stripes, subtle transparency). Sequential AI generation progress with color-coded steps. Gold accent badge for certification achievement. DRC flag and ministry seal integration on official documents.

## Dark Mode
Enabled. Slate-based dark palette (0.12–0.24 backgrounds) with royal blue primary elevated to 0.58 for contrast. Gold accent brightened to 0.72 for visibility. Borders refined to 0.24 for definition. Full contrast compliance maintained across all interactive states.
