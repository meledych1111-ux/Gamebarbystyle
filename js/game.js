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
        this.selectedItems = new Set(); // Для отслеживания выбранной одежды
        
        this.init();
    }

    async init() {
        try {
            // Загрузка ассетов
            await assetLoader.loadAssets();
            
            // Инициализация компонентов
            this.initWardrobe();
            this.initCanvas();
            this.initEventListeners();
            
            // Установка куклы по умолчанию
            this.setDoll('barbie-base');
            this.render();
            
        } catch (error) {
            console.error('Ошибка инициализации игры:', error);
        }
    }

    initWardrobe() {
        if (typeof wardrobeManager !== 'undefined') {
            wardrobeManager.init();
        }
    }

    initCanvas() {
        if (typeof canvasRenderer !== 'undefined') {
            // Устанавливаем размер canvas согласно HTML
            const canvas = document.getElementById('dollCanvas');
            if (canvas) {
                canvas.width = 400;
                canvas.height = 650;
            }
            canvasRenderer.init();
        }
    }

    initEventListeners() {
        // Кнопки сброса и сохранения
        const resetBtn = document.getElementById('resetBtn');
        const saveBtn = document.getElementById('saveBtn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveOutfit());
        }

        // Переключение категорий
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
                
                // Убираем active у всех и добавляем текущему
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });

        // Обработчик выбора одежды
        const clothesGrid = document.getElementById('clothesGrid');
        if (clothesGrid) {
            clothesGrid.addEventListener('click', (e) => {
                const clothingItem = e.target.closest('.clothing-item');
                if (clothingItem) {
                    this.createSparkleEffect(e);
                    this.createSnowAnimation(); // Анимация снега
                    const itemId = clothingItem.dataset.itemId;
                    const category = clothingItem.dataset.category;
                    this.toggleClothing(itemId, category, clothingItem);
                }
            });
        }
    }

    createSparkleEffect(event) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.width = '20px';
        sparkle.style.height = '20px';
        sparkle.style.left = (event.clientX - 10) + 'px';
        sparkle.style.top = (event.clientY - 10) + 'px';
        sparkle.style.position = 'fixed';
        sparkle.style.zIndex = '1000';
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    createSnowAnimation() {
        // Создаем 15 снежинок
        for (let i = 0; i < 15; i++) {
            this.createSnowflake();
        }
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (2 + Math.random() * 3) + 's';
        snowflake.style.fontSize = (15 + Math.random() * 15) + 'px';
        snowflake.style.opacity = '0.8';
        
        document.body.appendChild(snowflake);
        
        // Удаляем снежинку после анимации
        setTimeout(() => {
            snowflake.remove();
        }, 3000);
    }

    setDoll(dollId) {
        if (assetLoader && assetLoader.getDoll) {
            this.currentDoll = assetLoader.getDoll(dollId);
            this.render();
        }
    }

    toggleClothing(itemId, category, clothingElement) {
        if (assetLoader && assetLoader.getClothing) {
            const clothing = assetLoader.getClothing(itemId, category);
            if (clothing) {
                const itemKey = `${category}-${itemId}`;
                
                // Проверяем, выбрана ли уже эта одежда
                if (this.selectedItems.has(itemKey)) {
                    // Снимаем одежду
                    this.currentClothes[category] = null;
                    this.selectedItems.delete(itemKey);
                    clothingElement.classList.remove('selected');
                } else {
                    // Одеваем одежду
                    this.currentClothes[category] = clothing;
                    this.selectedItems.add(itemKey);
                    clothingElement.classList.add('selected');
                    
                    // Снимаем выделение с другой одежды в этой категории
                    this.clearOtherSelections(category, itemKey);
                }
                
                this.render();
            }
        }
    }

    clearOtherSelections(currentCategory, currentItemKey) {
        // Убираем выделение с другой одежды в этой же категории
        document.querySelectorAll('.clothing-item').forEach(item => {
            const category = item.dataset.category;
            const itemId = item.dataset.itemId;
            const itemKey = `${category}-${itemId}`;
            
            if (category === currentCategory && itemKey !== currentItemKey) {
                item.classList.remove('selected');
                this.selectedItems.delete(itemKey);
            }
        });
    }

    switchCategory(category) {
        if (wardrobeManager && wardrobeManager.showCategory) {
            wardrobeManager.showCategory(category);
        }
    }

    render() {
        if (this.currentDoll && canvasRenderer && canvasRenderer.render) {
            canvasRenderer.render(this.currentDoll, this.currentClothes);
        }
    }

    reset() {
        // Сбрасываем всю одежду
        this.currentClothes = {
            dresses: null,
            tops: null,
            pants: null,
            shoes: null,
            accessories: null
        };
        
        // Очищаем выделения
        this.selectedItems.clear();
        document.querySelectorAll('.clothing-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Анимация сброса
        this.createSnowAnimation();
        
        this.render();
    }

    saveOutfit() {
        const canvas = document.getElementById('dollCanvas');
        if (!canvas) return;
        
        try {
            const image = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.download = 'barbie-outfit.png';
            link.href = image;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Анимация сохранения
            this.createSaveAnimation();
            
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка при сохранении образа');
        }
    }

    createSaveAnimation() {
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                saveBtn.style.animation = '';
            }, 500);
        }
        
        // Анимация снега при сохранении
        this.createSnowAnimation();
        
        alert('Образ сохранен! ✨');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BarbieDressUpGame();
});
