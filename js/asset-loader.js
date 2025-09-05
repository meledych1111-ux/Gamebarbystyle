class AssetLoader {
    constructor() {
        this.assets = {
            dolls: {},
            clothes: {},
            wardrobeConfig: null
        };
    }

    async loadAssets() {
        try {
            // Загружаем конфигурацию гардероба
            await this.loadWardrobeConfig();
            
            // Предзагружаем изображения кукол
            await this.preloadDolls();
            
            // Предзагружаем изображения одежды
            await this.preloadClothes();
            
            console.log('All assets loaded successfully');
            
        } catch (error) {
            console.error('Error loading assets:', error);
            // Создаем заглушки для демонстрации
            this.createFallbackAssets();
        }
    }

    async loadWardrobeConfig() {
        try {
            const response = await fetch('assets/config/wardrobe.json');
            this.assets.wardrobeConfig = await response.json();
        } catch (error) {
            console.warn('Failed to load wardrobe config, using fallback');
            this.assets.wardrobeConfig = this.createFallbackConfig();
        }
    }

    async preloadDolls() {
        if (!this.assets.wardrobeConfig?.dolls) return;

        for (const doll of this.assets.wardrobeConfig.dolls) {
            this.assets.dolls[doll.id] = doll;
        }
    }

    async preloadClothes() {
        if (!this.assets.wardrobeConfig?.categories) return;

        for (const [category, items] of Object.entries(this.assets.wardrobeConfig.categories)) {
            for (const item of items) {
                this.assets.clothes[item.id] = item;
            }
        }
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

    createFallbackConfig() {
        return {
            categories: {
                dresses: [
                    {
                        id: "dress-pink",
                        name: "Розовое платье",
                        image: this.createDummyImage(200, 300, '#ffb6c1'),
                        thumbnail: this.createDummyImage(80, 80, '#ffb6c1'),
                        layer: "over"
                    }
                ],
                tops: [
                    {
                        id: "top-white",
                        name: "Белая блузка",
                        image: this.createDummyImage(150, 200, '#ffffff'),
                        thumbnail: this.createDummyImage(80, 80, '#ffffff'),
                        layer: "middle"
                    }
                ],
                pants: [
                    {
                        id: "pants-jeans",
                        name: "Джинсы",
                        image: this.createDummyImage(150, 250, '#1e90ff'),
                        thumbnail: this.createDummyImage(80, 80, '#1e90ff'),
                        layer: "under"
                    }
                ],
                shoes: [
                    {
                        id: "shoes-heels",
                        name: "Туфли",
                        image: this.createDummyImage(100, 80, '#8b4513'),
                        thumbnail: this.createDummyImage(80, 80, '#8b4513'),
                        layer: "shoes"
                    }
                ],
                accessories: [
                    {
                        id: "necklace",
                        name: "Ожерелье",
                        image: this.createDummyImage(80, 40, '#ffd700'),
                        thumbnail: this.createDummyImage(80, 80, '#ffd700'),
                        layer: "accessories"
                    }
                ]
            },
            dolls: [
                {
                    id: "barbie-base",
                    name: "Барби",
                    image: this.createDollSilhouette(),
                    defaultHairColor: "#ffd700",
                    defaultEyesColor: "#00aaff"
                }
            ]
        };
    }

    createFallbackAssets() {
        this.assets.wardrobeConfig = this.createFallbackConfig();
        
        // Добавляем куклу
        this.assets.dolls['barbie-base'] = {
            id: "barbie-base",
            name: "Барби",
            image: this.createDollSilhouette(),
            defaultHairColor: "#ffd700",
            defaultEyesColor: "#00aaff"
        };

        // Добавляем базовую одежду
        const categories = ['dresses', 'tops', 'pants', 'shoes', 'accessories'];
        const colors = ['#ffb6c1', '#ffffff', '#1e90ff', '#8b4513', '#ffd700'];
        const names = ['Платье', 'Топ', 'Брюки', 'Обувь', 'Аксессуар'];

        categories.forEach((category, index) => {
            const itemId = `${category}-fallback`;
            this.assets.clothes[itemId] = {
                id: itemId,
                name: names[index],
                image: this.createDummyImage(200, 300, colors[index]),
                thumbnail: this.createDummyImage(80, 80, colors[index]),
                layer: category
            };
        });
    }

    createDummyImage(width, height, color) {
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
}

// Создаем глобальный экземпляр загрузчика ассетов
const assetLoader = new AssetLoader();
