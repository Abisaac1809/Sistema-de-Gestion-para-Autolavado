import { Request, Response, NextFunction } from "express";
import { BusinessError } from "../errors/BusinessErrors";
import { InternalServerError } from "../errors/InternalServerErrors";

export default function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof BusinessError) {
        console.log(`Business error occurred: ${error.name} - ${error.message}`);
        res
            .status(error.statusCode)
            .json({
                name: error.name,
                message: error.message
            })
    }
    else if (error instanceof InternalServerError) {
        console.log(`Internal server error occurred: ${error.name} - ${error.message}`);
        res
            .status(error.statusCode)
            .json({
                name: "Internal Server Error",
                message: "An error has ocurred on the server. Try again Later"
            })
    }
    else {
        console.log(`Internal server error occurred: ${error.name} - ${error.message}`);
        res
            .status(500)
            .json({
                name: "Internal Server Error",
                message: "An error has ocurred on the server. Try again Later"
            })
    }
}
