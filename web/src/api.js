export let api = "";
if (isProduction) {
    api = ""
}
else {
    api = "http://localhost:80"
}

let key = "";
let defaultHeader = {
    "Authorization": key,
    "Content-Type": "application/json"
}

export function setConfig(newKey) {
    key = newKey;
    defaultHeader.Authorization = key;
    localStorage.setItem("listKey", newKey);
}

export function getKey() {
    return key;
}

// Load from localstorage if it's there
const keyStorage = localStorage.getItem("listKey");
if (keyStorage !== null) {
    key = keyStorage;
    defaultHeader.Authorization = keyStorage;
}

export class Item {
    constructor(item = "", quantity = 1, bought = false, added_by = "unknown", comments = "", group = "None") {
        this.item = item;
        this.quantity = quantity
        this.bought = bought;
        this.added_by = added_by;
        this.comments = comments;
        this.group = group;
    }
}


export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getItems() {
    const res = await fetch(api + "/", {headers: defaultHeader});

    if (res.status === 403) {
        throw new Error("API Key is incorrect");
    } else if (!res.ok) {
        throw new Error("Failed to get Items");
    }

    const itemsJSON = await res.json();
    // await delay(5000);

    return itemsJSON.map(it => {
        const item = new Item();
        Object.assign(item, it);
        return item;
    });
}

export async function setBought(item) {
    const res = await fetch(`${api}/bought`, {headers: defaultHeader, method: "POST", body: JSON.stringify(item)});
}

export async function deleteItem(item) {
    const res = await fetch(`${api}/${item.id}`, {headers: defaultHeader, method: "DELETE", body: JSON.stringify(item)});
}

export async function addItem(item) {
    const res = await fetch(`${api}/add`, {headers: defaultHeader, method: "POST", body: JSON.stringify(item)});
    const json = await res.json();
    return json.item;
} 