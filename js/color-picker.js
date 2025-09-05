class ColorPicker {
    constructor() {
        this.picker = document.getElementById('color-picker');
        this.colorInput = document.getElementById('color-input');
        this.applyButton = document.getElementById('apply-color');
        this.cancelButton = document.getElementById('cancel-color');
        this.colorPresets = document.querySelectorAll('.color-option');
        this.currentCategory = null;
        this.currentCallback = null;
        
        this.setupEvents();
    }

    setupEvents() {
        this.applyButton.addEventListener('click', () => this.applyColor());
        this.cancelButton.addEventListener('click', () => this.hide());
        
        this.colorPresets.forEach(preset => {
            preset.addEventListener('click', (e) => {
                this.colorInput.value = e.target.dataset.color;
            });
        });
        
        // Закрытие по клику вне пикера
        document.addEventListener('click', (e) => {
            if (!this.picker.contains(e.target) && !this.picker.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    show(category, currentColor, callback) {
        this.currentCategory = category;
        this.currentCallback = callback;
        
        if (currentColor) {
            this.colorInput.value = currentColor;
        }
        
        this.picker.classList.remove('hidden');
        
        // Позиционируем пикер
        const canvas = document.getElementById('barbie-canvas');
        const rect = canvas.getBoundingClientRect();
        this.picker.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    }

    hide() {
        this.picker.classList.add('hidden');
        this.currentCategory = null;
        this.currentCallback = null;
    }

    applyColor() {
        if (this.currentCallback) {
            this.currentCallback(this.currentCategory, this.colorInput.value);
        }
        this.hide();
    }
}
