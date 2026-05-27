import { NextResponse } from 'next/server';
import { getAllPostSlugs } from '@/lib/mdx';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Call counterapi.dev v1 to increment
    const res = await fetch(`https://api.counterapi.dev/v1/himanshu-portfolio/${slug}/up`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to increment view counter from counterapi.dev:', res.statusText);
      return NextResponse.json({ error: 'Failed to increment view counter' }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ views: data.count || 0 });
  } catch (error) {
    console.error('Error updating views:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const slugs = getAllPostSlugs();
    const views: Record<string, number> = {};

    await Promise.all(
      slugs.map(async (slug) => {
        try {
          const res = await fetch(`https://api.counterapi.dev/v1/himanshu-portfolio/${slug}/`, {
            cache: 'no-store'
          });
          if (res.ok) {
            const data = await res.json();
            views[slug] = data.count || 0;
          } else {
            views[slug] = 0;
          }
        } catch (err) {
          console.error(`Error fetching views for slug ${slug}:`, err);
          views[slug] = 0;
        }
      })
    );

    return NextResponse.json(views);
  } catch (error) {
    console.error('Error in GET /api/views:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
