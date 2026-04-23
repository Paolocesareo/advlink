import type { MetadataRoute } from 'next';

type RouteConfig = {
  path: string;
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://advlink.it';
  const lastModified = new Date();

  const routes: ReadonlyArray<RouteConfig> = [
    { path: '', priority: 1 },
    { path: '/editori', priority: 0.8 },
    { path: '/inserzionisti', priority: 0.8 },
    { path: '/chi-siamo', priority: 0.8 },
    { path: '/contatti', priority: 0.8 },
    { path: '/privacy', priority: 0.5 },
    { path: '/cookie', priority: 0.5 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority,
  }));
}
