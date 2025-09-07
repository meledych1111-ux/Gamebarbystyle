class AssetLoader {
    constructor() {
        this.assets = {
            dolls: {},
            clothes: {},
            wardrobeConfig: null
        };
    }

    async loadAssets() {
        console.log('Loading assets...');
        
        try {
            // Пробуем загрузить конфиг
            await this.loadWardrobeConfig();
            console.log('Config loaded successfully');
            
        } catch (error) {
            console.warn('Failed to load config, using fallback:', error);
            // Создаем fallback ассеты
            this.createFallbackAssets();
        }
        
        // Всегда создаем fallback на случай ошибок
        this.ensureFallbackAssets();
        
        console.log('Assets ready:', {
            dolls: Object.keys(this.assets.dolls),
            clothes: Object.keys(this.assets.clothes)
        });
    }

    async loadWardrobeConfig() {
        try {
            const response = await fetch('assets/config/wardrobe.json');
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            
            this.assets.wardrobeConfig = await response.json();
            this.processConfig();
            
        } catch (error) {
            throw new Error('Config load failed: ' + error.message);
        }
    }

    processConfig() {
        if (!this.assets.wardrobeConfig) return;
        
        // Загружаем кукол
        if (this.assets.wardrobeConfig.dolls) {
            this.assets.wardrobeConfig.dolls.forEach(doll => {
                this.assets.dolls[doll.id] = doll;
            });
        }
        
        // Загружаем одежду
        if (this.assets.wardrobeConfig.categories) {
            Object.values(this.assets.wardrobeConfig.categories).forEach(items => {
                items.forEach(item => {
                    this.assets.clothes[item.id] = item;
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
        console.log('Creating fallback assets...');
        
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
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(5, 5, width - 10, height - 10);
        
        return canvas.toDataURL();
    }

    createDollSilhouette() {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // Фон
        ctx.fillStyle = '#ffe6f2';
        ctx.fillRect(0, 0, 300, 500);
        
        // Силуэт куклы
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        
        // Голова
        ctx.arc(150, 100, 40, 0, Math.PI * 2);
        
        // Тело
        ctx.moveTo(130, 140);
        ctx.lineTo(130, 250);
        ctx.lineTo(170, 250);
        ctx.lineTo(170, 140);
        ctx.closePath();
        
        // Ноги
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
    }

    getWardrobeConfig() {
        return this.assets.wardrobeConfig;
    }

    getDoll(dollId) {
        return this.assets.dolls[dollId] || this.assets.dolls['barbie-base'];
    }

    getClothing(itemId, category) {
        return this.assets.clothes[itemId];
    }

    getAllClothesByCategory(category) {
        if (!this.assets.wardrobeConfig?.categories?.[category]) return [];
        return this.assets.wardrobeConfig.categories[category];
    }
}

// Создаем глобальный экземпляр загрузчика ассетов
const assetLoader = new AssetLoader();
