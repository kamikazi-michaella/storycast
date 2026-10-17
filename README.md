# StoryCast

A 3-page accessible microsite that showcases audio and video storytelling. It is built with semantic HTML5, Sass, CSS Grid, Flexbox and container queries, with no frameworks.

**Author:** YOUR NAME
**Course / Assignment:** Summative project, StoryCast Microsite
**Figma file:** PASTE LINK HERE

---

## 1. Project overview

StoryCast shares short stories as video, audio and text. Every story comes with captions or a full transcript so that everyone can take part. The goal of the project is to practise semantic structure, a maintainable Sass architecture, responsive layouts and WCAG 2.1 AA accessibility, guided by a planned information architecture.

### Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Introduces StoryCast, highlights featured stories, gives clear navigation |
| Story (detail) | `pages/story.html` | One story with embedded video and audio, transcripts, a written version and related stories |
| About / Access | `about.html` | Mission, accessibility features, how to engage, credits and a way to report problems |

---

## 2. Research and planning

### Information architecture

**Sitemap**

```
Home (index.html)
 ├── Story (pages/story.html)  ──► related stories ──► back to Story
 └── About & access (about.html) ──► report an access problem (#help)

Shared on every page: skip link, main navigation, footer link to "Report an access problem"
```

**Heading hierarchy**

| Page | h1 | h2 | h3 |
|---|---|---|---|
| Home | Stories you can watch, hear, or read. | Featured stories, Made for everyone | Story card titles |
| Story | Story title (video) | Read the story, Listen (audio), Related stories | Story parts, card titles |
| About | About StoryCast | Accessibility features, How to engage, Credits, Report an access problem | Feature titles |

**Reasoning**
- Three pages keep every task within one click of the navigation: discover (Home), consume (Story), and understand or trust (About).
- Transcripts sit directly under each player so people who cannot hear or watch find them without searching.
- Related stories sit beside the main story on large screens and below it on small screens to keep people moving through the site.

### Wireframes and mockups

Wireframes and high-fidelity digital mockups of all three pages (desktop and mobile) are in Figma: **PASTE LINK HERE**.
Exported images are in the `/design` folder: ADD FILE NAMES.

---

## 3. Design and development

### Semantic HTML

- Landmarks on every page: `<header>`, `<nav>`, `<main>`, `<footer>`, plus `<aside>` for related stories.
- Content structure with `<section>`, `<article>`, `<figure>` and `<figcaption>`, each labelled with `aria-labelledby`.
- Accessible media: `<video>` and `<audio>` with `controls`, `<track kind="captions">` caption files, and a text fallback inside each element.
- `<details>` and `<summary>` for expandable transcripts, `<ol>` for the breadcrumb and `<table>` with `<caption>` and header `scope` for the keyboard controls.

### Sass architecture

```
sass/
├── main.scss          # entry point, loads every partial
├── _layers.scss       # declares the cascade layer order
├── _colors.scss       # colour tokens
├── _typography.scss   # font tokens and text styles
├── _spacing.scss      # spacing tokens
├── _base.scss         # reset, links, focus, skip link, reduced motion
├── _layout.scss       # header, grid and page layouts
└── _components.scss   # buttons, cards, players, transcripts and more
```

- **Tokens:** colours, fonts and spacing are Sass variables that are also exposed as CSS custom properties.
- **Cascade layers:** `@layer tokens, base, layout, components;` keeps the override order predictable without specificity fights.
- **BEM naming:** blocks, elements and modifiers such as `media-card`, `media-card__title` and `card-grid--single`.
- **Responsive layout:** Flexbox for the header and navigation; Grid for the hero, card grid, story page and feature cards.
- **Container query:** `.card-grid__item` is a size container. The media card switches to a side-by-side layout when its container is at least 28rem wide, and hides the metadata line below 20rem.

### Accessibility

- [x] Captions for video and audio via `<track>`, plus a full transcript for every story
- [x] Colour contrast meets WCAG 2.1 AA (ink 16:1, brand 7.4:1 and muted 7:1 on white)
- [x] Skip link, landmarks, a single `<h1>` per page, and `aria-current="page"` in the navigation
- [x] Visible focus indicator on all interactive elements and full keyboard operation
- [x] ARIA only where needed (`aria-label` on navigation, `aria-labelledby` on sections, `aria-describedby` on media, `aria-hidden` on decorative elements)
- [x] `prefers-reduced-motion` respected
- [x] Responsive down to small phone screens

**Testing**

| Check | Tool or method | Result |
|---|---|---|
| Automated audit | Lighthouse (Accessibility) | ADD SCORES |
| Automated audit | WAVE | ADD RESULT |
| Keyboard only | Tab through every page | ADD RESULT |
| Zoom to 200% | Browser zoom | ADD RESULT |

Screenshots are in `/docs/screenshots`: ADD FILE NAMES.

---

## 4. How to run the project

Requirements: Node.js

```bash
npm install
npm run dev
```

`npm run dev` compiles Sass in watch mode (`sass/main.scss` to `css/main.css`) and starts a local server with live reload at `http://localhost:3000`.

To compile Sass once: `npx sass sass/main.scss css/main.css`

---

## 5. Project structure

```
storycast/
├── index.html
├── about.html
├── pages/
│   └── story.html
├── css/
│   └── main.css          # compiled from Sass
├── sass/                 # source partials
├── videos/               # video clips
├── audios/               # audio clips
├── media/                # caption files (.vtt)
├── design/               # sitemap, wireframes and mockups
├── package.json
└── README.md
```

---

## 6. Credits

- Audio and video clips from *A Cinderella Story* (2004), used for educational purposes with teacher permission.
- "Lina and the Last Bus" is an original written story based on the public-domain Cinderella fairy tale.
- Built with vanilla HTML and Sass, with no frameworks.