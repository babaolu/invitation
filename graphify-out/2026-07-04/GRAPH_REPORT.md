# Graph Report - .  (2026-07-04)

## Corpus Check
- Corpus is ~6,823 words - fits in a single context window. You may not need a graph.

## Summary
- 77 nodes · 91 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 2,949 input · 1,153 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend Routing|Backend Routing]]
- [[_COMMUNITY_Server Package Config|Server Package Config]]
- [[_COMMUNITY_Frontend Pages & Client|Frontend Pages & Client]]
- [[_COMMUNITY_Client Build Tooling|Client Build Tooling]]
- [[_COMMUNITY_Core Project Configuration|Core Project Configuration]]
- [[_COMMUNITY_Client App Dependencies|Client App Dependencies]]
- [[_COMMUNITY_PDF Template Rendering|PDF Template Rendering]]
- [[_COMMUNITY_PDF Generation Docs|PDF Generation Docs]]
- [[_COMMUNITY_Seating Directory Docs|Seating Directory Docs]]

## God Nodes (most connected - your core abstractions)
1. `Enoch's Dedication — Guest Invitation System` - 5 edges
2. `scripts` - 4 edges
3. `supabase` - 4 edges
4. `supabase` - 4 edges
5. `scripts` - 3 edges
6. `renderInvitationHTML()` - 3 edges
7. `App()` - 2 edges
8. `AdminGuests()` - 2 edges
9. `AdminLogin()` - 2 edges
10. `InvitePage()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Enoch's Dedication — Guest Invitation System` --references--> `server/index.js`  [EXTRACTED]
  README.md → server/index.js
- `Enoch's Dedication — Guest Invitation System` --references--> `supabase/schema.sql`  [EXTRACTED]
  README.md → supabase/schema.sql
- `Enoch's Dedication — Guest Invitation System` --references--> `supabase/seed.sql`  [EXTRACTED]
  README.md → supabase/seed.sql
- `Admin dashboard (/admin)` --shares_data_with--> `supabase/schema.sql`  [INFERRED]
  README.md → supabase/schema.sql
- `Enoch's Dedication — Guest Invitation System` --references--> `client/index.html`  [EXTRACTED]
  README.md → client/index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **System Architecture** — server_index_js, client_index_html, supabase_schema_sql [EXTRACTED 1.00]
- **Admin Management Flow** — readme_admin_dashboard, readme_seating_directory, supabase_schema_sql [INFERRED 0.85]

## Communities (10 total, 2 thin omitted)

### Community 0 - "Backend Routing"
Cohesion: 0.20
Nodes (7): router, router, buildShuffledDirectory(), router, shuffle(), app, supabase

### Community 1 - "Server Package Config"
Cohesion: 0.14
Nodes (13): dependencies, cors, dotenv, express, puppeteer, qrcode, @supabase/supabase-js, name (+5 more)

### Community 2 - "Frontend Pages & Client"
Cohesion: 0.29
Nodes (6): supabase, AdminGuests(), AdminLogin(), InvitePage(), SeatingDirectory(), App()

### Community 3 - "Client Build Tooling"
Cohesion: 0.17
Nodes (11): devDependencies, vite, @vitejs/plugin-react, name, private, scripts, build, dev (+3 more)

### Community 4 - "Core Project Configuration"
Cohesion: 0.25
Nodes (8): client/index.html, client/src/main.jsx, Design Variants, Admin dashboard (/admin), Enoch's Dedication — Guest Invitation System, server/index.js, supabase/schema.sql, supabase/seed.sql

### Community 5 - "Client App Dependencies"
Cohesion: 0.33
Nodes (6): dependencies, qrcode.react, react, react-dom, react-router-dom, @supabase/supabase-js

### Community 6 - "PDF Template Rendering"
Cohesion: 0.67
Nodes (3): escapeHtml(), ORNAMENTS, renderInvitationHTML()

## Knowledge Gaps
- **35 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Client App Dependencies` to `Client Build Tooling`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Server Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._