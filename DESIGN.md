# DESIGN

## Color Palette

**Primary: Indigo**
- Primary: `oklch(0.45 0.20 264)` → `#4f46e5`
- Primary Light: `oklch(0.60 0.20 264)` → `#6366f1`
- Primary 10%: `oklch(0.95 0.02 264)`

**Accent: Rose**
- Accent: `oklch(0.55 0.20 345)` → `#ec4899`

**Success: Green**
- Success: `oklch(0.55 0.18 145)` → `#10b981`

**Warning: Amber**
- Warning: `oklch(0.70 0.16 65)` → `#f59e0b`

**Neutrals** (cool slate, per product UI):
- Ink: `oklch(0.20 0 0)` → `#1f2937` (body text)
- Subtle: `oklch(0.45 0 0)` → `#6b7280` (secondary text)
- Muted: `oklch(0.70 0 0)` → `#9ca3af` (placeholders)
- Surface: `oklch(0.98 0 0)` → `#fafafa` (page background)
- Card: `oklch(1.00 0 0)` → `#ffffff` (card background)
- Border: `oklch(0.90 0 0)` → `#e5e7eb`

**Background Gradient** (subtle, not distracting):
- From: `oklch(0.65 0.10 250)` → desaturated indigo
- Through: `oklch(0.50 0.12 280)` → desaturated purple
- To: `oklch(0.70 0.08 320)` → soft rose
- All low chroma, per "no AI purple gradient" requirement

## Typography

**Font Stack**
- Headings / UI: `Inter`, `system-ui`, `-apple-system`, `sans-serif`
- Body: same as headings (product UI one family rule)
- Fallback: `Noto Sans SC` for Chinese characters (already imported)

**Type Scale (1.2 ratio, product UI appropriate):**
- `text-xs`: 0.75rem (12px) → nav labels, metadata
- `text-sm`: 0.875rem (14px) → body, labels
- `text-base`: 1rem (16px) → input text, card content
- `text-lg`: 1.2rem (19.2px) → card titles
- `text-xl`: 1.44rem (23.04px) → section headings
- `text-2xl`: 1.728rem (27.648px) → page titles

**Rules:**
- Body text: `font-weight: 400`, `line-height: 1.6`, `color: var(--color-ink)`
- Headings: `font-weight: 600`, `line-height: 1.3`, `color: var(--color-ink)`
- Labels: `font-weight: 500`, `color: var(--color-subtle)`
- Maintain text contrast ≥ 4.5:1 for body text

## Spacing

Base unit: `0.25rem` (4px) → `spacing: 4` in Tailwind.

**Container:**
- max-width: `64rem` (1024px)
- margin: `0 auto`
- padding-x: `1rem` (mobile), `1.5rem` (desktop)

**Card:**
- padding: `1.25rem` → `p-5`
- radius: `0.875rem` (14px) → consistent with modern product UI

**Buttons:**
- padding-y: `0.625rem` (10px)
- padding-x: `1.25rem` (20px)
- radius: `0.75rem` (12px)

**Gap between cards:** `1rem` → `gap-4`

## Elevation & Shadows

- Card: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` → subtle, modern
- Hover card: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` → slight lift
- Focus ring: `0 0 0 4px rgb(79 70 229 / 0.2)` → primary color focus

## Border Radius Scale (consistent)

- button: `0.75rem` (12px)
- card: `0.875rem` (14px)
- input: `0.75rem` (12px)
- pill: `9999px` (full)

## Motion

**Duration:**
- fast: `150ms` (hover, focus)
- normal: `200ms` (state changes, transitions)

**Easing:**
- default: `cubic-bezier(0.4, 0, 0.2, 1)` → material standard

**Rules:**
- only animate `transform` and `opacity`
- no decorative motion that doesn't convey state
- respect `prefers-reduced-motion: reduce` → disable all non-essential animation

## Components

### Navigation Bar (bottom fixed, mobile-first)
- Background: `rgba(255, 255, 255, 0.95)` with `backdrop-blur` for semi-transparent
- Border top: `1px solid var(--color-border)`
- Active item: primary color, icon + label
- Inactive item: subtle gray, hover darker

### Time Block Card
- White background, subtle border
- Left side: color stripe indicating type (study/class/task/break/exam)
- Middle: content (title, type, time range)
- Right: completion checkbox
- Hover: slight shadow lift
- Completed: text muted + strikethrough

### Day Selector
- Horizontal scrollable pills
- Selected: primary background, white text
- Unselected: white background, gray text, border
- Today: subtle accent dot indicator

### Progress Bar
- Background: `var(--color-border)`
- Fill: primary color
- Animated width transition on load

## Layout Pattern

Mobile-first single column:
- All content stacks vertically on mobile
- Max-width container centered
- Bottom navigation fixed for quick access
- Content padding bottom for nav

## Responsive Breakpoints

- `sm`: 640px → adjust padding
- `md`: 768px → maybe 2-column where appropriate
- `lg`: 1024px → container max-width

## Anti-patterns to avoid

- No decorative floating gradient circles (already have too many)
- No gradient text
- No excessive backdrop blur
- No all-caps labels except short UI text
- No oversized headings that waste vertical space
