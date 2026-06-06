import { getAllPostsMeta, getCategoryHierarchy } from '@/lib/mdx';
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on physics, programming, and philosophy. Curated essays and research logs.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  const categoryHierarchy = getCategoryHierarchy();
  
  // Extract all unique tags - topics are optional and may not exist in PostMeta
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://himanshu.be'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://himanshu.be/blog'
      }
    ]
  };

  return (
    <>
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogPageClient posts={posts} allTags={allTags} categoryHierarchy={categoryHierarchy} />
    </>
  );
}