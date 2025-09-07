class BarbieDressUpGame {
    constructor() {
        this.currentDoll = null;
        this.currentClothes = {
            dresses: null,
            tops: null,
            pants: null,
            shoes: null,
            accessories: null
        };
        this.hairColor = '#ffd700';
        this.eyesColor = '#00aaff';
        
        this.init();
    }

    async init() {
        try {
            // Загрузка ассетов
            await assetLoader.loadAssets();
            
            // Инициализация компонентов
            this.initWardrobe();
            this.initCanvas();
            this.initColorPickers();
            this.initEventListeners();
            
            // Установка куклы по умолчанию
            this.setDoll('barbie-base');
            this.render();
            
        } catch (error) {
            console.error('Ошибка инициализации игры:', error);
        }
    }

    initWardrobe() {
        wardrobeManager.init();
    }

    initCanvas() {
        canvasRenderer.init();
    }

    initColorPickers() {
        colorPicker.init(this.updateColors.bind(this));
    }

    initEventListeners() {
        // Кнопки сброса и сохранения
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveOutfit());

        // Переключение категорий
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
                e.target.classList.add('active');
            });
        });

        // Обработчик выбора одежды
        document.getElementById('clothesGrid').addEventListener('click', (e) => {
            const clothingItem = e.target.closest('.clothing-item');
            if (clothingItem) {
                const itemId = clothingItem.dataset.itemId;
                const category = clothingItem.dataset.category;
                this.selectClothing(itemId, category);
            }
        });
    }

    setDoll(dollId) {
        this.currentDoll = assetLoader.getDoll(dollId);
        this.render();
    }

    selectClothing(itemId, category) {
        const clothing = assetLoader.getClothing(itemId, category);
        if (clothing) {
            this.currentClothes[category] = clothing;
            this.render();
        }
    }

    switchCategory(category) {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Показываем одежду выбранной категории
        wardrobeManager.showCategory(category);
    }

    updateColors(hairColor, eyesColor) {
        this.hairColor = hairColor;
        this.eyesColor = eyesColor;
        this.render();
    }

    render() {
        if (this.currentDoll) {
            canvasRenderer.render(this.currentDoll, this.currentClothes, this.hairColor, this.eyesColor);
        }
    }

    reset() {
        this.currentClothes = {
            dresses: null,
            tops: null,
            pants: null,
            shoes: null,
            accessories: null
        };
        this.hairColor = '#ffd700';
        this.eyesColor = '#00aaff';
        
        // Сброс цветовых пикеров
        document.getElementById('hairColor').value = this.hairColor;
        document.getElementById('eyesColor').value = this.eyesColor;
        
        this.render();
    }

    saveOutfit() {
        const canvas = document.getElementById('dollCanvas');
        const image = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = 'barbie-outfit.png';
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Образ сохранен!');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BarbieDressUpGame();
});
