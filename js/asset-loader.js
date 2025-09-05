static async preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            // Проверяем, не загружено ли уже изображение
            if (this.imageCache && this.imageCache[url]) {
                resolve(url);
                return;
            }
            
            const img = new Image();
            img.src = url;
            img.onload = () => {
                // Кэшируем загруженное изображение
                if (!this.imageCache) this.imageCache = {};
                this.imageCache[url] = img;
                resolve(url);
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${url}`);
                resolve(null); // Не прерываем цепочку Promise.all
            };
        });
    });
    
    return Promise.all(promises);
}
