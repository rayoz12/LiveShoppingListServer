export let api = "";
if (isProduction) {
    api = ""
}
else {
    api = "http://localhost:80"
}

let key = "";
let defaultHeaders = {
    "Authorization": key,
    "x-user": undefined,
    "Content-Type": "application/json"
}

export function setConfig(newKey, name) {
    key = newKey;
    defaultHeaders.Authorization = key;
    defaultHeaders["x-user"] = name;
    localStorage.setItem("listKey", newKey);
}

export function getKey() {
    return key;
}

// Load from localstorage if it's there
const keyStorage = localStorage.getItem("listKey");
if (keyStorage !== null) {
    key = keyStorage;
    defaultHeaders.Authorization = keyStorage;
}

const nameStorage = localStorage.getItem("listName");
if (nameStorage !== null) {
    defaultHeaders["x-user"] = nameStorage;
}

export class Item {
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


export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getItems() {
    const res = await fetch(api + "/", {headers: defaultHeaders});

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
    const res = await fetch(`${api}/bought`, {headers: defaultHeaders, method: "POST", body: JSON.stringify(item)});
}

export async function deleteItem(item) {
    const res = await fetch(`${api}/${item.id}`, {headers: defaultHeaders, method: "DELETE", body: JSON.stringify(item)});
}

export async function addItem(item) {
    const res = await fetch(`${api}/add`, {headers: defaultHeaders, method: "POST", body: JSON.stringify(item)});
    const json = await res.json();
    return json.item;
} 