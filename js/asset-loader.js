class AssetLoader {
    constructor() {
        this.assets = {
            dolls: {},
            clothes: {},
            wardrobeConfig: null
        };
    }

    async loadAssets() {
        console.log('🔄 Загрузка ассетов...');
        
        try {
            // Пробуем загрузить конфиг
            await this.loadWardrobeConfig();
            console.log('✅ Конфиг успешно загружен');
            
        } catch (error) {
            console.warn('⚠️ Ошибка загрузки конфига, использую fallback:', error);
            // Создаем fallback ассеты
            this.createFallbackAssets();
        }
        
        // Всегда создаем fallback на случай ошибок
        this.ensureFallbackAssets();
        
        console.log('🎉 Ассеты готовы:', {
            куклы: Object.keys(this.assets.dolls),
            одежда: Object.keys(this.assets.clothes)
        });
        
        return true;
    }

    async loadWardrobeConfig() {
        try {
            const response = await fetch('assets/config/wardrobe.json');
            if (!response.ok) {
                throw new Error(`HTTP ошибка ${response.status}`);
            }
            
            this.assets.wardrobeConfig = await response.json();
            this.processConfig();
            
        } catch (error) {
            throw new Error(`Ошибка загрузки конфига: ${error.message}`);
        }
    }

    processConfig() {
        if (!this.assets.wardrobeConfig) return;
        
        // Загружаем кукол
        if (this.assets.wardrobeConfig.dolls) {
            this.assets.wardrobeConfig.dolls.forEach(doll => {
                if (doll.id && doll.image) {
                    this.assets.dolls[doll.id] = doll;
                }
            });
        }
        
        // Загружаем одежду
        if (this.assets.wardrobeConfig.categories) {
            Object.values(this.assets.wardrobeConfig.categories).forEach(items => {
                items.forEach(item => {
                    if (item.id) {
                        this.assets.clothes[item.id] = item;
                    }
                });
            });
        }
    }

    ensureFallbackAssets() {
        // Гарантируем что хотя бы одна кукла есть
        if (Object.keys(this.assets.dolls).length === 0) {
            this.assets.dolls['barbie-base'] = this.createFallbackDoll();
        }
        
        // Гарантируем что есть хотя бы один предмет одежды
        if (Object.keys(this.assets.clothes).length === 0) {
            this.assets.clothes['dress-fallback'] = this.createFallbackDress();
        }
    }

    createFallbackAssets() {
        console.log('🛠️ Создаю fallback ассеты...');
        
        this.assets.wardrobeConfig = {
            categories: {
                dresses: [this.createFallbackDress()],
                tops: [this.createFallbackTop()],
                pants: [this.createFallbackPants()],
                shoes: [this.createFallbackShoes()],
                accessories: [this.createFallbackAccessory()]
            },
            dolls: [this.createFallbackDoll()]
        };
        
        this.processConfig();
    }

    createFallbackDoll() {
        return {
            id: "barbie-base",
            name: "Барби",
            image: this.createDollSilhouette(),
            defaultHairColor: "#ffd700",
            defaultEyesColor: "#00aaff"
        };
    }

    createFallbackDress() {
        return {
            id: "dress-fallback",
            name: "Розовое платье",
            image: this.createClothingPlaceholder('#ff69b4', 300, 500),
            thumbnail: this.createClothingPlaceholder('#ff69b4', 80, 80),
            layer: "over"
        };
    }

    createFallbackTop() {
        return {
            id: "top-fallback", 
            name: "Белый топ",
            image: this.createClothingPlaceholder('#ffffff', 200, 300),
            thumbnail: this.createClothingPlaceholder('#ffffff', 80, 80),
            layer: "middle"
        };
    }

    createFallbackPants() {
        return {
            id: "pants-fallback",
            name: "Джинсы",
            image: this.createClothingPlaceholder('#1e90ff', 200, 400),
            thumbnail: this.createClothingPlaceholder('#1e90ff', 80, 80),
            layer: "under"
        };
    }

    createFallbackShoes() {
        return {
            id: "shoes-fallback",
            name: "Туфли",
            image: this.createClothingPlaceholder('#8b4513', 150, 100),
            thumbnail: this.createClothingPlaceholder('#8b4513', 80, 80),
            layer: "shoes"
        };
    }

    createFallbackAccessory() {
        return {
            id: "accessory-fallback",
            name: "Аксессуар",
            image: this.createClothingPlaceholder('#ffd700', 100, 100),
            thumbnail: this.createClothingPlaceholder('#ffd700', 80, 80),
            layer: "accessories"
        };
    }

    createClothingPlaceholder(color, width, height) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // Фон
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);
            
            // Рамка
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(5, 5, width - 10, height - 10);
            
            // Текст
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${width}x${height}`, width / 2, height / 2);
            
            return canvas.toDataURL();
        } catch (error) {
            console.error('Ошибка создания placeholder:', error);
            return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ff69b4"/></svg>';
        }
    }

    createDollSilhouette() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            
            // Фон
            ctx.fillStyle = '#ffe6f2';
            ctx.fillRect(0, 0, 300, 500);
            
            // Силуэт куклы
            ctx.fillStyle = '#ffb6c1';
            
            // Голова
            ctx.beginPath();
            ctx.arc(150, 100, 40, 0, Math.PI * 2);
            ctx.fill();
            
            // Тело
            ctx.beginPath();
            ctx.moveTo(130, 140);
            ctx.lineTo(130, 250);
            ctx.lineTo(170, 250);
            ctx.lineTo(170, 140);
            ctx.closePath();
            ctx.fill();
            
            // Ноги
            ctx.beginPath();
            ctx.moveTo(130, 250);
            ctx.lineTo(120, 350);
            ctx.lineTo(140, 350);
            ctx.lineTo(150, 250);
            
            ctx.moveTo(170, 250);
            ctx.lineTo(160, 350);
            ctx.lineTo(180, 350);
            ctx.lineTo(190, 250);
            ctx.fill();
            
            // Волосы
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(150, 80, 50, Math.PI, Math.PI * 2);
            ctx.fill();
            
            // Глаза
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(135, 95, 8, 0, Math.PI * 2);
            ctx.arc(165, 95, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Улыбка
            ctx.strokeStyle = '#ff69b4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(150, 115, 15, 0.2, Math.PI - 0.2);
            ctx.stroke();
            
            // Текст
            ctx.fillStyle = '#ff69b4';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Барби', 150, 400);
            
            return canvas.toDataURL();
        } catch (error) {
            console.error('Ошибка создания силуэта куклы:', error);
            return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500"><rect width="300" height="500" fill="%23ffe6f2"/><text x="150" y="250" font-family="Arial" font-size="20" text-anchor="middle" fill="%23ff69b4">Барби</text></svg>';
        }
    }

    getWardrobeConfig() {
        return this.assets.wardrobeConfig;
    }

    getDoll(dollId) {
        return this.assets.dolls[dollId] || this.assets.dolls['barbie-base'] || null;
    }

    getClothing(itemId, category) {
        return this.assets.clothes[itemId] || null;
    }

    getAllClothesByCategory(category) {
        if (!this.assets.wardrobeConfig?.categories?.[category]) {
            return [];
        }
        return this.assets.wardrobeConfig.categories[category];
    }

    // Новый метод: проверка загрузки изображений
    async preloadImages() {
        const imagesToPreload = [];
        
        // Презагрузка кукол
        Object.values(this.assets.dolls).forEach(doll => {
            if (doll.image) {
                imagesToPreload.push(this.preloadImage(doll.image));
            }
        });
        
        // Презагрузка одежды
        Object.values(this.assets.clothes).forEach(clothing => {
            if (clothing.image) {
                imagesToPreload.push(this.preloadImage(clothing.image));
            }
            if (clothing.thumbnail) {
                imagesToPreload.push(this.preloadImage(clothing.thumbnail));
            }
        });
        
        try {
            await Promise.all(imagesToPreload);
            console.log('✅ Все изображения презагружены');
        } catch (error) {
            console.warn('⚠️ Некоторые изображения не загрузились:', error);
        }
    }

    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Не удалось загрузить: ${src}`));
            img.src = src;
        });
    }

    // Метод для проверки существования файлов
    async validateAssets() {
        const missingFiles = [];
        
        // Проверка кукол
        for (const doll of Object.values(this.assets.dolls)) {
            if (doll.image && !await this.fileExists(doll.image)) {
                missingFiles.push(doll.image);
            }
        }
        
        // Проверка одежды
        for (const clothing of Object.values(this.assets.clothes)) {
            if (clothing.image && !await this.fileExists(clothing.image)) {
                missingFiles.push(clothing.image);
            }
            if (clothing.thumbnail && !await this.fileExists(clothing.thumbnail)) {
                missingFiles.push(clothing.thumbnail);
            }
        }
        
        if (missingFiles.length > 0) {
            console.warn('⚠️ Отсутствующие файлы:', missingFiles);
            return false;
        }
        
        console.log('✅ Все файлы на месте');
        return true;
    }

    async fileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Создаем глобальный экземпляр загрузчика ассетов
const assetLoader = new AssetLoader();
