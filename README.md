# Pasta Oner Portfolio Concept

This workspace contains a crawl-informed static portfolio concept for Czech artist Pasta Oner.

## What is included

- A responsive one-page site built with HTML, CSS, JavaScript, and Bootstrap.
- A structured content model in `js/content.js` built from the original public website.
- Raw crawl snapshots of the key source pages in `.crawl/raw/`.
- Local asset-driven UI using the provided logo, portrait, hands, collage elements, artwork placeholder, and exhibition placeholder.

## Project structure

- `index.html` - page shell and content sections
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

The interface aims for a clean but playful balance:

- floating rounded panels and bold outlines
- a cream-paper base with pop-art cyan, pink, yellow, and red accents
- hover previews in the navigation using the provided cutout graphics
- a single-page structure that consolidates works, exhibitions, interview themes, biography, and contact details

## Source note

The source material was gathered from:

- `https://www.pastaoner.cz/`
- `https://www.pastaoner.cz/selected-works`
- `https://www.pastaoner.cz/exhibitions`
- `https://www.pastaoner.cz/about`
- `https://www.pastaoner.cz/interview-219`
- `https://www.pastaoner.cz/contact`
