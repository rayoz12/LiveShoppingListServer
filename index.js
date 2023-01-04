const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());

const low = require("lowdb");
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');
let db;

let APIKey, APP_PORT;

if (process.env.API_KEY) {
    console.log("using api key from env");
    APIKey = process.env.API_KEY;
}
else {
    console.log("using api key from file");
    APIKey = fs.readFileSync("api_key.txt", "utf8");
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
    console.log("using port key from file");
    APP_PORT = 80
}


console.log("API Key:", APIKey);


class Item {
    constructor(item = "", quantity = 1, bought = false, added_by = "unknown", comments = "", group = "none", isPrivate = false) {
        this.item = item;
        this.quantity = quantity
        this.bought = bought;
        this.added_by = added_by;
        this.comments = comments;
        this.group = group;
        this.isPrivate = isPrivate;
    }
}

async function init() {
    db = await low(adapter);
    //db.read();

    // Set some defaults
    db.defaults({ items: [] }).write();

    console.log(db.get('items').value());

    const shoppingList = express.Router();
	
	shoppingList.get('/GetApp', (req, res) => {
		res.sendFile('./LiveShoppingList.apk', {root: __dirname});
	});

    shoppingList.get('/web', (req, res) => {
        if (!req.path.endsWith("/")) {
            return res.redirect("/web/");
        }
		res.sendFile('./public/index.html', {root: __dirname});
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
        //res.json(dn)
        let items = db.get('items').value();

        const user = req.headers["x-user"];
        console.log(req.headers);
        if (user) {
            // get the user's private items
            items = items.filter(it => !it.isPrivate || it.added_by === user);
        }
        else {
            // get the public (!isPrivate) items
            items = items.filter(it => !it.isPrivate);
        }

        res.json(items);
    });

    // GET /items/:id
    shoppingList.get('/:id', (req, res) => {
        const item = db.get('items')
        .find({ id: req.params.id })
        .value();

        const user = req.headers["x-user"];
        if (item.isPrivate) {
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
        const itemSchema = JSON.parse(JSON.stringify(new Item()));
        for (let key in itemSchema) {
            if (!req.body.hasOwnProperty(key)) {
                res.status(400).json({success: 0, err: "missing required field: " + key});
                return;
            }
        }

        const item = await db.get('items')
        .push(req.body)                         //pushes it
        .last()                                 //gets the last element of array
        .assign({ id: Date.now().toString() })  //add an id field
        .write();                               //save it
        console.log(item);
        res.send({success: 1, item});
    });

    //updates an item to the bool specified in the bought property
    shoppingList.post('/bought', async (req, res) => {
        if (!req.body.hasOwnProperty('id')) {
            res.status(400).json({success: 0, err: "missing required field: id"});
            return;
        }
        const item = await db.get("items")
        .find({id: req.body.id})
        .assign({bought: req.body.bought})
        .write();
        console.log(item);
        res.send({success: 1, item});
    });

    //updates an item to the bool specified in the bought property
    shoppingList.post('/update', async (req, res) => {
        const itemSchema = JSON.parse(JSON.stringify(new Item()));
        itemSchema.id = 0;
        for (let key in itemSchema) {
            if (!req.body.hasOwnProperty(key)) {
                res.status(400).json({success: 0, err: "missing required field: " + key});
                return;
            }
        }
        db.get('items')
        .find({id: req.body.id})
        .assign(req.body)
        .value();
        const item = await db.write();
        console.log(item);
        res.send({success: 1, item});
    });

    //updates an item to the bool specified in the bought property
    shoppingList.delete('/:id', async (req, res) => {
        console.log(req.params.id);
        const id = req.params.id;
        const itemSearch = db.get("items").find({id});
        if (itemSearch.size() < 1) {
            res.status(400).json({success: 0, err: "ID not found"});
            return;
        }

        const item = await db.get("items")
        .remove({id: req.params.id})
        .write();
        console.log("Deleting Item:");
        console.log(item);
        res.send({success: 1, item});
    });

    app.use(cors());
    app.use('/shoppingList', shoppingList);
    app.use(shoppingList);

    app.listen(APP_PORT, () => {
        console.log('Express started on port ' + APP_PORT);
    });
}


init();