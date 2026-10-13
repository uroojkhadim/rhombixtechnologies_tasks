import { environment } from '../../../environments/environment';

export const imageUrl = (
  path?: string,
  fallback = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'
): string => {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  return `${environment.uploadsUrl}${path}`;
};
