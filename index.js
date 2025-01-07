import { readFileSync } from "fs";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { JSONDatabase } from "./db.js";
import { ItemDB, ItemNotFoundError, itemSchema } from "./itemDB.js";
import responseTime from "response-time";


const app = express();
app.use(cors());
if (process.env["NODE_ENV"] !== "production") {
    app.use(responseTime((req, res, time) => {
        console.log(req.url, time);
    }))
}
app.use(bodyParser.json());



let APIKey, APP_PORT;

if (process.env.API_KEY) {
    console.log("using api key from env");
    APIKey = process.env.API_KEY;
}
else {
    console.log("using api key from file");
    APIKey = readFileSync("api_key.txt", "utf8");
}

if (process.env.PORT) {
    console.log("using PORT key from env");
    APP_PORT = process.env.PORT;
}
else if (process.env.APP_PORT) {
    console.log("using APP_PORT key from env");
    APP_PORT = process.env.APP_PORT;
}
else {
    console.log("using default port 80");
    APP_PORT = 80
}


console.log("API Key:", APIKey);

async function init() {
    const jsonDB = new JSONDatabase("./db.json");
    await jsonDB.init();
    const itemDB = new ItemDB(jsonDB);

    const shoppingList = express.Router();
	
	shoppingList.get('/GetApp', (req, res) => {
		res.sendFile('./LiveShoppingList.apk', {root: process.cwd()});
	});

    shoppingList.get('/web', (req, res) => {
        if (!req.path.endsWith("/")) {
            return res.redirect("/web/");
        }
		res.sendFile('./public/index.html', {root: process.cwd()});
	});

    shoppingList.use("/web", express.static('public'));
	
	shoppingList.use(function(req, res, next) {
        if (!req.headers.authorization) {
            console.error("Authorization Error from:", req.ip);
            return res.status(403).json({ error: 'No credentials sent!' });
        }
        else if (req.headers.authorization != APIKey) {
            console.error("Authorization Error from:", req.ip);
            return res.status(403).json({ error: 'Wrong Credentials' });
        }
        next();
	});

    shoppingList.get('/', (req, res) => {
        const user = req.headers["x-user"];
        console.log(req.headers);
        const items = itemDB.getItemsForUser(user);

        res.json(items);
    });

    // GET /items/:id
    shoppingList.get('/:id', (req, res) => {
        const item = itemDB.getItemByID(req.params.id);

        const user = req.headers["x-user"];
        if (item.is_private) {
            if (user === item.added_by) {
                return res.json(item);
            }
            else {
                return res.status(404).json(item);
            }
        }

        return res.json(item);
    });

    shoppingList.post('/add', async (req, res) => {
        for (let key in itemSchema) {
            if (!req.body.hasOwnProperty(key)) {
                res.status(400).json({success: 0, err: "missing required field: " + key});
                return;
            }
        }

        const item = await itemDB.addItem(req.body);
        console.log(item);
        res.send({success: 1, item});
    });

    //updates an item to the bool specified in the bought property
    shoppingList.post('/bought', async (req, res) => {
        if (!req.body.hasOwnProperty('id')) {
            res.status(400).json({success: 0, err: "missing required field: id"});
            return;
        }

        const item = await itemDB.bought(req.body.id, req.body.bought);
        console.log(item);
        res.send({success: 1, item});
    });

    //updates an item to the bool specified in the bought property
    shoppingList.post('/update', async (req, res) => {
        const itemSchema = JSON.parse(JSON.stringify(itemSchema));
        itemSchema.id = 0;
        for (let key in itemSchema) {
            if (!req.body.hasOwnProperty(key)) {
                res.status(400).json({success: 0, err: "missing required field: " + key});
                return;
            }
        }
        const item = await itemDB.updateItem(req.body);

        console.log(item);
        res.send({success: 1, item});
    });

    //updates an item to the bool specified in the bought property
    shoppingList.delete('/:id', async (req, res) => {
        console.log(req.params.id);
        try {
            const item = itemDB.getItemByID(req.params.id);
            console.log("Deleting Item:");
            console.log(item);
            await itemDB.deleteById(req.params.id);
            
            res.send({success: 1, item});
            return;
        }
        catch (e) {
            if (e instanceof ItemNotFoundError) {
                res.status(400).json({success: 0, err: "ID not found"});
                return;
            }
            console.error(e);
            throw e;
        }
    });


    app.use('/shoppingList', shoppingList);
    app.use(shoppingList);

    app.listen(APP_PORT, () => {
        console.log('Express started on port ' + APP_PORT);
    });
}


init();
