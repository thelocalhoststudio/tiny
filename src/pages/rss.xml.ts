import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getAllPosts, getPostUrl } from '@/utils/content';
import { getConfig } from '@/utils/config';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const siteConfig = await getConfig();
  const posts = await getAllPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: getPostUrl(post.id, post.filePath),
    })),
  });
};
