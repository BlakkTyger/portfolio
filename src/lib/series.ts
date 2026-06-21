import fs from 'fs';
import path from 'path';
import { getAllPostsMeta, type PostMeta } from './mdx';

// === TYPES ===

/**
 * Series metadata loaded from `content/series/<id>.json` (optional).
 * If no JSON file exists, the series is auto-synthesized from the first post.
 */
export interface SeriesMeta {
  /** Series slug (matches the `series` frontmatter field on posts) */
  id: string;
  /** Display title of the series */
  title: string;
  /** Short blurb describing the arc of the series */
  description: string;
  /** Optional tagline (rendered above title on cards) */
  tagline?: string;
  /** Cover image (e.g. /images/series/<id>/cover.jpg) */
  cover?: string;
  /** Accent CSS color used for series-specific UI accents */
  accent?: string;
}

export interface Series extends SeriesMeta {
  /** Posts in the series, ordered by `seriesOrder` ascending, fallback to date */
  posts: PostMeta[];
}

// === PATHS ===

const SERIES_DIR = path.join(process.cwd(), 'content/series');

// === HELPERS ===

function loadSeriesMetaFile(id: string): Partial<SeriesMeta> | null {
  if (!fs.existsSync(SERIES_DIR)) return null;
  const jsonPath = path.join(SERIES_DIR, `${id}.json`);
  if (!fs.existsSync(jsonPath)) return null;
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw) as Partial<SeriesMeta>;
  } catch (err) {
    console.error(`[series] Failed to parse ${jsonPath}:`, err);
    return null;
  }
}

function sortSeriesPosts(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((a, b) => {
    const ao = a.seriesOrder ?? Number.POSITIVE_INFINITY;
    const bo = b.seriesOrder ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

// === PUBLIC API ===

/**
 * Return all series that have at least one published post.
 */
export function getAllSeries(): Series[] {
  const posts = getAllPostsMeta();
  const grouped: Record<string, PostMeta[]> = {};
  posts.forEach(p => {
    if (!p.series) return;
    if (!grouped[p.series]) grouped[p.series] = [];
    grouped[p.series].push(p);
  });

  return Object.entries(grouped).map(([id, postsInSeries]) => {
    const ordered = sortSeriesPosts(postsInSeries);
    const fileMeta = loadSeriesMetaFile(id) || {};
    const first = ordered[0];
    return {
      id,
      title: fileMeta.title || first.title,
      description: fileMeta.description || first.description,
      tagline: fileMeta.tagline,
      cover: fileMeta.cover || first.cover,
      accent: fileMeta.accent,
      posts: ordered,
    };
  });
}

/**
 * Lookup a series by id. Returns null if no posts belong to it.
 */
export function getSeries(id: string): Series | null {
  return getAllSeries().find(s => s.id === id) || null;
}

/**
 * Context for navigation: which series a post belongs to plus prev/next neighbours.
 */
export interface SeriesContext {
  series: Series;
  index: number;
  total: number;
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function getSeriesContextForPost(slug: string): SeriesContext | null {
  const all = getAllSeries();
  for (const series of all) {
    const index = series.posts.findIndex(p => p.slug === slug);
    if (index !== -1) {
      return {
        series,
        index,
        total: series.posts.length,
        prev: index > 0 ? series.posts[index - 1] : null,
        next: index < series.posts.length - 1 ? series.posts[index + 1] : null,
      };
    }
  }
  return null;
}

/**
 * Return all known series slugs (for static generation of /blog/series/[id]).
 */
export function getAllSeriesIds(): string[] {
  return getAllSeries().map(s => s.id);
}
