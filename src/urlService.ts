import axios from "axios";

export interface Url {
    longUrl?: string;
    shortUrl?: string;
    numVisit?: number;
}

export interface UrlRequest extends Url {
    longUrl: string;
}

export interface UrlResponse extends Url {
    longUrl: string;
    shortUrl: string;
    numVisit: number;
}

export interface BatchUrlRequest {
    urls: UrlRequest[];
}

export interface BatchUrlResponse {
    urls: UrlResponse[];
}

export interface UrlService {
    createBatchShortUrl(batchUrlRequest: BatchUrlRequest): Promise<BatchUrlResponse>;
}

export class ApiUrlService implements UrlService {
    public baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async createBatchShortUrl(batchUrlRequest: BatchUrlRequest): Promise<BatchUrlResponse> {
        const req = await axios.post(this.baseUrl + "api/url/batch-create/", batchUrlRequest);
        return req.data;
    }
}
