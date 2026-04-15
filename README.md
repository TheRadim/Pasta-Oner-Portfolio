# Pasta Oner Portfolio Concept

This workspace contains a crawl-informed static multi-page portfolio concept for Czech artist Pasta Oner.

## What is included

- A responsive multi-page site built with HTML, CSS, JavaScript, and Bootstrap.
- A structured content model in `js/content.js` built from the original public website.
- Raw crawl snapshots of the key source pages in `.crawl/raw/`.
- Local asset-driven UI using the provided logo, portrait, hands, collage elements, artwork placeholder, and exhibition placeholder.

## Project structure

- `index.html` - homepage
- `works.html` - selected works archive
- `exhibitions.html` - exhibition history
- `interview.html` - interview themes
- `about.html` - biography and practice
- `contact.html` - contact and social links
- `css/styles.css` - custom visual system and responsive styling
- `js/content.js` - structured data used by the site
- `js/main.js` - rendering and interactions
- `.crawl/raw/` - saved HTML snapshots from `pastaoner.cz`
- `data/crawl-report.md` - crawl scope and extraction notes

## Preview locally

Serve the folder with any simple static server. One easy option is:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Design direction

The interface now aims for a calmer editorial balance:

- separate pages for works, exhibitions, interview, about, and contact
- a cream-paper base, white framed sections, and restrained accent color
- one visual anchor per page instead of layered floating stickers
- a more gallery-like, editorial reading rhythm

## Source note

The source material was gathered from:

- `https://www.pastaoner.cz/`
- `https://www.pastaoner.cz/selected-works`
- `https://www.pastaoner.cz/exhibitions`
- `https://www.pastaoner.cz/about`
- `https://www.pastaoner.cz/interview-219`
- `https://www.pastaoner.cz/contact`
