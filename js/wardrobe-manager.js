class WardrobeManager {
    constructor() {
        this.currentCategory = 'dresses';
    }

    init() {
        this.loadWardrobe();
        this.showCategory(this.currentCategory);
    }

    loadWardrobe() {
        if (!assetLoader || !assetLoader.getWardrobeConfig) {
            this.showErrorMessage();
            return;
        }

        const wardrobeConfig = assetLoader.getWardrobeConfig();
        const clothesGrid = document.getElementById('clothesGrid');
        
        if (!clothesGrid) return;
        
        // Очищаем сетку
        clothesGrid.innerHTML = '';
        
        if (!wardrobeConfig || !wardrobeConfig.categories) {
            this.showErrorMessage();
            return;
        }
        
        // Загружаем одежду для всех категорий
        Object.entries(wardrobeConfig.categories).forEach(([category, items]) => {
            items.forEach(item => {
                const clothing = assetLoader.getClothing(item.id, category);
                if (clothing) {
                    this.createClothingItem(clothing, category);
                }
            });
        });
        
        // Показываем первую категорию
        this.showCategory(this.currentCategory);
    }

    showErrorMessage() {
        const clothesGrid = document.getElementById('clothesGrid');
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
        const clothesGrid = document.getElementById('clothesGrid');
        if (!clothesGrid) return;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'clothing-item';
        itemDiv.dataset.itemId = clothing.id;
        itemDiv.dataset.category = category;
        itemDiv.style.display = 'none';
        itemDiv.title = clothing.name;
        
        const img = document.createElement('img');
        img.src = clothing.thumbnail || clothing.image || '';
        img.alt = clothing.name;
        img.onerror = () => {
            img.src = this.createClothingPlaceholder(clothing.name);
        };

        const name = document.createElement('p');
        name.textContent = clothing.name && clothing.name.length > 15 
            ? clothing.name.substring(0, 12) + '...' 
            : clothing.name || 'Без названия';

        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        clothesGrid.appendChild(itemDiv);
    }

    createClothingPlaceholder(name) {
        const color = this.getColorFromName(name || 'item');
        const text = name ? name.substring(0, 8) : 'item';
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}" opacity="0.3" rx="8"/><text x="40" y="45" font-family="Arial" font-size="12" text-anchor="middle" fill="${color}">${text}</text></svg>`;
    }

    getColorFromName(name) {
        const colors = ['#ff69b4', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    showCategory(category) {
        this.currentCategory = category;
        
        // Скрываем все элементы одежды
        document.querySelectorAll('.clothing-item').forEach(item => {
            item.style.display = 'none';
        });
        
        // Показываем только выбранную категорию
        const items = document.querySelectorAll(`.clothing-item[data-category="${category}"]`);
        if (items.length > 0) {
            items.forEach(item => {
                item.style.display = 'block';
            });
        } else {
            this.showNoItemsMessage();
        }
        
        // Обновляем активную кнопку
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeButton = document.querySelector(`.tab-button[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    showNoItemsMessage() {
        const clothesGrid = document.getElementById('clothesGrid');
        if (clothesGrid) {
            clothesGrid.innerHTML = `
                <div class="no-items-message">
                    <p>В этой категории пока нет одежды</p>
                </div>
            `;
        }
    }

    getCurrentCategory() {
        return this.currentCategory;
    }
}

// Создаем экземпляр менеджера гардероба
const wardrobeManager = new WardrobeManager();
