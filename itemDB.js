import { v7 as uuidv7 } from "uuid";


export class Item {
    id = null;
    constructor(item = "", quantity = 1, bought = false, added_by = "unknown", comments = "", group = "none", is_private = false) {
        this.item = item;
        this.quantity = quantity
        this.bought = bought;
        this.added_by = added_by;
        this.comments = comments;
        this.group = group;
        this.is_private = is_private;
    }
}

let _itemSchema = JSON.parse(JSON.stringify(new Item()));
delete _itemSchema.id;
export const itemSchema = _itemSchema;

export class ItemNotFoundError extends Error {
    constructor() { 
        super("Item not Found");
    }
}


export class ItemDB {

    /**
     * @type {import("./db").JSONDatabase<Item>}
     */
    db;

    /**
     * Creates the Item DB
     * @param {import("./db").JSONDatabase<Item>} db An **initialised** database
     */
    constructor(db) {
        this.db = db;
    }

    getItems() {
        return this.db.data;
    }

    getItemsForUser(user) {
        return user ? 
            this.getItems().filter(it => !it.is_private || it.added_by === user)
            :
            this.getItems().filter(it => !it.is_private);
    }

    getItemByID(id) {
        return this.getItems().find(it => it.id === id);
    }

    at(index) {
        return this.db.data[index];
    }

    /**
     * Adds an Item to the DB
     * @param {Item} item item to add
     * @returns {Promise<Item>} Item saved with id
     */
    addItem(item) {
        item.id = uuidv7();
        return this.db.insert(item);
    }

    /**
     * Marks an item as bought
     * @param {string} id the id of the item
     * @param {boolean} status the new bought status
     * @returns Item
     */
    async bought(id, status) {
        const item = this.getItemByID(id);
        if (!item) {
            throw new ItemNotFoundError();
        }
        item.bought = status;
        await this.db.write();
        return item;
    }

    async updateItem(newItem) {
        const itemIdx = this.getItems().findIndex(it => it.id === newItem.id);
        if (itemIdx === -1) {
            throw new ItemNotFoundError();
        }
        Object.assign(this.at(itemIdx), newItem);
        await this.db.write();
        return this.at(itemIdx);
    }

    async deleteById(id) {
        const itemIdx = this.getItems().findIndex(it => it.id === id);
        if (itemIdx === -1) {
            throw new ItemNotFoundError();
        }

        await this.db.deleteRow(itemIdx);
    }


}