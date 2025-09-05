class WardrobeManager {
    constructor() {
        this.currentOutfit = {};
        this.wardrobe = {};
        this.canvasRenderer = new CanvasRenderer();
        this.colorPicker = new ColorPicker();
        this.currentDoll = 'assets/dolls/barbie-base.png';
        this.dolls = ['assets/dolls/barbie-base.png', 'assets/dolls/barbie-skin2.png'];
    }

    async init() {
        this.wardrobe = await AssetLoader.loadWardrobeConfig();
        await this.preloadClothes();
        this.canvasRenderer.setDoll(this.currentDoll);
        this.canvasRenderer.setupTouchEvents();
        this.renderCategories();
    }

    // ... остальные методы без изменений до equipItem ...

    equipItem(category, item) {
        // Если предмет уже надет, показываем пикер цвета
        if (this.currentOutfit[category]) {
            const currentColor = this.currentOutfit[category].color || null;
            this.colorPicker.show(category, currentColor, (cat, color) => {
                this.updateItemColor(cat, color);
            });
            return;
        }
        
        // Добавляем новый предмет
        item.category = category; // Добавляем категорию для идентификации
        const layer = this.canvasRenderer.addLayer(item);
        
        this.currentOutfit[category] = {
            item: item,
            color: null,
            layer: layer
        };
    }

    updateItemColor(category, color) {
        if (this.currentOutfit[category]) {
            this.currentOutfit[category].color = color;
            this.canvasRenderer.updateLayerColor(category, color);
        }
    }

    changeDoll() {
        const currentIndex = this.dolls.indexOf(this.currentDoll);
        this.currentDoll = this.dolls[(currentIndex + 1) % this.dolls.length];
        this.canvasRenderer.setDoll(this.currentDoll);
    }

    saveOutfit() {
        const outfitData = this.canvasRenderer.getOutfitData();
        localStorage.setItem('savedOutfit', JSON.stringify(outfitData));
        alert('Outfit saved!');
    }

    loadOutfit() {
        const outfitData = localStorage.getItem('savedOutfit');
        if (outfitData) {
            this.canvasRenderer.loadOutfitData(JSON.parse(outfitData));
            
            // Обновляем currentOutfit
            this.currentOutfit = {};
            const data = JSON.parse(outfitData);
            data.layers.forEach(layer => {
                this.currentOutfit[layer.item.category] = {
                    item: layer.item,
                    color: layer.color
                };
            });
        }
    }

    resetOutfit() {
        this.currentOutfit = {};
        this.canvasRenderer.layers = [];
        this.canvasRenderer.render();
    }
}
