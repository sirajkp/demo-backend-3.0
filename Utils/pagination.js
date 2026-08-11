const DEFAULT_PAGE_SIZE = 50;
// Bounded so one request can't pull the whole table.
const MAX_PAGE_SIZE = 200;

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Slices an already-filtered list into the page the client asked for.
 *
 * `page` is clamped to the last available page rather than 404'd - a filter can
 * shrink the list under the page the client is still holding, and an empty page
 * there reads as a broken table.
 *
 * Returns the page actually served, so the client can correct itself.
 */
export function paginate(items, query = {}) {
  const total = items.length;
  const pageSize = Math.min(
    toPositiveInt(query.pageSize, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(toPositiveInt(query.page, 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    data: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}
