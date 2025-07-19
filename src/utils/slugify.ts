/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

/**
 * Creates a slug from an article title
 * @param title - The article title
 * @returns A URL-friendly slug
 */
export const createArticleSlug = (title: string): string => {
  return createSlug(title);
}; 