class WardrobeManager {
  constructor() {
    this.currentCategory = "dresses";
    this.noItemsMessage = document.getElementById("noItemsMessage");
  }

  init() {
    this.loadWardrobe();
    this.showCategory(this.currentCategory);
  }

  loadWardrobe() {
    const wardrobeConfig = assetLoader.getWardrobeConfig();
    const clothesGrid = document.getElementById("clothesGrid");
    if (!clothesGrid || !wardrobeConfig || !wardrobeConfig.categories) {
      this.showErrorMessage();
      return;
    }

    clothesGrid.innerHTML = "";

    Object.entries(wardrobeConfig.categories).forEach(([category, items]) => {
      items.forEach(item => {
        if (!item.id) return;
        this.createClothingItem(item, category);
      });
    });

    this.showCategory(this.currentCategory);
  }

  showErrorMessage() {
    const clothesGrid = document.getElementById("clothesGrid");
    if (clothesGrid) {
      clothesGrid.innerHTML = `
        <div class="error-message">
          <p>Одежда не загружена</p>
          <p>Добавьте файлы в папку assets</p>
        </div>
      `;
    }
  }

  createClothingItem(clothing, category) {
    const clothesGrid = document.getElementById("clothesGrid");
    if (!clothesGrid) return;

    const itemDiv = document.createElement("div");
    itemDiv.className = "clothing-item";
    itemDiv.dataset.itemId = clothing.id;
    itemDiv.dataset.category = category;
    itemDiv.style.display = "none";
    itemDiv.title = clothing.name;

    const img = document.createElement("img");
    img.src = clothing.thumbnail || clothing.image || "";
    img.alt = clothing.name;
    img.onerror = () => {
      img.src = this.createClothingPlaceholder(clothing.name);
    };

    const name = document.createElement("p");
    name.textContent =
      clothing.name && clothing.name.length > 15
        ? clothing.name.substring(0, 12) + "..."
        : clothing.name || "Без названия";

    itemDiv.appendChild(img);
    itemDiv.appendChild(name);
    clothesGrid.appendChild(itemDiv);
  }

  createClothingPlaceholder(name) {
    const color = this.getColorFromName(name || "item");
    const safeText = (name || "item").substring(0, 8).replace(/[&<>"]/g, "_");
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}" opacity="0.3" rx="8"/><text x="40" y="45" font-family="Arial" font-size="12" text-anchor="middle" fill="${color}">${safeText}</text></svg>`;
  }

  getColorFromName(name) {
    const colors = [
      "#ff69b4",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#00bcd4",
      "#009688"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  showCategory(category) {
    this.currentCategory = category;

    document.querySelectorAll(".clothing-item").forEach(item => {
      item.style.display = "none";
    });

    const items = document.querySelectorAll(
      `.clothing-item[data-category="${category}"]`
    );

    if (items.length > 0) {
      this.noItemsMessage.style.display = "none";
      items.forEach(item => {
        item.style.display = "block";
      });
    } else {
      this.noItemsMessage.style.display = "block";
    }

    document.querySelectorAll(".tab-button").forEach(btn => {
      btn.classList.remove("active");
    });
    const activeButton = document.querySelector(
      `.tab-button[data-category="${category}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }
  }

  getCurrentCategory() {
    return this.currentCategory;
  }
}

const wardrobeManager = new WardrobeManager();
