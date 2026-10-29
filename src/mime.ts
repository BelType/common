/**
 * `mime.js` — MIME types, one table, one answer on every path (see CHANGELOG 2026-10-17).
 *
 * @packageDocumentation
 */

import path from 'path';

/** Keyed by lowercase extension, dot included. */
const MIME_TYPES: Readonly<Record<string,string>> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf'
};

/**
 * Content-Type for a file path, by its extension, case-insensitively.
 *
 * @returns The bare media type, no `charset` parameter. `application/octet-stream` for an extension the table does not hold.
 */
export function contentType(filePath: string) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}
