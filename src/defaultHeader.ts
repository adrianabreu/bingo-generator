/** Inline SVG used when no URL or file is provided (no network request). */
const DEFAULT_HEADER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="96" viewBox="0 0 480 96"><rect fill="#e8eef2" width="480" height="96"/><text x="240" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" fill="#4a5568">Bingo</text></svg>`;

export const DEFAULT_BINGO_HEADER_IMAGE = `data:image/svg+xml,${encodeURIComponent(DEFAULT_HEADER_SVG)}`;
