import {Request, Response, NextFunction} from "express";
import { ZodObject, ZodError, z } from "zod";

export default function validateQueryParams(schema: ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.query);
            res.locals.validatedQuery = parsed;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ 
                    message: "The query param is invalid",
                    detailsOfEachInvalidData: error.issues.map((error)=> {
                        return {
                            code: error.code,
                            message: error.message,
                            path: error.path
                        }
                    })
                })
            }
            next(error);
        }
    }
}
