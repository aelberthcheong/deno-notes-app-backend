import "express";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            validatedBody?: any;
            validatedQuery?: any;
        }
    }
}
