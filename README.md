# LeadFlow — Client Lead Management (Phase 1: frontend)

React + TypeScript + Vite + Tailwind CSS v4 + Lucide icons. All data is local mock data; nothing is saved and there is no authentication yet.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript check
npm run build      # typecheck + production build
```

## Structure
```
src/
  types/        Lead, FollowUp, Activity and form types
  data/         mock.ts (mock leads, follow-ups, activities)
  lib/          pure logic: filtering, sorting, metrics, validation, formatting
  context/      CrmContext (in-memory store), UiContext (routing, overlays, toast)
  hooks/        useLeadTable (search, filter, sort, pagination)
  components/   ui/, layout/, leads/, followups/, activity/, charts/
  pages/        Overview, Leads, Follow-ups, Analytics, Settings
```
Phase 3 replaces `CrmContext` internals with REST calls; components stay unchanged.
