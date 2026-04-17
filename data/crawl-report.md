# Crawl Report

Captured on: 2026-04-15

## Scope

The redesign uses the top-level public pages from `https://www.pastaoner.cz/` as the source of truth:

- homepage
- selected works
- exhibitions
- about
- interview
- contact

## Raw crawl artifacts

Raw HTML snapshots were used only during the initial crawl and are not required by
the public site. The live build uses the structured content model in `js/content.js`.

## Structured extraction used by the new site

The site-level content model in `js/content.js` consolidates:

- top navigation structure
- homepage summary and hero messaging
- biography in Czech and English
- contact info and social links
- selected collections
- selected works with dates and venues
- solo, group, and public-space exhibition histories
- themed interview highlights with links back to the original source

## Local asset usage

The provided local asset folder is used as follows:

- `assets/logo.png` as the top-left brand link to home
- `assets/pasta_portrait.png` in the hero
- `assets/art.jpeg` as a placeholder artwork card image
- `assets/exibit.png` as a placeholder exhibition visual
- hands, collage fragments, statue, and egg graphics as menu and section hover elements
