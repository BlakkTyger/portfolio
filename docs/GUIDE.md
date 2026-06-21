# Portfolio Content Management Guide

This guide provides step-by-step instructions on how to easily edit the content of your portfolio website. All content is stored in local files (`.ts`, `.tsx`, and `.mdx`), meaning you don't need a database to make updates. 

---

## 1. Blogs

All blog posts are written in MDX (Markdown with JSX) and stored in the `content/posts/` directory.

### a. Write new blogs and add images
1. Create a new file in `content/posts/` ending with `.mdx` (e.g., `my-new-post.mdx`). The file name will become the URL slug.
2. At the top of the file, add YAML frontmatter to define the post metadata:
   ```yaml
   ---
   title: "My New Blog Post"
   description: "A brief summary of what this post is about."
   date: "2024-05-27"
   published: true
   tags: ["physics", "coding"]
   category: "Science"
   subCategory: "Quantum Mechanics"
   ---
   ```
3. Below the frontmatter, write your post content using standard Markdown.
4. **Adding Images**: Place your images in the `public/images/blog/` folder (create this folder if it doesn't exist). In your MDX file, reference the image like this:
   ```markdown
   ![Alt text](/images/blog/my-image.png)
   ```

### b. Add tags to the blogs
To add tags, simply add them to the `tags` array in the frontmatter of your MDX file:
```yaml
tags: ["react", "nextjs", "tutorial"]
```

### c. Add subcategories and categories to the blogs
Categories and subcategories are defined dynamically based on the frontmatter of your posts. 
1. In your MDX file's frontmatter, specify the `category` and `subCategory` fields:
```yaml
category: "Technology"
subCategory: "Web Development"
```
2. The website will automatically group blogs by these categories on the main blog page. If a category or subcategory doesn't exist yet, simply typing a new one in the frontmatter will create it.

### d. Blog Series

A **blog series** ties multiple blog posts together into an ordered narrative. Each post in a series can navigate to the previous/next post with a rich card (cover image, title, description). Series are showcased in a horizontal carousel on `/blog`, and each series gets its own landing page at `/blog/series/<series-id>`.

A blog can be:
- **Standalone** — no `series` field in frontmatter (current default behavior).
- **Part of a series** — `series` + `seriesOrder` set in frontmatter.

#### Step 1 — Create the series metadata file (optional but recommended)

Create the folder `content/series/` if it does not exist. Inside, create a JSON file named after the series id (slug):

```
content/series/quantum-foundations.json
```

```json
{
  "id": "quantum-foundations",
  "title": "Quantum Foundations",
  "tagline": "A pedestrian's tour",
  "description": "A five-part journey from classical intuition to the measurement problem.",
  "cover": "/images/series/quantum-foundations/cover.jpg",
  "accent": "#7c3aed"
}
```

Fields:

| Field         | Required | Description                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `id`          | yes      | Slug; must match the `series` field in your posts' frontmatter.             |
| `title`       | no       | Display title. Defaults to the first post's title.                          |
| `tagline`     | no       | Short kicker shown above the title in cards.                                |
| `description` | no       | One- or two-sentence blurb. Defaults to the first post's description.       |
| `cover`       | no       | Hero/cover image. Defaults to the first post's `cover` (if any).            |
| `accent`      | no       | CSS color used for series-specific accents. Defaults to `--terminal-cyan`.  |

If you skip the JSON file entirely, the series will still work — it will simply auto-derive metadata from the first post.

#### Step 2 — Add the series cover image

Place the cover image at:

```
public/images/series/<series-id>/cover.jpg   (or .png, .webp, .avif)
```

Reference it in the JSON file's `cover` field using its public URL (e.g. `/images/series/quantum-foundations/cover.jpg`).

#### Step 3 — Tag each blog post with the series

In every MDX post that belongs to the series, add two frontmatter fields:

```yaml
---
title: "Wavefunctions From Scratch"
description: "Why the wavefunction emerges naturally from waves on a string."
date: "2025-02-04"
category: "Science"
subCategory: "Quantum Mechanics"
# === Series fields ===
series: "quantum-foundations"   # MUST match the series JSON `id`
seriesOrder: 1                   # 1-indexed position within the series
---
```

- `series` — the series id. Posts sharing the same `series` value are grouped automatically.
- `seriesOrder` — a 1-indexed integer. Lower numbers appear first. If two posts share the same `seriesOrder`, ties are broken by date.

#### Step 4 — Insert a new post into an existing series

To slot a brand new blog **between** two existing posts in a series:

1. Decide where it should go. Suppose the current order is `1, 2, 3`, and you want to insert the new blog between `2` and `3`.
2. Renumber the existing posts so the gap exists. Either:
   - Pick a fractional/explicit number (e.g. set the new post's `seriesOrder` to `2.5`), **or**
   - Re-number existing files: bump the old post `3` to `seriesOrder: 4`, etc.
3. Save with the new `seriesOrder` and you're done — the navigation/order updates automatically on next build.

> [!TIP]
> Using gaps in numbering (e.g. `10, 20, 30`) when first creating a series makes future insertions effortless.

#### Step 5 — Cover images per post in a series

Each post can optionally have its own cover image (used in the previous/next blog card thumbnails):

```yaml
cover: "/images/blog/wavefunctions/cover.jpg"
```

Image path convention: `public/images/blog/<slug>/cover.{jpg,png,webp}`.

---

### e. Multi-Page Mode

Some blogs are long enough that a single scroll feels overwhelming. **Multi-page mode** lets a reader consume one section at a time with prev/next page navigation, while still keeping the whole post in a single MDX file.

A reader who lands on a multi-page-enabled blog sees a blurred-background popup asking whether to read in **Single page** or **Multi-page** mode. Their choice is remembered (in `localStorage`) for that post. They can also re-open the prompt or flip modes from the toolbar that appears above the article.

#### Step 1 — Enable multi-page mode in the frontmatter

```yaml
---
title: "A Field Guide to Kolmogorov–Arnold Networks"
description: "Everything you wanted to know about KANs."
date: "2025-03-01"
# === Multi-page fields ===
multiPage: true                   # required to enable the feature
multiPageSplit: "h2"              # heading level to auto-split on (h1 | h2 | h3 | h4 | h5 | h6)
multiPageOnly: false              # if true, removes the single-page option entirely
multiPageRecommended: true        # highlights "Multi-page" as recommended in the popup
---
```

| Field                  | Required | Default | Description                                                                                  |
| ---------------------- | -------- | ------- | -------------------------------------------------------------------------------------------- |
| `multiPage`            | yes      | `false` | Master switch. Must be `true` to enable the toolbar, popup, and split-page rendering.        |
| `multiPageSplit`       | no       | `h2`    | The heading level at which the post is automatically split into pages.                       |
| `multiPageOnly`        | no       | `false` | If `true`, the reader never sees the single-page option and the post always opens paginated. |
| `multiPageRecommended` | no       | `false` | Highlights the "Multi-page" choice in the popup, with a "Recommended" badge.                 |

> Posts **without** `multiPage: true` behave exactly as before — no popup, no toolbar.

#### Step 2 — How automatic splits work

By default, the post is split into pages at every heading of the level specified by `multiPageSplit` (e.g. every `## h2`). The text **before** the first heading becomes the "Introduction" page. Every subsequent split creates a new page whose title is the heading text.

```markdown
Some intro paragraphs.       ← Page 1 ("Introduction")

## Section A                  ← Page 2 ("Section A")
…content…

## Section B                  ← Page 3 ("Section B")
…content…
```

If your post has no headings of the configured level, multi-page mode silently falls back to single-page (no toolbar/popup is shown).

#### Step 3 — Customizing splits with `<PageBreak />`

Sometimes you want a split that does **not** align with any heading — or you want to split at `### h3` for one section and at `#### h4` for another. Use the explicit page-break component anywhere in your MDX:

```markdown
## Section A
…content…

<PageBreak title="Detour: notation" />

Some content that lives on its own page even though there is no new heading here.

<PageBreak />
```

Rules:

- **If any `<PageBreak />` exists in the MDX file, all automatic header-based splits are ignored.** This lets you fully control the split points without juggling heading levels.
- `<PageBreak />` with no `title` will auto-name the page (`Page N`). Pass `title="…"` to give it a name shown in the page index.
- You can use as many `<PageBreak />` markers as you like.

#### Step 4 — Per-page images

There is **no separate folder per page**. Because the whole blog lives in one MDX file, just continue using the post's image folder:

```
public/images/blog/<post-slug>/figure-1.jpg
public/images/blog/<post-slug>/figure-2.png
```

Reference them inline as usual:

```markdown
![Phase diagram](/images/blog/kan-deep-dive/figure-1.jpg)
```

Each image stays on whichever page it appears between split points.

#### Step 5 — How the reader navigates

Once multi-page mode is active, the reader gets:

- A **floating page index** on the left (similar to the existing table of contents) listing every page title. Clicking any page jumps to it.
- A **bottom navigation bar** at the end of each page with "Previous page" and "Next page" buttons (including the target page's title).
- A **progress dots** strip indicating the current page.
- A **toolbar above the article** to switch between single-page and multi-page modes at any time, or to re-open the choice prompt.

#### Step 6 — Series + multi-page edge cases

When a post is **both** part of a series **and** in multi-page mode, the bottom navigation adapts intelligently:

| Current page         | Left button        | Right button       |
| -------------------- | ------------------ | ------------------ |
| First page           | **Previous blog**¹ | Next page          |
| Middle page          | Previous page      | Next page          |
| Last page            | Previous page      | **Next blog**²     |

¹ Only shown if the post has a previous post in its series — otherwise just hidden.
² Only shown if the post has a next post in its series — otherwise just hidden.

This means the user can flow seamlessly from one blog's last page directly into the next blog in the series.

#### Step 7 — Quick checklist for authoring a multi-page blog

1. Add `multiPage: true` to the frontmatter.
2. Pick a default split level via `multiPageSplit` (or rely on the default `h2`).
3. (Optional) Sprinkle `<PageBreak title="…" />` markers wherever you want custom splits.
4. (Optional) Set `multiPageRecommended: true` for very long posts.
5. (Optional) Set `multiPageOnly: true` if it really only reads well as paginated.
6. Drop images into `public/images/blog/<slug>/` and reference them inline.

That's it — the popup, toolbar, page index, navigation, and series integration are all automatic.

---

## 2. Edit WhoAmI

The WhoAmI section's text is primarily controlled by the personal info data file.
1. Open `src/data/content.ts`.
2. Locate the `personalInfo` object.
3. Edit the `bio` (short description) and `bioExtended` (paragraphs shown when expanded) fields.

```typescript
export const personalInfo = {
  // ...
  bio: `Your short bio here`,
  bioExtended: [
    `Paragraph 1`,
    `Paragraph 2`,
  ],
};
```

---

## 3. Edit content of Journey (Worldline)

Your timeline and journey milestones are stored as an array of objects.
1. Open `src/data/timeline.ts`.
2. You'll find an array named `timelineEvents`.
3. To add a new event, add a new object to the array:
```typescript
{
  id: 'new-event',
  year: '2024',
  title: 'My New Milestone',
  subtitle: 'A brief description',
  category: 'work', // 'education', 'work', or 'research'
  description: 'Detailed description of what you accomplished.',
  icon: 'Briefcase' // Must be a valid Lucide React icon name
}
```

---

## 4. Edit Interests (Manifold Section)

Your interests are visualized as an interactive node graph.
1. Open `src/data/interests.ts`.
2. **To add a new interest (node):**
   Add an object to the `nodes` array:
   ```typescript
   { 
     id: 'new-interest', 
     label: 'New Interest', 
     category: 'physics', // Determines color
     size: 1.5, // 1 is normal, larger is bigger
     isHub: false, 
     description: 'Why I am interested in this.' 
   }
   ```
3. **To connect interests (edges):**
   Add an object to the `edges` array:
   ```typescript
   { from: 'existing-interest', to: 'new-interest', strength: 0.8, description: 'How they relate' }
   ```

---

## 5. Add/Edit Projects (CS/Physics)

Projects are displayed in the Projects section with details and links.
1. Open `src/data/projects.ts`.
2. Add or modify an object in the `projects` array:
```typescript
{
  id: 'my-new-project',
  title: 'Project Title',
  description: 'What the project does.',
  category: 'cs', // 'cs' or 'physics'
  tags: ['Python', 'Machine Learning'],
  image: '/images/projects/project.jpg', // optional
  links: {
    github: 'https://github.com/BlakkTyger/my-repo', // optional
    website: 'https://my-demo.com', // optional
    paper: '/docs/my-paper.pdf', // optional
    presentation: 'https://drive.google.com/file/d/.../view' // optional
  },
  year: 2025 // optional
}
```

> [!NOTE]
> **Selective Links & Asset Availability**:
> The `assets` object has been completely removed from the project schema. All external references are now managed inside the `links` object.
>
> All keys within `links` (`github`, `website`, `paper`, `presentation`, `docs`) are entirely optional. If a project does not have a website, research paper, or presentation slides, simply remove those specific keys from that project's `links` object. The UI will automatically hide the corresponding button/link for that project.

---

## 6. Edit contents of Minimal Website

The minimal version of your website is a single React component.
1. Open `src/app/simple/page.tsx`.
2. Locate the static content arrays (`education`, `experience`, `projects`).
3. Edit, add, or remove items directly within those arrays.

---

## 7. Edit Miscellaneous (Books, Courses, Research Articles)

The Miscellaneous section contains curated lists.
1. Open `src/app/misc/page.tsx`.
2. At the top of the file, you'll find data arrays: `books`, `courses`, `problemStatements`, and `researchArticles`.
3. Add new items directly to these arrays. For example:
   ```typescript
   const books = [
     // ... existing books
     { title: 'New Book', author: 'Author Name', year: 2024 },
   ];
   ```
4. **To add a new subsection:**
   Scroll down to the `grid` layout in the JSX. Copy an existing `<section>` block and paste it below. Update the icon, title, and map over your new data array.

---

## 8. Turning Intro Animation On/Off (Cinematic Star Intro)

The portfolio features a high-fidelity **Stellar Collapse & Black Hole Intro** animation on initial load. By default, it is configured to run **only once per user session** by storing a seen state in `localStorage` to avoid repeating it on subsequent visits.

During development or debugging, you can easily toggle this behavior on or off:

### To play the Intro on EVERY page refresh (Recommended for development):
1. Open the file [StellarIntro.tsx](file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/components/dom/StellarIntro.tsx).
2. Look for the `useEffect` hook near line 40:
   ```typescript
   // ── DEVELOPER REFERENCE: INTRO REPEAT VISITS BYPASS ──
   // By default, the intro animation is shown only ONCE per user. A key is saved in localStorage.
   // -> To force the intro on EVERY refresh: Comment out lines 47-49.
   // -> To restore showing it only once: Uncomment lines 47-49.
   useEffect(() => {
     setHasMounted(true);
     try {
       if (localStorage.getItem(LOCALSTORAGE_KEY) === 'true') {
         setIntroComplete(true);
       }
     } catch {}
   }, [setIntroComplete]);
   ```
3. **Comment out** the `if (localStorage.getItem(...) === 'true')` check to bypass the cache.

### To prevent saving the 'seen' state in production:
1. In the same [StellarIntro.tsx](file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/components/dom/StellarIntro.tsx) file, locate the `handleComplete` callback:
   ```typescript
   const handleComplete = useCallback(() => {
     // ...
     // ── DEVELOPER REFERENCE: SAVE SEEN STATE IN LOCALSTORAGE ──
     // -> Comment out the line below to stop saving the seen key in localStorage:
     try { localStorage.setItem(LOCALSTORAGE_KEY, 'true'); } catch {}
     // ...
   });
   ```
2. **Comment out** the `try { localStorage.setItem(...) }` line. 

To clear your browser cache manually during testing without editing files, run this command in your browser's developer tools console:
```javascript
localStorage.removeItem('stellar-intro-seen')
```
