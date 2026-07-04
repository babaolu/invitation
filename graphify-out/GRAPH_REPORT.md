# Graph Report - enoch-invites_2  (2026-07-04)

## Corpus Check
- 23 files · ~11,313 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 100 nodes · 110 edges · 15 communities (10 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `17b36840`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend Routing|Backend Routing]]
- [[_COMMUNITY_Server Package Config|Server Package Config]]
- [[_COMMUNITY_Frontend Pages & Client|Frontend Pages & Client]]
- [[_COMMUNITY_Client Build Tooling|Client Build Tooling]]
- [[_COMMUNITY_Core Project Configuration|Core Project Configuration]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_PDF Template Rendering|PDF Template Rendering]]
- [[_COMMUNITY_PDF Generation Docs|PDF Generation Docs]]
- [[_COMMUNITY_Seating Directory Docs|Seating Directory Docs]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `Enoch's Dedication — Guest Invitation System` - 12 edges
2. `Setup — step by step` - 7 edges
3. `scripts` - 4 edges
4. `supabase` - 4 edges
5. `supabase` - 4 edges
6. `scripts` - 3 edges
7. `renderInvitationHTML()` - 3 edges
8. `AGENT HANDOFF — Enoch's Dedication Guest Seating System` - 3 edges
9. `App()` - 2 edges
10. `AdminGuests()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Enoch's Dedication — Guest Invitation System` --references--> `server/index.js`  [EXTRACTED]
  README.md → server/index.js
- `Enoch's Dedication — Guest Invitation System` --references--> `supabase/schema.sql`  [EXTRACTED]
  README.md → supabase/schema.sql
- `Enoch's Dedication — Guest Invitation System` --references--> `supabase/seed.sql`  [EXTRACTED]
  README.md → supabase/seed.sql
- `Admin dashboard (/admin)` --shares_data_with--> `supabase/schema.sql`  [INFERRED]
  README.md → supabase/schema.sql

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **System Architecture** — server_index_js, client_index_html, supabase_schema_sql [EXTRACTED 1.00]
- **Admin Management Flow** — readme_admin_dashboard, readme_seating_directory, supabase_schema_sql [INFERRED 0.85]

## Communities (15 total, 5 thin omitted)

### Community 0 - "Backend Routing"
Cohesion: 0.18
Nodes (7): router, router, buildShuffledDirectory(), router, shuffle(), app, supabase

### Community 1 - "Server Package Config"
Cohesion: 0.14
Nodes (13): dependencies, cors, dotenv, express, puppeteer, qrcode, @supabase/supabase-js, name (+5 more)

### Community 2 - "Frontend Pages & Client"
Cohesion: 0.26
Nodes (7): supabase, AdminGuests(), AdminLogin(), CENTER_ORNAMENTS, InvitePage(), SeatingDirectory(), App()

### Community 3 - "Client Build Tooling"
Cohesion: 0.17
Nodes (11): devDependencies, vite, @vitejs/plugin-react, name, private, scripts, build, dev (+3 more)

### Community 4 - "Core Project Configuration"
Cohesion: 0.15
Nodes (12): Design Variants, Admin dashboard (/admin), Deployment notes, Design variants reference, Enoch's Dedication — Guest Invitation System, How to reassign a table, Project structure, Sharing invitations with guests (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): dependencies, qrcode.react, react, react-dom, react-router-dom, @supabase/supabase-js

### Community 6 - "PDF Template Rendering"
Cohesion: 0.67
Nodes (3): CENTER_ORNAMENTS, escapeHtml(), renderInvitationHTML()

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (7): 1. Create a Supabase project, 2. Run the database schema, 3. Create your admin login, 4. Configure the server, 5. Configure the client, 6. Try it out, Setup — step by step

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (3): 1. What is DONE, 2. Technical Palette & Variants, AGENT HANDOFF — Enoch's Dedication Guest Seating System

## Knowledge Gaps
- **52 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Enoch's Dedication — Guest Invitation System` connect `Core Project Configuration` to `Community 10`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Setup — step by step` connect `Community 10` to `Core Project Configuration`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 5` to `Client Build Tooling`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Server Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._