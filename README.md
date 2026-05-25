This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Managing Blog and Project Pages

### How to Create a New Blog Page
1. Create a new `.mdx` file in `content/posts/` (e.g., `my-new-post.mdx`).
2. The filename will be the URL slug (e.g., `/blog/my-new-post`).
3. Add the following YAML frontmatter to the top of the file:
   ```yaml
   ---
   title: "Your Post Title"
   description: "A short summary of what the post is about."
   date: "YYYY-MM-DD"
   tags: ["tag1", "tag2"]
   published: true
   ---
   ```
4. Write your content in Markdown or MDX below the frontmatter.

### Adding Assets and Images for Projects/Blogs
- **Images:** Place images in `public/images/projects/` (or `public/images/blog/` for generic blog images).
- **Documents/PDFs:** Place documents like PDFs or PPTs in `public/docs/`.
- **Icons for Assets in Project Cards:** If you are adding a new project to `src/data/projects.ts` and want to show icons for PDFs, presentations, or websites:
  - Add the `assets` and `links` objects in the project entry:
    ```typescript
    {
      id: 'my-project',
      title: 'My Project',
      description: '...',
      category: 'physics', // or 'cs'
      tags: ['...'],
      image: '/images/projects/my-project.png', // The image for the card
      assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
    }
    ```
  - The website will automatically render the appropriate icons (e.g. `FileText` for documents/papers, `Presentation` for PPT/slides, `Github` for repo, etc.) in the project cards.

### Formatting the Blog
You can use standard Markdown syntax, as well as React components thanks to MDX.
For example, you can use built-in components like `<Alert>` or `<Callout>`:
```mdx
<Alert type="info">This is an informational alert.</Alert>
<Callout emoji="💡">This is a callout block with an emoji.</Callout>
```