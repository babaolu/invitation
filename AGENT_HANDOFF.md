# AGENT HANDOFF — Enoch's Dedication Guest Seating System

This document outlines the system configuration, built features, and current status of the project.

---

## 1. What is DONE

- **Premium Visual Redesign**: Overhauled invitation layouts to follow a custom watercolor stationery aesthetic, including:
  - Custom SVG corners, watercolor radial gradients, and full-bleed leafy watermarks (`WATERMARK_SVG`).
  - Dynamic center ornaments changing per table variant (`CENTER_ORNAMENTS`).
  - Refined Cormorant Garamond typography and scalloped dotted table number badges.
  - Symmetrical double-border layouts.
- **SPA client-side Routing Redirects**: Added `client/public/_redirects` and `client/netlify.toml` to support React client-side Router paths under Netlify host.
- **Seating Directory Editing**: Admin can toggle `✏️ Edit Mode` inside `/admin/seating-directory` to reassign tables using dropdown selectors that persist to the backend API without auto-shuffling during edit.
- **Responsiveness**: Fully responsive Admin Login, mobile-card stacked layouts for Admin Guests, multi-column media rules for Seating Directory, and touch-target padding for client cards.
- **Hanging Puppeteer Watch Fix**: Listeners automatically exit and shut down Puppeteer on backend watchers.
- **Guest Creation & Deletion**:
  - Full admin support for creating guests (POST `/api/admin/guests`) with automatic slug generation (`generateSlug`) and duplication retries.
  - Guest deletion (DELETE `/api/admin/guests/:id`) with warning prompt, rendering corresponding invite links inactive (yielding 404).

## 2. Technical Palette & Variants
- **Tables & Palettes**: 18 tables cycling across 8 distinct color palette variants (Sage Green, Dusty Blue, Powder Blue, etc.).
- **Slug System**: Random, unguessable persistent string identifiers mapping to supabase schema unique key constraint.
