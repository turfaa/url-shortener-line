import {Client, WebhookEvent} from "@line/bot-sdk";
import isUrl from "is-url";
import {BatchUrlRequest, UrlService} from "./urlService";

export interface Handler {
    process(event: WebhookEvent): void;
}

export class UrlShortenerHandler implements Handler {
    public urlService: UrlService;
    public lineClient: Client;

    constructor(urlService: UrlService, lineClient: Client) {
        this.urlService = urlService;
        this.lineClient = lineClient;
    }

    public async process(event: WebhookEvent): Promise<any> {
        if (event.type === "message" && event.message.type === "text") {
            const message = event.message.text;
            const urls = this.getUrlsFromMessage(message);

            if (urls.length > 0) {
                const batchUrlRequest: BatchUrlRequest = {urls: urls.map((url) => ({longUrl: url}))};

                const batchUrlResponse = await this.urlService.createBatchShortUrl(batchUrlRequest);
                const replyMessage = "Halo! Ini linknya yaa:\n\n" +
                    batchUrlResponse.urls
                        .map((urlResponse) => `Awalnya ${urlResponse.longUrl}, jadi ${urlResponse.shortUrl}`)
                        .reduce((prev: string, current: string) => `${prev}\n\n${current}`);

                return this.lineClient.replyMessage(event.replyToken, {type: "text", text: replyMessage});
            }
        }
    }

    private getUrlsFromMessage(message: string): string[] {
        const splittedMessage = message.split(" ");
        const withProtocol = splittedMessage.map((val: string) =>
            val.substring(0, 4) === "http" ? val : "http://" + val);
        return withProtocol.filter((val: string) => isUrl(val));
    }
}
