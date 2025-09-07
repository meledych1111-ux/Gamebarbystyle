class CanvasRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.dollImage = new Image();
        this.clothesImages = new Map();
        this.isRendering = false;
    }

    init() {
        this.canvas = document.getElementById('dollCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context!');
            return;
        }
        
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Устанавливаем размеры canvas
        this.canvas.width = 300;
        this.canvas.height = 500;
        
        // Очищаем canvas при инициализации
        this.clear();
    }

    async render(doll, clothes, hairColor, eyesColor) {
        if (!this.ctx || this.isRendering) return;
        
        this.isRendering = true;
        
        try {
            // Очищаем canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Рисуем базовое изображение куклы
            await this.drawDoll(doll);

            // Рисуем одежду в правильном порядке
            await this.drawClothes(clothes);

            // Применяем цвета
            this.applyColors(hairColor, eyesColor);
            
        } catch (error) {
            console.error('Error rendering:', error);
            // Показываем placeholder при ошибке
            this.drawErrorPlaceholder();
        } finally {
            this.isRendering = false;
        }
    }

    async drawDoll(doll) {
        return new Promise((resolve, reject) => {
            if (!doll || !doll.image) {
                reject(new Error('Invalid doll object'));
                return;
            }

            if (this.dollImage.src !== doll.image) {
                this.dollImage.onload = () => {
                    this.ctx.drawImage(this.dollImage, 0, 0, this.canvas.width, this.canvas.height);
                    resolve();
                };
                this.dollImage.onerror = () => {
                    reject(new Error('Failed to load doll image'));
                };
                this.dollImage.src = doll.image;
            } else {
                this.ctx.drawImage(this.dollImage, 0, 0, this.canvas.width, this.canvas.height);
                resolve();
            }
        });
    }

    async drawClothes(clothes) {
        const drawOrder = ['pants', 'dresses', 'tops', 'shoes', 'accessories'];
        
        for (const category of drawOrder) {
            const clothing = clothes[category];
            if (clothing) {
                await this.drawClothingItem(clothing);
            }
        }
    }

    async drawClothingItem(clothing) {
        return new Promise((resolve, reject) => {
            if (!clothing || !clothing.image) {
                resolve(); // Пропускаем если одежда невалидна
                return;
            }

            let image = this.clothesImages.get(clothing.id);
            
            if (!image) {
                image = new Image();
                image.onload = () => {
                    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
                    this.clothesImages.set(clothing.id, image);
                    resolve();
                };
                image.onerror = () => {
                    console.warn('Failed to load clothing image:', clothing.id);
                    resolve(); // Продолжаем рендер даже если одна вещь не загрузилась
                };
                image.src = clothing.image;
            } else {
                this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
                resolve();
            }
        });
    }

    drawErrorPlaceholder() {
        this.ctx.fillStyle = '#ffe6f2';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Ошибка загрузки', this.canvas.width / 2, this.canvas.height / 2);
    }

    applyColors(hairColor, eyesColor) {
        try {
            // Создаем временный canvas для обработки цветов
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;

            // Копируем текущее изображение
            tempCtx.drawImage(this.canvas, 0, 0);

            // Получаем данные изображения
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            // Применяем цветовые фильтры
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Области для окрашивания волос (золотистые оттенки)
                if (this.isHairColor(r, g, b)) {
                    this.applyColor(data, i, hairColor);
                }
                
                // Области для окрашивания глаз (голубые оттенки)
                if (this.isEyesColor(r, g, b)) {
                    this.applyColor(data, i, eyesColor);
                }
            }

            // Возвращаем обработанное изображение
            this.ctx.putImageData(imageData, 0, 0);
        } catch (error) {
            console.error('Error applying colors:', error);
        }
    }

    isHairColor(r, g, b) {
        // Определяем золотистые оттенки (цвет волос по умолчанию)
        return r > 200 && g > 150 && b < 100 && Math.abs(r - g) < 50;
    }

    isEyesColor(r, g, b) {
        // Определяем голубые оттенки (цвет глаз по умолчанию)
        return b > 150 && r < 100 && g > 100;
    }

    applyColor(data, index, targetColor) {
        try {
            const hex = targetColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);

            // Сохраняем альфа-канал
            const alpha = data[index + 3];
            
            // Применяем новый цвет с сохранением яркости оригинального пикселя
            const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
            const targetBrightness = (r + g + b) / 3;
            const ratio = brightness / Math.max(targetBrightness, 1);

            data[index] = Math.min(255, r * ratio);
            data[index + 1] = Math.min(255, g * ratio);
            data[index + 2] = Math.min(255, b * ratio);
            data[index + 3] = alpha;
        } catch (error) {
            console.error('Error applying color:', error);
        }
    }

    clear() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // Метод для получения данных canvas (для сохранения)
    getImageData() {
        if (!this.canvas) return null;
        return this.canvas.toDataURL('image/png');
    }
}

// Создаем экземпляр рендерера
const canvasRenderer = new CanvasRenderer();
