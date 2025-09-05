class WardrobeManager {
    constructor() {
        this.currentCategory = 'dresses';
    }

    init() {
        this.loadWardrobe();
        this.showCategory(this.currentCategory);
    }

    loadWardrobe() {
        const wardrobeConfig = assetLoader.getWardrobeConfig();
        const clothesGrid = document.getElementById('clothesGrid');
        
        // Очищаем сетку
        clothesGrid.innerHTML = '';
        
        // Загружаем одежду для всех категорий
        Object.entries(wardrobeConfig.categories).forEach(([category, items]) => {
            items.forEach(item => {
                const clothing = assetLoader.getClothing(item.id, category);
                if (clothing) {
                    this.createClothingItem(clothing, category);
                }
            });
        });
    }

    createClothingItem(clothing, category) {
        const clothesGrid = document.getElementById('clothesGrid');
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'clothing-item';
        itemDiv.dataset.itemId = clothing.id;
        itemDiv.dataset.category = category;
        itemDiv.style.display = 'none'; // Сначала скрываем
        
        const img = document.createElement('img');
        img.src = clothing.thumbnail || clothing.image;
        img.alt = clothing.name;
        img.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2OUI0IiBmaWxsLW9wYWNpdHk9IjAuMyIgcng9IjgiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5orgL0yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMSAxNUgxM00yMSAxMlYxNUwzIDE1VjEyQzMgNy4wMjkgNy4wMjkgMyAxMiAzQzE2Ljk3MSAzIDIxIDcuMDI5IDIxIDEyWiIgc3Ryb2tlPSIjRkY2OUI0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+';
        };

        const name = document.createElement('p');
        name.textContent = clothing.name;

        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        clothesGrid.appendChild(itemDiv);
    }

    showCategory(category) {
        this.currentCategory = category;
        
        // Скрываем все элементы одежды
        document.querySelectorAll('.clothing-item').forEach(item => {
            item.style.display = 'none';
        });
        
        // Показываем только выбранную категорию
        document.querySelectorAll(`.clothing-item[data-category="${category}"]`).forEach(item => {
            item.style.display = 'block';
        });
        
        // Обновляем активную кнопку
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.tab-button[data-category="${category}"]`).classList.add('active');
    }

    getCurrentCategory() {
        return this.currentCategory;
    }
}

// Создаем экземпляр менеджера гардероба
const wardrobeManager = new WardrobeManager();
