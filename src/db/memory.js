const memoryDB = {
    data: [],
    
    addItem(item) {
        this.data.push(item);
    },

    getItem(id) {
        return this.data.find(item => item.id === id);
    },

    getAllItems() {
        return this.data;
    },

    updateItem(id, updatedItem) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updatedItem };
        }
    },

    deleteItem(id) {
        this.data = this.data.filter(item => item.id !== id);
    }
};

module.exports = memoryDB;