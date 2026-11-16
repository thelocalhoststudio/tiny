import type { APIRoute } from 'astro';
import { getAllPosts, getPostUrl } from '@/utils/content';
import { formatDate, isoDate, excerpt } from '@/utils/text';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  const searchIndex = posts.map((post) => {
    const rawBody = post.body ?? '';
    const cleanExcerpt = post.data.description || excerpt(rawBody, 180);

    // Simple plain text for content searching
    const plainContent = rawBody
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`#|]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      title: post.data.title,
      url: getPostUrl(post.id, post.filePath),
      date: isoDate(post.data.published),
      formattedDate: formatDate(post.data.published),
      timestamp: new Date(post.data.published).getTime(),
      tags: post.data.tags ?? [],
      excerpt: cleanExcerpt,
      content: plainContent.slice(0, 4000), // bounded for lightweight index
    };
  });

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
