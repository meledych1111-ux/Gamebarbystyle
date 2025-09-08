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
                    const itemId = clothingItem.dataset.itemId;
                    const category = clothingItem.dataset.category;
                    this.toggleClothing(itemId, category);
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

    setDoll(dollId) {
        if (assetLoader && assetLoader.getDoll) {
            this.currentDoll = assetLoader.getDoll(dollId);
            this.render();
        }
    }

    toggleClothing(itemId, category) {
        if (assetLoader && assetLoader.getClothing) {
            const clothing = assetLoader.getClothing(itemId, category);
            
            if (!clothing) return;
            
            // Если нажали на уже выбранный предмет - снимаем его
            if (this.currentClothes[category] && this.currentClothes[category].id === itemId) {
                this.currentClothes[category] = null;
            } else {
                // Иначе надеваем новый предмет (старый автоматически снимается)
                this.currentClothes[category] = clothing;
            }
            
            this.render();
            this.updateClothingSelectionUI(itemId, category);
        }
    }

    // Обновление визуального выделения выбранной одежды
    updateClothingSelectionUI(itemId, category) {
        // Убираем выделение со всех предметов в этой категории
        document.querySelectorAll(`.clothing-item[data-category="${category}"]`).forEach(item => {
            item.classList.remove('selected');
        });
        
        // Добавляем выделение текущему предмету, если он выбран
        if (this.currentClothes[category] && this.currentClothes[category].id === itemId) {
            const selectedItem = document.querySelector(`.clothing-item[data-item-id="${itemId}"][data-category="${category}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
        }
    }

    selectClothing(itemId, category) {
        if (assetLoader && assetLoader.getClothing) {
            const clothing = assetLoader.getClothing(itemId, category);
            if (clothing) {
                this.currentClothes[category] = clothing;
                this.render();
                this.updateClothingSelectionUI(itemId, category);
            }
        }
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
        this.currentClothes = {
            dresses: null,
            tops: null,
            pants: null,
            shoes: null,
            accessories: null
        };
        
        // Снимаем выделение со всей одежды
        document.querySelectorAll('.clothing-item').forEach(item => {
            item.classList.remove('selected');
        });
        
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
        
        alert('Образ сохранен! ✨');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BarbieDressUpGame();
});
