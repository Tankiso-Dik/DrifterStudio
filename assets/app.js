(function () {
  const API_BASE_URL = "https://expert-caterpillar-555.convex.site/api/portfolio_items";
  const CACHE_KEY = "drifterstudio_portfolio_cache_v1";
  const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

  const grid = document.querySelector("[data-products-grid]");
  const status = document.querySelector("[data-status]");
  const currentYear = document.querySelector("[data-year]");
  if (!grid || !status) return;

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* storage unavailable */
    }
  }

  function readCache() {
    const raw = safeStorageGet(CACHE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    if (!parsed || !Array.isArray(parsed.items) || typeof parsed.ts !== "number") {
      return null;
    }
    return parsed;
  }

  function saveCache(items) {
    safeStorageSet(
      CACHE_KEY,
      JSON.stringify({
        ts: Date.now(),
        items,
      }),
    );
  }

  function cleanText(value) {
    if (!value) return "";
    return String(value)
      .replace(/[#*_`>\-\[\]\(\)]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeSupportingImages(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim().length > 0) {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
    return [];
  }

  function normalizeItems(payload) {
    const source = payload && payload.data;
    const rawItems = Array.isArray(source?.items)
      ? source.items
      : Array.isArray(source)
        ? source
        : [];

    return rawItems
      .filter((item) => item && item.title && item.thumbnail_url && item.product_url)
      .filter((item) => item.is_active !== false)
      .map((item) => ({
        id: item.id || `${item.title}-${Math.random()}`,
        title: String(item.title),
        thumbnail_url: String(item.thumbnail_url),
        supporting_image_urls: normalizeSupportingImages(item.supporting_image_urls),
        product_url: String(item.product_url),
        price: Number(item.price || 0),
        currency: item.currency || "USD",
        summary: cleanText(item.summary_md) || cleanText(item.description_rich) || "",
        status: item.status || "",
      }));
  }

  function formatPrice(value, currency) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(value);
    } catch (error) {
      return `$${Number(value || 0).toFixed(2)}`;
    }
  }

  function setupImageRotation(card, image, images) {
    if (images.length < 2) return;

    let index = 0;
    let timer = null;

    function rotate() {
      index = (index + 1) % images.length;
      image.classList.add("is-swapping");
      image.src = images[index];
      setTimeout(() => image.classList.remove("is-swapping"), 260);
    }

    function start() {
      if (timer) return;
      rotate();
      timer = window.setInterval(rotate, 1150);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      index = 0;
      image.src = images[0];
      image.classList.remove("is-swapping");
    }

    card.addEventListener("pointerenter", start);
    card.addEventListener("pointerleave", stop);
    card.addEventListener("blur", stop, true);
  }

  function createCard(item) {
    const card = document.createElement("article");
    card.className = "card";

    const media = document.createElement("div");
    media.className = "card__media";

    const image = document.createElement("img");
    image.className = "card__image";
    image.src = item.thumbnail_url;
    image.alt = item.title;
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);

    const content = document.createElement("div");
    content.className = "card__content";

    const title = document.createElement("h2");
    title.className = "card__title";
    title.textContent = item.title;

    const summary = document.createElement("p");
    summary.className = "card__summary";
    summary.textContent = item.summary || "Premium Procreate asset for artists who care about texture.";

    const meta = document.createElement("div");
    meta.className = "card__meta";

    const price = document.createElement("span");
    price.className = "card__price";
    price.textContent = formatPrice(item.price, item.currency);

    const cta = document.createElement("a");
    cta.className = "card__cta";
    cta.href = item.product_url;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer";
    cta.textContent = "View Product";

    meta.append(price, cta);
    content.append(title, summary, meta);
    card.append(media, content);

    const rotatingImages = [item.thumbnail_url, ...item.supporting_image_urls].filter(Boolean);
    setupImageRotation(card, image, [...new Set(rotatingImages)]);

    return card;
  }

  function render(items) {
    grid.innerHTML = "";
    if (!items.length) {
      setStatus("No products were returned from the CMS.", true);
      return;
    }
    const fragment = document.createDocumentFragment();
    items.forEach((item) => fragment.appendChild(createCard(item)));
    grid.appendChild(fragment);
    setStatus(`Showing ${items.length} products.`);
  }

  async function fetchPage(cursor) {
    const requestUrl = `${API_BASE_URL}?limit=200&cursor=${encodeURIComponent(String(cursor))}&sort=-createdAt`;
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    return response.json();
  }

  async function fetchProducts() {
    const allItems = [];
    let cursor = 0;
    let attempts = 0;

    while (attempts < 24) {
      const payload = await fetchPage(cursor);
      const pageItems = normalizeItems(payload);
      allItems.push(...pageItems);

      const pageInfo = payload?.data?.page_info;
      if (!pageInfo || !pageInfo.has_more || pageInfo.next_cursor == null) {
        break;
      }

      cursor = pageInfo.next_cursor;
      attempts += 1;
    }

    const deduped = [];
    const seen = new Set();
    for (const item of allItems) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        deduped.push(item);
      }
    }

    return deduped;
  }

  async function init() {
    const cached = readCache();
    const hasFreshCache = cached && Date.now() - cached.ts < CACHE_TTL_MS;

    if (cached?.items?.length) {
      render(cached.items);
      setStatus(
        hasFreshCache
          ? `Showing ${cached.items.length} products (cached).`
          : `Showing ${cached.items.length} products (cache, refreshing...).`,
      );
    } else {
      setStatus("Loading products...");
    }

    try {
      const items = await fetchProducts();
      render(items);
      saveCache(items);
    } catch (error) {
      if (cached?.items?.length) {
        setStatus("Live refresh failed, using cached products.", true);
      } else {
        setStatus("Could not load products from CMS.", true);
      }
    }
  }

  init();
})();
