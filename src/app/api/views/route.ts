import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'data', 'views.json');

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let views: Record<string, number> = {};
    
    if (fs.existsSync(VIEWS_FILE)) {
      const data = fs.readFileSync(VIEWS_FILE, 'utf8');
      views = JSON.parse(data);
    }
    
    views[slug] = (views[slug] || 0) + 1;
    
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2));
    
    return NextResponse.json({ views: views[slug] });
  } catch (error) {
    console.error('Error updating views:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    let views: Record<string, number> = {};
    if (fs.existsSync(VIEWS_FILE)) {
      const data = fs.readFileSync(VIEWS_FILE, 'utf8');
      views = JSON.parse(data);
    }
    return NextResponse.json(views);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
