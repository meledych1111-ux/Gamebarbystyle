document.addEventListener('DOMContentLoaded', function() {
    // Создаем глиттер-эффект
    createGlitter();
    
    // Текущий выбранный цвет
    let currentColor = '#ff9dc9';
    let currentTexture = null;
    let currentGlitter = null;
    let savedOutfits = [];
    let outfitCounter = 1;
    
    // Данные об элементах с реалистичными изображениями
    const itemsData = {
        hair: [
            { id: 'hair1', name: 'Длинные прямые', image: 'https://i.ibb.co/0Qq3y0C/long-straight-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair2', name: 'Волнистые', image: 'https://i.ibb.co/0Qq3y0C/wavy-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair3', name: 'Кудрявые', image: 'https://i.ibb.co/0Qq3y0C/curly-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair4', name: 'Хвост', image: 'https://i.ibb.co/0Qq3y0C/ponytail-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair5', name: 'Пучок', image: 'https://i.ibb.co/0Qq3y0C/bun-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair6', name: 'Косички', image: 'https://i.ibb.co/0Qq3y0C/braids-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair7', name: 'Каре', image: 'https://i.ibb.co/0Qq3y0C/bob-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair8', name: 'Асимметрия', image: 'https://i.ibb.co/0Qq3y0C/asymmetric-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair9', name: 'С челкой', image: 'https://i.ibb.co/0Qq3y0C/bangs-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'hair10', name: 'Прическа с цветами', image: 'https://i.ibb.co/0Qq3y0C/flower-hair.png', position: { top: '0', left: '0', width: '100%', height: '100%' } }
        ],
        makeup: [
            { id: 'makeup1', name: 'Дневной макияж', image: 'https://i.ibb.co/0Qq3y0C/day-makeup.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup2', name: 'Вечерний макияж', image: 'https://i.ibb.co/0Qq3y0C/evening-makeup.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup3', name: 'Яркие тени', image: 'https://i.ibb.co/0Qq3y0C/bright-makeup.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup4', name: 'Красная помада', image: 'https://i.ibb.co/0Qq3y0C/red-lips.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup5', name: 'Розовая помада', image: 'https://i.ibb.co/0Qq3y0C/pink-lips.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup6', name: 'Блеск для губ', image: 'https://i.ibb.co/0Qq3y0C/gloss-lips.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup7', name: 'Румяна', image: 'https://i.ibb.co/0Qq3y0C/blush.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup8', name: 'Стрелки', image: 'https://i.ibb.co/0Qq3y0C/eyeliner.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup9', name: 'Нюд макияж', image: 'https://i.ibb.co/0Qq3y0C/nude-makeup.png', position: { top: '0', left: '0', width: '100%', height: '100%' } },
            { id: 'makeup10', name: 'Блестящий макияж', image: 'https://i.ibb.co/0Qq3y0C/glitter-makeup.png', position: { top: '0', left: '0', width: '100%', height: '100%' } }
        ],
        dresses: [
            { id: 'minidress', name: 'Мини платье', image: 'https://i.ibb.co/0Qq3y0C/mini-dress.png', position: { top: '20%', left: '10%', width: '80%', height: '30%' } },
            { id: 'mididress', name: 'Миди платье', image: 'https://i.ibb.co/0Qq3y0C/midi-dress.png', position: { top: '20%', left: '10%', width: '80%', height: '35%' } },
            { id: 'maxidress', name: 'Макси платье', image: 'https://i.ibb.co/0Qq3y0C/maxi-dress.png', position: { top: '20%', left: '10%', width: '80%', height: '40%' } },
            { id: 'balldress', name: 'Бальное платье', image: 'https://i.ibb.co/0Qq3y0C/ball-dress.png', position: { top: '20%', left: '5%', width: '90%', height: '45%' } },
            { id: 'weddingdress', name: 'Свадебное платье', image: 'https://i.ibb.co/0Qq3y0C/wedding-dress.png', position: { top: '20%', left: '5%', width: '90%', height: '50%' } }
        ],
        tops: [
            { id: 'sweatshirt', name: 'Свитшот', image: 'https://i.ibb.co/0Qq3y0C/sweatshirt.png', position: { top: '20%', left: '15%', width: '70%', height: '25%' } },
            { id: 'swimsuit', name: 'Купальник', image: 'https://i.ibb.co/0Qq3y0C/swimsuit.png', position: { top: '20%', left: '15%', width: '70%', height: '20%' } },
            { id: 'top1', name: 'Розовый топ', image: 'https://i.ibb.co/0Qq3y0C/pink-top.png', position: { top: '20%', left: '15%', width: '70%', height: '20%' } },
            { id: 'top2', name: 'Фиолетовый топ', image: 'https://i.ibb.co/0Qq3y0C/purple-top.png', position: { top: '20%', left: '15%', width: '70%', height: '20%' } }
        ],
        bottoms: [
            { id: 'shortshorts', name: 'Короткие шорты', image: 'https://i.ibb.co/0Qq3y0C/short-shorts.png', position: { top: '45%', left: '15%', width: '70%', height: '15%' } },
            { id: 'kneeshorts', name: 'Шорты до колена', image: 'https://i.ibb.co/0Qq3y0C/knee-shorts.png', position: { top: '45%', left: '15%', width: '70%', height: '20%' } },
            { id: 'maxiskirt', name: 'Юбка макси', image: 'https://i.ibb.co/0Qq3y0C/maxi-skirt.png', position: { top: '45%', left: '15%', width: '70%', height: '35%' } },
            { id: 'jeans1', name: 'Скинни джинсы', image: 'https://i.ibb.co/0Qq3y0C/skinny-jeans.png', position: { top: '45%', left: '15%', width: '70%', height: '30%' } },
            { id: 'jeans2', name: 'Прямые джинсы', image: 'https://i.ibb.co/0Qq3y0C/straight-jeans.png', position: { top: '45%', left: '15%', width: '70%', height: '30%' } }
        ],
        shoes: [
            { id: 'heels', name: 'Каблуки', image: 'https://i.ibb.co/0Qq3y0C/heels.png', position: { top: '75%', left: '20%', width: '60%', height: '10%' } },
            { id: 'sandals', name: 'Босоножки', image: 'https://i.ibb.co/0Qq3y0C/sandals.png', position: { top: '75%', left: '20%', width: '60%', height: '10%' } },
            { id: 'boots', name: 'Сапоги', image: 'https://i.ibb.co/0Qq3y0C/boots.png', position: { top: '70%', left: '20%', width: '60%', height: '15%' } },
            { id: 'sneakers', name: 'Кроссовки', image: 'https://i.ibb.co/0Qq3y0C/sneakers.png', position: { top: '75%', left: '20%', width: '60%', height: '10%' } }
        ],
        accessories: [
            { id: 'earrings', name: 'Серьги', image: 'https://i.ibb.co/0Qq3y0C/earrings.png', position: { top: '15%', left: '40%', width: '20%', height: '5%' } },
            { id: 'necklace', name: 'Ожерелье', image: 'https://i.ibb.co/0Qq3y0C/necklace.png', position: { top: '25%', left: '35%', width: '30%', height: '5%' } },
            { id: 'bag', name: 'Сумочка', image: 'https://i.ibb.co/0Qq3y0C/bag.png', position: { top: '40%', left: '75%', width: '20%', height: '15%' } },
            { id: 'bracelet', name: 'Браслет', image: 'https://i.ibb.co/0Qq3y0C/bracelet.png', position: { top: '40%', left: '15%', width: '10%', height: '5%' } }
        ]
    };
    
    // Заполняем сетку элементами
    showCategory('hair');
    
    // Обработчики для кнопок категорий
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            showCategory(category);
        });
    });
    
    // Обработчик для выбора цвета
    document.getElementById('color-picker').addEventListener('input', function(e) {
        currentColor = e.target.value;
    });
    
    // Обработчики для пресетов цветов
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            currentColor = this.getAttribute('data-color');
            document.getElementById('color-picker').value = currentColor;
        });
    });
    
    // Обработчики для текстур
    document.querySelectorAll('.texture-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            currentTexture = this.getAttribute('data-texture');
        });
    });
    
    // Обработчики для глиттера
    document.querySelectorAll('.glitter-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            currentGlitter = this.getAttribute('data-glitter');
        });
    });
    
    // Обработчики для кнопок действий
    document.getElementById('save-outfit').addEventListener('click', function() {
        saveOutfit();
    });
    
    document.getElementById('reset-all').addEventListener('click', function() {
        if (confirm('Удалить все элементы с Барби?')) {
            document.querySelectorAll('.clothing-item, .hair-item, .makeup-item').forEach(item => {
                item.remove();
            });
        }
    });
    
    // Функция для показа категории
    function showCategory(category) {
        const itemsGrid = document.getElementById('items-grid');
        itemsGrid.innerHTML = '';
        
        itemsData[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.style.backgroundImage = `url(${item.image})`;
            itemElement.setAttribute('data-id', item.id);
            itemElement.setAttribute('data-category', category);
            
            const nameElement = document.createElement('div');
            nameElement.className = 'item-name';
            nameElement.textContent = item.name;
            itemElement.appendChild(nameElement);
            
            itemElement.addEventListener('click', function() {
                applyItem(item, category);
            });
            
            itemsGrid.appendChild(itemElement);
        });
    }
    
    // Функция для применения элемента
    function applyItem(item, category) {
        // Удаляем элементы той же категории
        const existingItems = document.querySelectorAll(`.${category}-item`);
        existingItems.forEach(existingItem => {
            existingItem.remove();
        });
        
        // Создаем новый элемент
        const element = document.createElement('div');
        element.className = `${category}-item`;
        element.style.backgroundImage = `url(${item.image})`;
        element.style.top = item.position.top;
        element.style.left = item.position.left;
        element.style.width = item.position.width;
        element.style.height = item.position.height;
        element.setAttribute('data-id', item.id);
        element.setAttribute('data-category', category);
        
        document.getElementById('doll').appendChild(element);
    }
    
    // Функция для сохранения образа
    function saveOutfit() {
        const outfitName = prompt('Введите название для образа:', `Образ ${outfitCounter}`);
        if (!outfitName) return;
        
        // Собираем информацию о текущем образе
        const currentOutfit = {
            id: Date.now(),
            name: outfitName,
            items: []
        };
        
        // Сохраняем все элементы на Барби
        document.querySelectorAll('.hair-item, .makeup-item, .clothing-item').forEach(item => {
            currentOutfit.items.push({
                category: item.classList[0].replace('-item', ''),
                id: item.getAttribute('data-id'),
                position: {
                    top: item.style.top,
                    left: item.style.left,
                    width: item.style.width,
                    height: item.style.height
                }
            });
        });
        
        savedOutfits.push(currentOutfit);
        outfitCounter++;
        
        // Обновляем блок с сохраненными образами
        updateSavedOutfits();
        
        alert(`Образ "${outfitName}" сохранен! 💖`);
    }
    
    // Функция для обновления блока с сохраненными образами
    function updateSavedOutfits() {
        const outfitsGrid = document.getElementById('outfits-grid');
        outfitsGrid.innerHTML = '';
        
        if (savedOutfits.length === 0) {
            outfitsGrid.innerHTML = '<div class="no-outfits">Пока нет сохраненных образов</div>';
            return;
        }
        
        savedOutfits.forEach(outfit => {
            const outfitElement = document.createElement('div');
            outfitElement.className = 'outfit-thumbnail';
            outfitElement.style.backgroundImage = 'url(https://i.ibb.co/3zQq0Z0/barbie-base.png)';
            outfitElement.setAttribute('data-id', outfit.id);
            
            const nameElement = document.createElement('div');
            nameElement.className = 'outfit-name';
            nameElement.textContent = outfit.name;
            outfitElement.appendChild(nameElement);
            
            outfitElement.addEventListener('click', function() {
                loadOutfit(outfit.id);
            });
            
            outfitsGrid.appendChild(outfitElement);
        });
    }
    
    // Функция для загрузки образа
    function loadOutfit(outfitId) {
        const outfit = savedOutfits.find(o => o.id === outfitId);
        if (!outfit) return;
        
        // Удаляем все текущие элементы
        document.querySelectorAll('.hair-item, .makeup-item, .clothing-item').forEach(item => {
            item.remove();
        });
        
        // Добавляем элементы из сохраненного образа
        outfit.items.forEach(item => {
            const itemData = itemsData[item.category].find(i => i.id === item.id);
            if (itemData) {
                applyItem(itemData, item.category);
            }
        });
        
        alert(`Образ "${outfit.name}" загружен! ✨`);
    }
    
    // Функция для создания глиттер-эффекта
    function createGlitter() {
        const glitterContainer = document.getElementById('glitter');
        const glitterCount = 30;
        
        for (let i = 0; i < glitterCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'glitter-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particle.style.width = `${5 + Math.random() * 5}px`;
            particle.style.height = particle.style.width;
            
            glitterContainer.appendChild(particle);
        }
    }
    
    // Инициализируем блок с сохраненными образами
    updateSavedOutfits();
});
