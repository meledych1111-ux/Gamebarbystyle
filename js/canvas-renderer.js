class CanvasRenderer {
    // ... остальной код без изменений ...

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
                
                if (layer.color && layer.item.colorable !== false) {
                    this.applyColorToImage(layer.image, layer.color, layer.item.templateType || 'white');
                } else {
                    // Рисуем без изменения цвета
                    this.ctx.drawImage(layer.image, 0, 0, this.canvas.width, this.canvas.height);
                }
                
                this.ctx.restore();
            }
        });
    }

    applyColorToImage(image, color, templateType = 'white') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Рисуем исходное изображение
        tempCtx.drawImage(image, 0, 0);
        
        switch (templateType) {
            case 'white':
                // Стандартный метод для белых шаблонов
                tempCtx.globalCompositeOperation = 'source-in';
                tempCtx.fillStyle = color;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                break;
                
            case 'grayscale':
                // Для градаций серого - более сложное окрашивание
                const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imageData.data;
                const colorRGB = this.hexToRgb(color);
                
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = data[i] / 255; // Используем красный канал как яркость
                    
                    if (data[i + 3] > 0) { // Если пиксель не прозрачный
                        data[i] = colorRGB.r * brightness;     // R
                        data[i + 1] = colorRGB.g * brightness; // G
                        data[i + 2] = colorRGB.b * brightness; // B
                    }
                }
                
                tempCtx.putImageData(imageData, 0, 0);
                break;
                
            case 'multicolor':
                // Для многоцветных шаблонов (продвинутый вариант)
                this.applyMulticolorEffect(tempCtx, color, tempCanvas.width, tempCanvas.height);
                break;
        }
        
        // Рисуем на основном canvas
        this.ctx.drawImage(tempCanvas, 0, 0, this.canvas.width, this.canvas.height);
    }

    hexToRgb(hex) {
        // Конвертируем hex в RGB
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    applyMulticolorEffect(ctx, baseColor, width, height) {
        // Продвинутое многоцветное окрашивание
        // Здесь можно реализовать сложные эффекты
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const baseRGB = this.hexToRgb(baseColor);
        
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) {
                // Пример: разные области окрашиваются по-разному
                // на основе исходного цвета пикселя
                const originalR = data[i];
                const originalG = data[i + 1];
                const originalB = data[i + 2];
                
                if (originalR > 200 && originalG < 100 && originalB < 100) {
                    // Красные области становятся основным цветом
                    data[i] = baseRGB.r;
                    data[i + 1] = baseRGB.g;
                    data[i + 2] = baseRGB.b;
                } else if (originalR < 100 && originalG > 200 && originalB < 100) {
                    // Зеленые области становятся более светлым оттенком
                    data[i] = Math.min(255, baseRGB.r + 50);
                    data[i + 1] = Math.min(255, baseRGB.g + 50);
                    data[i + 2] = Math.min(255, baseRGB.b + 50);
                }
                // И так далее для других цветов...
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}
