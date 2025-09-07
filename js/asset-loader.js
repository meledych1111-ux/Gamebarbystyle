const assetLoader = {
  _config: null,

  async loadAssets() {
    if (this._config) return this._config;

    try {
      const response = await fetch("wardrobe.json");
      if (!response.ok) throw new Error("Не удалось загрузить wardrobe.json");
      this._config = await response.json();
      return this._config;
    } catch (err) {
      console.error("Ошибка загрузки ассетов:", err);
      return null;
    }
  },

  getWardrobeConfig() {
    return this._config;
  },

  getClothing(id, category) {
    if (!this._config || !this._config.categories) return null;
    const items = this._config.categories[category];
    return items ? items.find(item => item.id === id) : null;
  },

  getDoll(id) {
    if (!this._config || !this._config.dolls) return null;
    return this._config.dolls.find(doll => doll.id === id) || null;
  }
};
