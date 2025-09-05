class CanvasRenderer {
    constructor() {
        this.canvas = document.getElementById('barbie-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dollImage = null;
        this.layers = [];
        this.currentDoll = null;
    }

    setDoll(imageUrl) {
        this.currentDoll = imageUrl;
        this.dollImage = new Image();
        this.dollImage.src = imageUrl;
        this.dollImage.onload = () => this.render();
    }

    addLayer(item, color = null) {
        const layer = {
            image: new Image(),
            item: {...item},
            color: color
        };
        
        layer.image.src = item.image;
        layer.image.onload = () => this.render();
        this.layers.push(layer);
        this.render();
        
        return layer;
    }

    removeLayer(category) {
        this.layers = this.layers.filter(layer => layer.item.category !== category);
        this.render();
    }

    updateLayerColor(category, color) {
        const layer = this.layers.find(l => l.item.category === category);
        if (layer) {
            layer.color = color;
            this.render();
        }
    }

    render() {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем куклу
        if (this.dollImage) {
            this.ctx.drawImage(this.dollImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Рисуем слои одежды
        this.layers.forEach(layer => {
            if (layer.image.complete) {
                this.ctx.save();
                
                if (layer.color) {
                    // Создаем временный canvas для окрашивания
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = layer.image.width;
                    tempCanvas.height = layer.image.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    // Рисуем изображение на временном canvas
                    tempCtx.drawImage(layer.image, 0, 0);
                    
                    // Применяем цветовой эффект
                    tempCtx.globalCompositeOperation = 'source-in';
                    tempCtx.fillStyle = layer.color;
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    
                    // Рисуем на основном canvas
                    this.ctx.drawImage(tempCanvas, 0, 0, this.canvas.width, this.canvas.height);
                } else {
                    // Рисуем без изменения цвета
                    this.ctx.drawImage(layer.image, 0, 0, this.canvas.width, this.canvas.height);
                }
                
                this.ctx.restore();
            }
        });
    }

    getOutfitData() {
        return {
            doll: this.currentDoll,
            layers: this.layers.map(layer => ({
                item: layer.item,
                color: layer.color
            }))
        };
    }

    loadOutfitData(outfitData) {
        this.setDoll(outfitData.doll);
        this.layers = [];
        
        outfitData.layers.forEach(layerData => {
            const layer = this.addLayer(layerData.item, layerData.color);
        });
    }

    // Для мобильных устройств - масштабирование
    setupTouchEvents() {
        let scale = 1;
        let lastDist = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                lastDist = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDist = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                
                if (lastDist > 0) {
                    scale = Math.max(0.5, Math.min(2, scale * (currentDist / lastDist)));
                    this.canvas.style.transform = `scale(${scale})`;
                }
                
                lastDist = currentDist;
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            lastDist = 0;
        });
    }
}
