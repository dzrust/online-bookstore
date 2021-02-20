import * as express from "express"
import { BookInventory } from "../models/book"
import database, { queryCallback } from "./database"
import { createResponse } from "./response";


export const createBookInventory = async (isbn: string) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL create_book_inventory(?);",
            [isbn],
            (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const readBookInventory = async (isbn: string): Promise<BookInventory[]> => {
    const bookLogsResult: any = await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL read_book_inventory(?);",
            [isbn], (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
    return bookLogsResult.map((bookLogResult: any) => ({
        id: bookLogResult.id,
        checkedIn: bookLogResult.checkedIn
    }));
}

export const updateBookInventory = async (id: string, checkedIn: boolean) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL update_book_inventory(?, ?);",
            [id, checkedIn],
            (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const deleteBookInventory = async (id: string) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL delete_book_inventory(?);",
            [id],
            (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const setupInventoryRoutes = (app: express.Application) => {
    app.post("/inventory/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        createBookInventory(isbn).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.get("/inventory/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        readBookInventory(isbn).then(logs => {
            res.send(createResponse(logs, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.put("/inventory/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        const checkedIn = req.body.checkedIn;
        updateBookInventory(isbn, checkedIn).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.delete("/inventory/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        readBookInventory(isbn).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
}