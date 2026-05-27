'use client'

import { useEffect } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Only track view once in production, but handle strict mode in dev
    const hasViewed = sessionStorage.getItem(`viewed_${slug}`);
    
    if (!hasViewed) {
      fetch('/api/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      }).catch(err => console.error('Error tracking view:', err));
      
      sessionStorage.setItem(`viewed_${slug}`, 'true');
    }
  }, [slug]);

  return null;
}
