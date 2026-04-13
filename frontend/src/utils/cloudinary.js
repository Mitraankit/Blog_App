/**
 * Transforms a Cloudinary image URL to apply automatic format (WebP/AVIF),
 * quality, and resize transformations.
 *
 * @param {string} src   - Original Cloudinary URL
 * @param {object} opts  - { w, h, fit } — width, height, crop mode (default: fill)
 * @returns {string}     - Optimised URL, or original src if not Cloudinary
 */
export function cloudinaryUrl(src, { w, h, fit = 'fill' } = {}) {
  if (!src || !src.includes('res.cloudinary.com')) return src;

  const transforms = ['f_auto', 'q_auto'];
  if (w) transforms.push(`w_${w}`);
  if (h) transforms.push(`h_${h}`);
  if (w || h) transforms.push(`c_${fit}`);

  // Insert transforms after /upload/
  return src.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
