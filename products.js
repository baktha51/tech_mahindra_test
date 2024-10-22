const apiUrl = "https://fakestoreapi.com/products";
let allProducts = [];
let displayedProducts = [];
let currentDisplayCount = 10;

async function fetchProducts() {
  showLoading(true);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    allProducts = await response.json();
    displayedProducts = allProducts.slice(0, currentDisplayCount);

    renderProducts(displayedProducts);
  } catch (error) {
    console.error("Fetching products failed:", error);
    document.getElementById("product-list").innerHTML =
      "<p>Error loading products. Please try again later.</p>";
  } finally {
    showLoading(false);
    toggleLoadMoreButton();
  }
}

function showLoading(isLoading) {
  const placeholderLoader = document.getElementById("placeholder-loader");
  const productList = document.getElementById("product-list");

  if (isLoading) {
    placeholderLoader.style.display = "grid";
    productList.style.display = "none";
    renderPlaceholders(10);
  } else {
    placeholderLoader.style.display = "none";
    productList.style.display = "grid";
  }
}

function renderPlaceholders(count) {
  const placeholderContainer = document.getElementById("placeholder-loader");
  placeholderContainer.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const placeholderItem = document.createElement("div");
    placeholderItem.className = "placeholder-item";
    placeholderItem.innerHTML = `
      <div class="placeholder-img"></div>
      <div class="placeholder-text"></div>
      <div class="placeholder-text" style="width: 40%;"></div>
    `;
    placeholderContainer.appendChild(placeholderItem);
  }
}

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p class="product_desc">${product.description}</p>
      <div class="pricingdetail">
        <p class="price">Price: $${product.price}</p>
      </div>
    `;
    productList.appendChild(productItem);
  });

  updateResultCount(products.length);
  toggleLoadMoreButton();
}

function updateResultCount(count) {
  const resultCountElement = document.getElementById("result-count");
  resultCountElement.textContent = `${count} Result${count !== 1 ? "s" : ""}`;
}

function toggleLoadMoreButton() {
  const loadMoreButton = document.getElementById("load-more");
  if (allProducts.length > currentDisplayCount) {
    loadMoreButton.style.display = "block";
  } else {
    loadMoreButton.style.display = "none";
  }
}

document.getElementById("search").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  displayedProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  applySortingAndRender();
});

document.getElementById("sort-options").addEventListener("change", () => {
  applySortingAndRender();
});

function applySortingAndRender() {
  const sortOption = document.getElementById("sort-options").value;
  let sortedProducts = [...displayedProducts];

  if (sortOption === "asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(sortedProducts);
}

document.getElementById("load-more").addEventListener("click", () => {
  currentDisplayCount += 10;
  displayedProducts = allProducts.slice(0, currentDisplayCount);
  applySortingAndRender();
});

// Category Filter
const categoryCheckboxes = document.querySelectorAll("#category-filter input[type='checkbox']");

categoryCheckboxes.forEach((checkbox) =>
  checkbox.addEventListener("change", applyCategoryFilter)
);

function applyCategoryFilter() {
  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (selectedCategories.length === 0) {
    displayedProducts = allProducts.slice(0, currentDisplayCount);
  } else {
    displayedProducts = allProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  applySortingAndRender();
}

fetchProducts();
