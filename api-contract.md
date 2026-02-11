================================================================================
COLLECTION: portfolio_items
================================================================================

AI PROMPT:
Auto-instructions for "portfolio_items" collection:

CONVEX ENV VARS:
- CONVEX_DEPLOYMENT=dev:expert-caterpillar-555
- NEXT_PUBLIC_CONVEX_URL=https://expert-caterpillar-555.convex.cloud
- NEXT_PUBLIC_CONVEX_SITE_URL=https://expert-caterpillar-555.convex.site

BASE URL:
- https://expert-caterpillar-555.convex.site

ITEM ENDPOINTS:
- LIST: GET https://expert-caterpillar-555.convex.site/api/portfolio_items?limit=50&cursor=0&sort=-createdAt
- GET: GET https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}
- CREATE: POST https://expert-caterpillar-555.convex.site/api/portfolio_items?coerce=true
- UPDATE: PUT https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}?coerce=true
- DELETE: DELETE https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}

COLLECTION MANAGEMENT ENDPOINTS:
- API_INDEX: GET https://expert-caterpillar-555.convex.site/api
- OPENAPI_JSON: GET https://expert-caterpillar-555.convex.site/api/openapi.json
- LIST_COLLECTIONS: GET https://expert-caterpillar-555.convex.site/api/collections
- CREATE_COLLECTION: POST https://expert-caterpillar-555.convex.site/api/collections
- GET_COLLECTION: GET https://expert-caterpillar-555.convex.site/api/collections/{collectionNameOrId}
- UPDATE_COLLECTION: PUT https://expert-caterpillar-555.convex.site/api/collections/{collectionNameOrId}
- DELETE_COLLECTION: DELETE https://expert-caterpillar-555.convex.site/api/collections/{collectionNameOrId}

RESPONSE SHAPE:
{
  "success": true,
  "data": "<payload>",
  "error": null,
  "details": "<optional; mainly present on error responses>"
}

LIST/PAGINATION OPTIONS:
- GET /api/portfolio_items supports: limit (default 50, max 200), cursor, sort.
- Scalable pagination is supported with sort=createdAt or sort=-createdAt.
- Cursor can be a numeric offset, or an opaque token returned in page_info.next_cursor for createdAt pagination.
- If limit/cursor/sort are provided, data is returned as { items, page_info }.

CREATING ITEMS:
- Use POST https://expert-caterpillar-555.convex.site/api/portfolio_items?coerce=true
- coerce=true converts common string inputs into schema types (number/boolean/array/relation)
- Required fields: title, thumbnail_url, product_url, price, status
- Example payload:
{
  "title": "Example",
  "description_rich": "<p>Rich text content</p>",
  "summary_md": "## Heading\n\nMarkdown content",
  "thumbnail_url": "https://example.com/image.jpg",
  "supporting_image_urls": "https://example.com/image.jpg",
  "product_url": "https://example.com/image.jpg",
  "price": 123,
  "currency": "Example",
  "tags": [],
  "featured": true,
  "is_active": true,
  "status": "draft",
  "published_at": "2026-02-11T14:00:37.266Z",
  "metadata": {
    "key": "value"
  },
  "settings_json": {
    "key": "value"
  }
}

READING ITEMS:
- Use GET https://expert-caterpillar-555.convex.site/api/portfolio_items to list all items
- Use GET https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId} to fetch one item

UPDATING ITEMS:
- Use PUT https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}?coerce=true
- Only non-readonly fields can be updated

DELETING ITEMS:
- Use DELETE https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}

DISCOVERY:
- Use GET https://expert-caterpillar-555.convex.site/api/openapi.json for machine-readable API contracts.

FIELD TYPES:
- title (string, required)
- description_rich (rich_text)
- summary_md (markdown)
- thumbnail_url (image_url, required)
- supporting_image_urls (array)
- product_url (url, required)
- price (number, required)
- currency (string)
- tags (array)
- featured (boolean)
- is_active (boolean)
- status (enum, required)
- published_at (date)
- metadata (object)
- settings_json (json)

--------------------------------------------------------------------------------
CONVEX ENV
--------------------------------------------------------------------------------
CONVEX_DEPLOYMENT=dev:expert-caterpillar-555
NEXT_PUBLIC_CONVEX_SITE_URL=https://expert-caterpillar-555.convex.site
NEXT_PUBLIC_CONVEX_URL=https://expert-caterpillar-555.convex.cloud

--------------------------------------------------------------------------------
ITEM ENDPOINTS
--------------------------------------------------------------------------------
CREATE: POST https://expert-caterpillar-555.convex.site/api/portfolio_items?coerce=true
DELETE: DELETE https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}
GET: GET https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}
LIST: GET https://expert-caterpillar-555.convex.site/api/portfolio_items?limit=50&cursor=0&sort=-createdAt
UPDATE: PUT https://expert-caterpillar-555.convex.site/api/portfolio_items/{itemId}?coerce=true

--------------------------------------------------------------------------------
COLLECTION ENDPOINTS
--------------------------------------------------------------------------------
API_INDEX: GET https://expert-caterpillar-555.convex.site/api
CREATE_COLLECTION: POST https://expert-caterpillar-555.convex.site/api/collections
DELETE_COLLECTION: DELETE https://expert-caterpillar-555.convex.site/api/collections/{collectionNameOrId}
GET_COLLECTION: GET https://expert-caterpillar-555.convex.site/api/collections/{collectionNameOrId}
LIST_COLLECTIONS: GET https://expert-caterpillar-555.convex.site/api/collections
OPENAPI_JSON: GET https://expert-caterpillar-555.convex.site/api/openapi.json
UPDATE_COLLECTION: PUT https://expert-caterpillar-555.convex.site/api/collections/{collectionNameOrId}

--------------------------------------------------------------------------------
RESPONSE SHAPE
--------------------------------------------------------------------------------
{
  "data": "<payload>",
  "details": "<optional; mainly present on error responses>",
  "error": null,
  "success": true
}

--------------------------------------------------------------------------------
SCHEMA / FIELDS
--------------------------------------------------------------------------------
  title: string (required)
    Used in: GET (read), POST (create), PUT (update)
  description_rich: rich_text (nullable)
    Used in: GET (read), POST (create), PUT (update)
  summary_md: markdown (nullable)
    Used in: GET (read), POST (create), PUT (update)
  thumbnail_url: image_url (required)
    Used in: GET (read), POST (create), PUT (update)
  supporting_image_urls: array (nullable)
    Used in: GET (read), POST (create), PUT (update)
  product_url: url (required)
    Used in: GET (read), POST (create), PUT (update)
  price: number (required)
    Used in: GET (read), POST (create), PUT (update)
  currency: string (nullable)
    Used in: GET (read), POST (create), PUT (update)
  tags: array (nullable)
    Used in: GET (read), POST (create), PUT (update)
  featured: boolean (nullable)
    Used in: GET (read), POST (create), PUT (update)
  is_active: boolean (nullable)
    Used in: GET (read), POST (create), PUT (update)
  status: enum (required)
    Used in: GET (read), POST (create), PUT (update)
  published_at: date (nullable)
    Used in: GET (read), POST (create), PUT (update)
  metadata: object (nullable)
    Used in: GET (read), POST (create), PUT (update)
  settings_json: json (nullable)
    Used in: GET (read), POST (create), PUT (update)
  id: string (readonly) (required) (primary key)
    Used in: GET (read)
  _meta.createdAt: date (readonly) (nullable)
    Used in: GET (read)
  _meta.updatedAt: date (readonly) (nullable)
    Used in: GET (read)
