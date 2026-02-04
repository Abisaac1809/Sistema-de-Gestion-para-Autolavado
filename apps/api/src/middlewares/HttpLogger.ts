import { Request, Response, RequestHandler } from "express";
import morgan, { TokenIndexer } from "morgan";

const httpLogger: RequestHandler = morgan(
    function (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) {
        return JSON.stringify({
            method: tokens.method?.(req, res),
            url: tokens.url?.(req, res),
            status: tokens.status?.(req, res),
            content_length: tokens.res?.(req, res, "content-length"),
            response_time: tokens["response-time"]?.(req, res) || "",
        });
    }, {
    stream: {
        write: (message: string) => {
            const data = JSON.parse(message);
            console.log(`incoming-request`, data);
        }
    },
    skip: (req: Request) => req.method === "HEAD" || req.url === "/"
}
);

export default httpLogger;
