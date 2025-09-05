class ColorPicker {
    constructor() {
        this.hairColorPicker = null;
        this.eyesColorPicker = null;
        this.onColorChange = null;
    }

    init(onColorChange) {
        this.onColorChange = onColorChange;
        
        this.hairColorPicker = document.getElementById('hairColor');
        this.eyesColorPicker = document.getElementById('eyesColor');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.hairColorPicker.addEventListener('input', (e) => {
            this.handleColorChange('hair', e.target.value);
        });

        this.eyesColorPicker.addEventListener('input', (e) => {
            this.handleColorChange('eyes', e.target.value);
        });

        this.hairColorPicker.addEventListener('change', (e) => {
            this.handleColorChange('hair', e.target.value);
        });

        this.eyesColorPicker.addEventListener('change', (e) => {
            this.handleColorChange('eyes', e.target.value);
        });
    }

    handleColorChange(type, color) {
        if (this.onColorChange) {
            const hairColor = type === 'hair' ? color : this.hairColorPicker.value;
            const eyesColor = type === 'eyes' ? color : this.eyesColorPicker.value;
            this.onColorChange(hairColor, eyesColor);
        }
    }

    getColors() {
        return {
            hair: this.hairColorPicker.value,
            eyes: this.eyesColorPicker.value
        };
    }

    setColors(hairColor, eyesColor) {
        this.hairColorPicker.value = hairColor;
        this.eyesColorPicker.value = eyesColor;
    }
}

// Создаем экземпляр цветового пикера
const colorPicker = new ColorPicker();
