import { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://himanshu.be';
  
  // Static routes
  const routes = [
    '',
    '/blog',
    '/cs-projects',
    '/research',
    '/misc',
    '/simple',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic blog post routes
  let posts: any[] = [];
  try {
    posts = getAllPostsMeta();
  } catch (e) {
    console.error('Error fetching posts for sitemap:', e);
  }

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
