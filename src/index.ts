import {Client, ClientConfig, middleware, MiddlewareConfig, WebhookEvent} from "@line/bot-sdk";
import express from "express";
import {Handler, UrlShortenerHandler} from "./handlers";
import {ApiUrlService} from "./urlService";

const lineConfig: ClientConfig & MiddlewareConfig = {
    channelAccessToken: process.env["CHANNEL-ACCESS-TOKEN"],
    channelSecret: process.env["CHANNEL-SECRET"]
};

const app = express();
const lineClient = new Client(lineConfig);
const urlService = new ApiUrlService(process.env["BASE-URL"]);

const handlers: Handler[] = [
    new UrlShortenerHandler(urlService, lineClient)
];

app.post( "/webhook", middleware(lineConfig), ( req: express.Request, res: express.Response ) => {
    const events: WebhookEvent[] = req.body.events;

    events.forEach((event) => {
        handlers.forEach((handler) => {
            handler.process(event);
        });
    });

    res.send("ok");
} );

const port = process.env.PORT || 8080;
app.listen(port);
