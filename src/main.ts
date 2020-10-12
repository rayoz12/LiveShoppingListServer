if (process.env.NODE_ENV == "dev") {
    console.log("Running in Dev Mode");
    require("dotenv").config({ path: "./env/dev.env" });
} else {
    console.log("Running in Production Mode");
    require("dotenv").config({ path: "./env/prod.env" });
}

const ascii = [
"    __    _               _____ __                      _                ___      __ ", 
"   / /   (_)   _____     / ___// /_  ____  ____  ____  (_)___  ____ _   / (_)____/ /_", 
"  / /   / / | / / _ \\    \\__ \\/ __ \\/ __ \\/ __ \\/ __ \\/ / __ \\/ __ `/  / / / ___/ __/", 
" / /___/ /| |/ /  __/   ___/ / / / / /_/ / /_/ / /_/ / / / / / /_/ /  / / (__  ) /_  ", 
"/_____/_/ |___/\\___/   /____/_/ /_/\\____/ .___/ .___/_/_/ /_/\\__, /  /_/_/____/\\__/  ", 
"                                       /_/   /_/            /____/                   "
]
setTimeout(() =>{
    console.log(ascii.join("\n"));
    console.log(`v2.0.0 - 2020/10/11 - Initial Release - Black Star Pastry`);
}, 3000);

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { get } from "config";

let port = get<number>("port");
const isDev = get<boolean>("isDev");
// Check if we're running on prod and heroku to read the port from the env
// ON_HEROKU is a env variable set as part as the app settings. not part of heroku itself
if (!isDev && process.env.ON_HEROKU) {
    port = +process.env.PORT;
}


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const options = new DocumentBuilder()
        .setTitle("Shopping List")
        .setDescription("Shopping List Rest API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api", app, document);
    
    Logger.log(`Live Shopping List Starting Port ${port}`, "Live Shopping List");
    await app.listen(port);
}
bootstrap();
