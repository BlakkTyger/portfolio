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

## 5. Add Projects (CS/Physics)

Projects are displayed in the Projects section with details and links.
1. Open `src/data/projects.ts`.
2. Add a new object to the `projects` array:
```typescript
{
  id: 'my-new-project',
  title: 'Project Title',
  description: 'What the project does.',
  longDescription: 'A more detailed explanation.',
  tags: ['Python', 'Machine Learning'],
  category: 'cs', // 'cs', 'physics', or 'both'
  featured: true, // Set to true to highlight it
  links: {
    github: 'https://github.com/...',
    live: 'https://...', // optional
    paper: 'https://...' // optional
  }
}
```

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
