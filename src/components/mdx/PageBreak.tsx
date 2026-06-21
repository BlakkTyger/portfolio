/**
 * Explicit page-break marker for multi-page blogs.
 *
 * Usage in MDX:
 *   <PageBreak />
 *   <PageBreak title="Custom Page Title" />
 *
 * Renders an invisible <hr> element with `data-page-break` attribute, which
 * `MultiPageView` scans to determine where to split the content into pages.
 *
 * When present, custom page breaks override the automatic header-level split
 * specified by `multiPageSplit` in the post frontmatter. Inside a single MDX
 * file you can therefore mix: some pages split at h2, some at h4, and some at
 * arbitrary custom locations.
 */
export default function PageBreak({ title }: { title?: string }) {
  return (
    <hr
      data-page-break
      data-page-break-title={title || ''}
      className="hidden"
      aria-hidden
    />
  );
}
