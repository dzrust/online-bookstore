import * as express from "express"
import { BookLog } from "../models/book"
import database, { queryCallback } from "./database"
import { createResponse } from "./response";


export const readBookLog = async (isbn: string): Promise<BookLog[]> => {
    const bookLogsResult: any[] = await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL read_book_log(?);",
            [isbn], (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
    return bookLogsResult.map((bookLogResult: any) => ({
        id: bookLogResult.id,
        dateTime: bookLogResult.updatedDateTime,
        message: bookLogResult.messageLog
    }));
}

export const setupLogRoutes = (app: express.Application) => {
    app.get("/log/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        readBookLog(isbn).then(logs => {
            res.send(createResponse(logs, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
}