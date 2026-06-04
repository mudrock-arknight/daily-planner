# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start Vite dev server on http://localhost:5173
npm run build          # TypeScript check + Vite production build to dist/
npm run lint           # ESLint with --max-warnings 0 (strict)
npm run preview        # Preview production build locally
npm run capacitor:sync # Build + sync to Capacitor (Android)
npm run capacitor:open # Open Android project in Android Studio

# Run admin scripts (direct DB operations via service_role key)
node add-plan.mjs
node update-weekly-plan.mjs
node check-schema.mjs
```

## Architecture

- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand + Supabase (BaaS)
- **Target**: GitHub Pages deployment at `/daily-planner/` path; also builds to Android APK via Capacitor
- **Database**: PostgreSQL via Supabase — 4 tables (`daily_checkins`, `todo_items`, `schedule`, `weekly_plans`), all using JSONB `data` columns for flexible storage
- **Data flow**: Pages call Supabase directly → Zustand store acts as local cache (not a single source of truth). Most components fetch from Supabase on mount rather than reading from the store.

## Key Structure

```
src/
  App.tsx                 # BrowserRouter (basename="/daily-planner") + 6 routes + bottom Navbar
  main.tsx                # Entry point
  pages/                  # 6 page components: Home, Checkin, Todo, Schedule, WeeklyPlan, Stats
  store/useStore.ts       # Zustand: todos, dailyCheckins, weeklyPlans with simple CRUD actions
  types/index.ts          # All TypeScript interfaces
  lib/supabase.ts         # Anonymous Supabase client (public anon key)
  lib/supabase-admin.ts   # Service-role Supabase client (for admin scripts only)
  index.css               # Global styles: gradients, animations, glass-morphism, custom keyframes
```

Root-level `.mjs`/`.js` scripts use `supabase-admin.ts` to bypass RLS for direct DB operations — these are CLI tools for managing data, not part of the web app.

## Critical Details

- **Router basename**: `App.tsx` uses `<Router basename="/daily-planner">`. The `/schedule` route is registered but has no Navbar entry.
- **Supabase keys are hardcoded** in `src/lib/supabase.ts` and `src/lib/supabase-admin.ts` — there is no `.env` file. If you need to rotate keys, edit these files directly.
- **RLS is wide open**: All tables have `Public Access USING (true)` policy and `anon` role has full privileges — this is a personal-use app with no authentication.
- **TypeScript is strict**: `noUnusedLocals: true`, `noUnusedParameters: true` — unused imports or parameters will fail `npm run build`.
- **Vite base is `./`** (relative paths) to support deployment at any subpath.
- **Data storage pattern**: Most tables store flexible data in a `data JSONB` column rather than structured columns. The `DailyCheckin` TypeScript interface has many nested sub-types (`PhoneMonitor`, `HealthStatus`, `EveningReview`, etc.) that all serialize into the `data` JSONB field.
- **Android build**: `build-apk.bat` is a Windows batch script that builds the Capacitor Android project into an APK. Requires JDK 21 and Gradle.

## Data Model

| Table | Key field | Structure |
|-------|-----------|-----------|
| `daily_checkins` | `date` (unique) | `data JSONB` — sleep, mood, study, health, review, scores |
| `todo_items` | `id` | Structured columns: `title`, `priority` (high/medium/low), `completed` |
| `schedule` | `day` (unique) | `courses JSONB` |
| `weekly_plans` | `week` (unique) | `data JSONB` — goals, dailySchedule, timeBlocks, weeklyReview, longTermGoals, notes |

All tables have `created_at`/`updated_at` timestamps with auto-update triggers.