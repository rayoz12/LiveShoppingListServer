if (process.env.NODE_ENV == "dev") {
    console.log("Running in Dev Mode");
    require("dotenv").config({ path: "./env/dev.env" });
} else {
    require("dotenv").config({ path: "./env/prod.env" });
}

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

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

    await app.listen(3000);
}
bootstrap();
