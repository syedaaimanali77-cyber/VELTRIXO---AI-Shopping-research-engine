// ===========================================================
// VELTRIXO — Results Page Logic
// Reads the ?q= search query from the URL, calls the FastAPI
// backend's /products/{query} endpoint, and renders the
// returned products into the results grid.
// ===========================================================

// TODO: Update this once the backend is deployed. It currently
// points at a local FastAPI dev server (uvicorn main:app --reload),
// which is the only backend that exists for VELTRIXO right now.
const API_BASE_URL = "http://127.0.0.1:8000";

const headingEl = document.getElementById("resultsHeading");
const statusEl = document.getElementById("resultsStatus");
const gridEl = document.getElementById("resultsGrid");

function getQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function renderProductCard(product) {
    const name = escapeHtml(product.name ?? "Unknown product");
    const store = escapeHtml(product.store ?? "Unknown store");
    const price = typeof product.price === "number" ? `$${product.price.toFixed(2)}` : "N/A";
    const rating = typeof product.rating === "number" ? product.rating.toFixed(1) : "N/A";
    const shipping = typeof product.shippingDays === "number"
        ? `${product.shippingDays} day${product.shippingDays === 1 ? "" : "s"}`
        : "N/A";
    const buyUrl = product.buyUrl ? escapeHtml(product.buyUrl) : null;

    return `
        <div class="product-card">
            <div class="product-store">${store}</div>
            <h3 class="product-name">${name}</h3>
            <div class="product-meta">
                <span class="product-price">${price}</span>
                <span class="product-rating"><i class="fa-solid fa-star"></i> ${rating}</span>
            </div>
            <div class="product-shipping">
                <i class="fa-solid fa-truck"></i> Delivery: ${shipping}
            </div>
            ${buyUrl
                ? `<a class="product-buy-btn" href="${buyUrl}" target="_blank" rel="noopener noreferrer">View Deal</a>`
                : `<span class="product-buy-btn product-buy-btn--disabled">Link unavailable</span>`
            }
        </div>
    `;
}

async function loadResults() {
    const query = getQueryFromUrl();

    // Keep the search bar in sync with the current query
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = query;
    }

    if (query === "") {
        headingEl.textContent = "";
        statusEl.innerHTML = `<p>No search term provided. <a href="index.html">Go back and search for a product.</a></p>`;
        gridEl.innerHTML = "";
        return;
    }

    headingEl.textContent = `Results for "${query}"`;
    statusEl.innerHTML = `<p><i class="fa-solid fa-spinner fa-spin"></i> Searching Veltrixo...</p>`;
    gridEl.innerHTML = "";

    let response;
    try {
        response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(query)}`);
    } catch (err) {
        statusEl.innerHTML = `
            <p>
                Couldn't reach the Veltrixo backend. Make sure the API is running
                at <code>${API_BASE_URL}</code> and try again.
            </p>
        `;
        return;
    }

    if (!response.ok) {
        statusEl.innerHTML = `<p>The server returned an error (status ${response.status}). Please try again.</p>`;
        return;
    }

    let products;
    try {
        products = await response.json();
    } catch (err) {
        statusEl.innerHTML = `<p>Received an unexpected response from the server.</p>`;
        return;
    }

    if (!Array.isArray(products) || products.length === 0) {
        statusEl.innerHTML = `<p>No products found for "${escapeHtml(query)}". Try a different search term.</p>`;
        gridEl.innerHTML = "";
        return;
    }

    statusEl.innerHTML = `<p>${products.length} result${products.length === 1 ? "" : "s"} found</p>`;
    gridEl.innerHTML = products.map(renderProductCard).join("");
}

document.addEventListener("DOMContentLoaded", loadResults);