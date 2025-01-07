// Generate a class to read and write JSON to a file

import { readFile, writeFile } from "fs/promises";

/**
 * A simple JSON database
 * @template T
 */
export class JSONDatabase {

    isInitialised = false;
    path;

    /**
     * @type {T[]}
     */
    data;

    /**
     * Create the database. You must call `#init()` before you can start using the db
     * @param {string} path The path of the database file
     */
    constructor(path) {
        this.path = path;
    }

    async init() {
        // Check if file exists or create it        
        await this.read(true);
        
        this.isInitialised = true;
    }

    async read(createIfMissing = false) {
        try {
            const dbJSONStr = await readFile(this.path, "utf8");
            this.data = JSON.parse(dbJSONStr);
        }
        catch (e) {
            if (e.code == "ENOENT") {
                if (createIfMissing) {
                    console.log("Database file not found, creating new one");
                    await writeFile(this.path, "[]", "utf8");
                    this.data = [];
                }
                else {
                    console.log("Database file not found.");
                    console.error(e);
                    throw new Error("Failed to find Database");
                }
                
            }
            else {
                let error;
                if (e.message.includes("is not valid JSON")) {
                    error = "Database file is corrupt. Please fix the file.";
                }
                else {
                    error = "Failed to open Database file";
                }

                console.error(error, e);
                throw e;
            }
        }  
    }

    write() {
        return writeFile(this.path, JSON.stringify(this.data), "utf8");
    }

    async insert(newItem) {
        this.data.push(newItem);
        await this.write();
        return newItem;
    }

    async deleteRow(index) {
        this.data.splice(index, 1);
        await this.write();
    }
}
