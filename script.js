// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Создаем глиттер-эффект
    createGlitter();
    
    // Текущий выбранный цвет
    let currentColor = '#ff9dc9';
    
    // Данные об одежде
    const clothingItems = {
        dresses: [
            { id: 'minidress', name: 'Мини платье', color: '#ff9dc9', position: { top: '110px', left: '70px', width: '60px', height: '120px' } },
            { id: 'mididress', name: 'Миди платье', color: '#a2d2ff', position: { top: '110px', left: '70px', width: '60px', height: '150px' } },
            { id: 'maxidress', name: 'Макси платье', color: '#ffd166', position: { top: '110px', left: '70px', width: '60px', height: '180px' } },
            { id: 'balldress', name: 'Бальное платье', color: '#cdb4db', position: { top: '110px', left: '70px', width: '70px', height: '180px' } },
            { id: 'weddingdress', name: 'Свадебное платье', color: '#ffffff', position: { top: '110px', left: '70px', width: '70px', height: '190px' } }
        ],
        tops: [
            { id: 'sweatshirt', name: 'Свитшот', color: '#ff9dc9', position: { top: '110px', left: '70px', width: '60px', height: '80px' } },
            { id: 'swimsuit', name: 'Купальник', color: '#ff4e7d', position: { top: '110px', left: '70px', width: '60px', height: '70px' } },
            { id: 'top1', name: 'Розовый топ', color: '#ff9dc9', position: { top: '110px', left: '70px', width: '60px', height: '80px' } },
            { id: 'top2', name: 'Фиолетовый топ', color: '#cdb4db', position: { top: '110px', left: '70px', width: '60px', height: '80px' } },
            { id: 'top3', name: 'Блестящий топ', color: '#ffc8dd', position: { top: '110px', left: '70px', width: '60px', height: '80px' } }
        ],
        bottoms: [
            { id: 'shortshorts', name: 'Короткие шорты', color: '#a2d2ff', position: { top: '190px', left: '70px', width: '60px', height: '50px' } },
            { id: 'kneeshorts', name: 'Шорты до колена', color: '#ffafcc', position: { top: '190px', left: '70px', width: '60px', height: '70px' } },
            { id: 'maxiskirt', name: 'Юбка макси', color: '#bde0fe', position: { top: '190px', left: '70px', width: '60px', height: '120px' } },
            { id: 'jeans1', name: 'Скинни джинсы', color: '#6f8ab7', position: { top: '190px', left: '70px', width: '60px', height: '120px' } },
            { id: 'jeans2', name: 'Прямые джинсы', color: '#5d7592', position: { top: '190px', left: '70px', width: '60px', height: '120px' } },
            { id: 'jeans3', name: 'Джинсы-бойфренды', color: '#4a5c75', position: { top: '190px', left: '70px', width: '65px', height: '120px' } }
        ],
        shoes: [
            { id: 'heels', name: 'Каблуки', color: '#ffc8dd', position: { top: '260px', left: '75px', width: '50px', height: '30px' } },
            { id: 'sandals', name: 'Босоножки', color: '#ffafcc', position: { top: '260px', left: '75px', width: '50px', height: '30px' } },
            { id: 'boots', name: 'Сапоги', color: '#cdb4db', position: { top: '260px', left: '75px', width: '50px', height: '40px' } },
            { id: 'sneakers', name: 'Кроссовки', color: '#a2d2ff', position: { top: '260px', left: '75px', width: '50px', height: '30px' } },
            { id: 'flats', name: 'Балетки', color: '#ffd166', position: { top: '260px', left: '75px', width: '50px', height: '20px' } }
        ],
        accessories: [
            { id: 'earrings', name: 'Серьги', color: '#ffd166', position: { top: '70px', left: '95px', width: '10px', height: '20px' } },
            { id: 'necklace', name: 'Ожерелье', color: '#ffd166', position: { top: '100px', left: '95px', width: '10px', height: '10px' } },
            { id: 'bag', name: 'Сумочка', color: '#ff9dc9', position: { top: '150px', left: '130px', width: '30px', height: '40px' } },
            { id: 'bracelet', name: 'Браслет', color: '#ffd166', position: { top: '170px', left: '130px', width: '10px', height: '10px' } },
            { id: 'glasses', name: 'Солнечные очки', color: '#5d7592', position: { top: '80px', left: '85px', width: '30px', height: '10px' } },
            { id: 'hat', name: 'Шляпа', color: '#ff4e7d', position: { top: '40px', left: '85px', width: '30px', height: '20px' } }
        ]
    };
    
    // Заполняем сетку элементами
    showCategory('dresses');
    
    // Обработчики для кнопок категорий
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Показываем выбранную категорию
            const category = this.getAttribute('data-category');
            showCategory(category);
        });
    });
    
    // Обработчик для выбора цвета
    document.getElementById('color-picker').addEventListener('input', function(e) {
        currentColor = e.target.value;
        updateActiveItemColor();
    });
    
    // Обработчики для пресетов цветов
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            currentColor = this.getAttribute('data-color');
            document.getElementById('color-picker').value = currentColor;
            updateActiveItemColor();
        });
    });
    
    // Обработчики для кнопок действий
    document.querySelector('.action-btn.save').addEventListener('click', function() {
        alert('Образ сохранен! Ты выглядишь прекрасно! 💖');
    });
    
    document.querySelector('.action-btn.reset').addEventListener('click', function() {
        // Удаляем всю одежду с куклы
        document.querySelectorAll('.clothing-item').forEach(item => {
            item.remove();
        });
    });
    
    // Функция для показа категории
    function showCategory(category) {
        const itemsGrid = document.getElementById('items-grid');
        itemsGrid.innerHTML = '';
        
        clothingItems[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.style.background = `linear-gradient(45deg, ${item.color}, #fff)`;
            itemElement.setAttribute('data-id', item.id);
            itemElement.setAttribute('data-category', category);
            
            // Добавляем название элемента
            const nameElement = document.createElement('div');
            nameElement.className = 'item-name';
            nameElement.textContent = item.name;
            itemElement.appendChild(nameElement);
            
            // Добавляем обработчик для одевания элемента
            itemElement.addEventListener('click', function() {
                dressItem(item);
            });
            
            itemsGrid.appendChild(itemElement);
        });
    }
    
    // Функция для добавления элемента одежды на куклу
    function dressItem(item) {
        // Удаляем элементы той же категории (если уже надеты)
        const categoryPrefix = item.id.replace(/\d+$/, '');
        const existingItems = document.querySelectorAll(`.clothing-item[data-category^="${categoryPrefix}"]`);
        existingItems.forEach(existingItem => {
            existingItem.remove();
        });
        
        // Создаем новый элемент одежды
        const clothingElement = document.createElement('div');
        clothingElement.className = 'clothing-item';
        clothingElement.style.background = `linear-gradient(45deg, ${currentColor}, #fff)`;
        clothingElement.style.top = item.position.top;
        clothingElement.style.left = item.position.left;
        clothingElement.style.width = item.position.width;
        clothingElement.style.height = item.position.height;
        clothingElement.setAttribute('data-id', item.id);
        clothingElement.setAttribute('data-category', item.id.replace(/\d+$/, ''));
        clothingElement.setAttribute('data-original-color', currentColor);
        
        // Добавляем возможность изменения цвета при клике
        clothingElement.addEventListener('click', function() {
            this.style.background = `linear-gradient(45deg, ${currentColor}, #fff)`;
            this.setAttribute('data-original-color', currentColor);
        });
        
        document.getElementById('doll').appendChild(clothingElement);
    }
    
    // Функция для обновления цвета активного элемента
    function updateActiveItemColor() {
        const activeItem = document.querySelector('.clothing-item:hover');
        if (activeItem) {
            activeItem.style.background = `linear-gradient(45deg, ${currentColor}, #fff)`;
            activeItem.setAttribute('data-original-color', currentColor);
        }
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
});
