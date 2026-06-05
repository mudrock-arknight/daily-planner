# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start Vite dev server on http://localhost:5173 (binds to 0.0.0.0 — accessible on LAN)
npm run build          # TypeScript check (tsc -b) + Vite production build to dist/
npm run lint           # ESLint with --max-warnings 0 (strict)
npm run preview        # Preview production build locally
npm run capacitor:sync # Build web app + sync to Capacitor (Android)
npm run capacitor:open # Open Android project in Android Studio

# Windows desktop app (Electron — loads dist/ after npm run build)
cd Windows && npm run dev      # Launch Electron app (requires npm run build first)
cd Windows && npm run build    # Package with electron-builder (outputs to Windows/dist/)

# Android APK build (Windows only — requires JDK 21 + Gradle)
build-apk.bat          # Build web app → assemble Android debug APK → copy to output/

# Admin scripts (direct DB operations via service_role key — run from project root)
node add-plan.mjs
node update-weekly-plan.mjs
node check-schema.mjs
# More scripts in scripts/ directory — mostly one-off data migration/verification tools
```

## Architecture

- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand + Supabase (BaaS)
- **Target**: GitHub Pages at `/daily-planner/`; Android APK via Capacitor; Windows desktop via Electron
- **Database**: PostgreSQL via Supabase — 4 tables (`daily_checkins`, `todo_items`, `schedule`, `weekly_plans`), all using JSONB `data` columns for flexible storage
- **Data flow**: Pages call Supabase directly → Zustand store acts as local cache (not a single source of truth). Most components fetch from Supabase on mount rather than reading from the store.

## Key Structure

```
src/
  App.tsx                 # BrowserRouter (basename="/daily-planner") + 6 routes + error boundary + Navbar
  main.tsx                # Entry point
  pages/                  # 6 page components: Home, Checkin, Todo, Schedule, WeeklyPlan, Stats
  components/             # Shared components: Toast (global toast system), ErrorBoundary
  hooks/useWeeklyPlan.ts  # Central hook for timeblock completion logic (load, toggle, check)
  utils/planUtils.ts      # Shared utilities: date calc, timeblock logic, theme colors, type labels
  store/useStore.ts       # Zustand: todos, dailyCheckins, weeklyPlans with simple CRUD actions
  types/index.ts          # All TypeScript interfaces (active + deprecated old versions)
  lib/supabase.ts         # Anonymous Supabase client (anon key, now with env var fallback)
  lib/supabase-admin.ts   # Service-role Supabase client (for admin scripts only)
  index.css               # Global styles: gradients, animations, glass-morphism, custom keyframes
```
Root-level scripts (`.mjs`/`.js` in root and `scripts/`) use `supabase-admin.ts` to bypass RLS for direct DB operations — these are CLI tools, not part of the web app.

**Windows desktop app** (`Windows/`): An Electron wrapper (`main.js` + `preload.js`) that loads the same `dist/` build. 480×800 default window, context-isolated. Build with electron-builder.

## Critical Details

- **Router basename**: `App.tsx` uses `<Router basename="/daily-planner">`. The `/schedule` route is registered but has no Navbar entry.
- **Supabase keys**: `src/lib/supabase.ts` now supports `import.meta.env.VITE_SUPABASE_ANON_KEY` with a hardcoded fallback. `supabase-admin.ts` uses `VITE_SUPABASE_SERVICE_KEY` env var. If you need to rotate keys, edit the files or set env vars.
- **RLS is wide open**: All tables have `Public Access USING (true)` policy and `anon` role has full privileges — this is a personal-use app with no authentication.
- **TypeScript is strict**: `noUnusedLocals: true`, `noUnusedParameters: true` — unused imports or parameters will fail `npm run build`.
- **Vite base is `./`** (relative paths) to support deployment at any subpath.
- **Vite dev server binds to `0.0.0.0:5173`** — accessible from other devices on the LAN.
- **Data storage pattern**: Most tables store flexible data in a `data JSONB` column rather than structured columns. The `DailyCheckin` TypeScript interface has many nested sub-types (`PhoneMonitor`, `HealthStatus`, `EveningReview`, etc.) that all serialize into the `data` JSONB field.
- **Android build**: `build-apk.bat` is a Windows batch script that builds the Capacitor Android project into an APK. Requires JDK 21 at a hardcoded path.
- **Toast system**: `src/components/Toast.tsx` uses a non-React pattern — a module-level `showToast(message, type)` function that can be called from anywhere (not just React components). The `ToastContainer` component must be rendered once in the tree (currently rendered in pages that need it, not globally).
- **`.trae/` directory**: Contains project specs, architecture docs (`arch.md`), and PRD (`prd.md`). Reference for understanding feature requirements and design decisions.

## Data Model

| Table | Key field | Structure |
|-------|-----------|-----------|
| `daily_checkins` | `date` (unique) | `data JSONB` — sleep, mood, study, health, review, scores, **completions** (timeblock completion records) |
| `todo_items` | `id` | Structured columns: `title`, `priority` (high/medium/low), `completed` |
| `schedule` | `day` (unique) | `courses JSONB` |
| `weekly_plans` | `week` (unique) | `data JSONB` — goals, dailySchedule, timeBlocks, weeklyReview, longTermGoals, notes |

All tables have `created_at`/`updated_at` timestamps with auto-update triggers.

## Timeblock Completion Logic

This is the most complex business logic in the app, implemented in `src/utils/planUtils.ts` and used by `HomePage` and `WeeklyPlanPage`:

- **`calcCorrectDate(startDate, dayName)`**: Computes the correct ISO date from `weeklyPlan.data.startDate` + day offset (周一=+0, 周二=+1, ...). Do NOT trust `dailySchedule[dayName].date` directly — it may contain format variations.
- **Auto-completion rules** (`effectivelyCompleted`):
  - `class` / `exam` / `break` / `task` types: auto-complete when the date is before today, OR when it's today and the end time has passed
  - `study` type: **never auto-completes** — requires manual user click (only when `countable: true`)
- **Completion storage**: Timeblock completions are stored in `daily_checkins.data.completions[]` as `{ planDate, timeblockIndex, completed, completedAt }`. One checkin row per date; completions array accumulates across multiple days.