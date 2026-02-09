import Joi from "joi";
import { NextFunction, Request, Response } from "express";

export function validate(schema: Joi.ObjectSchema) {
    return function (req: Request, _res: Response, next: NextFunction): void {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });

        if (error) return next(error);
        req.validatedBody = value;
        next();
    };
}

export function validateQuery(schema: Joi.ObjectSchema) {
    return function (req: Request, _res: Response, next: NextFunction): void {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });

        if (error) return next(error);
        req.validatedQuery = value;
        next();
    };
}
