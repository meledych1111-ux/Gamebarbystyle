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

    async render(doll, clothes) {
        if (!this.ctx || this.isRendering) return;
        
        this.isRendering = true;
        
        try {
            // Очищаем canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Рисуем базовое изображение куклы
            await this.drawDoll(doll);

            // Рисуем одежду в правильном порядке
            await this.drawClothes(clothes);
            
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
                resolve();
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
                    resolve();
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

    clear() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    getImageData() {
        if (!this.canvas) return null;
        return this.canvas.toDataURL('image/png');
    }
}

// Создаем экземпляр рендерера
const canvasRenderer = new CanvasRenderer();
async drawDoll(doll) {
    return new Promise((resolve) => {
        if (!doll || !doll.image) {
            console.error('Нет данных куклы');
            this.drawErrorPlaceholder();
            resolve();
            return;
        }

        if (this.dollImage.src !== doll.image) {
            this.dollImage.onload = () => {
                this.ctx.drawImage(this.dollImage, 0, 0, this.canvas.width, this.canvas.height);
                resolve();
            };
            this.dollImage.onerror = () => {
                console.error('Не удалось загрузить изображение куклы');
                this.drawErrorPlaceholder();
                resolve();
            };
            this.dollImage.src = doll.image;
        } else {
            this.ctx.drawImage(this.dollImage, 0, 0, this.canvas.width, this.canvas.height);
            resolve();
        }
    });
}
