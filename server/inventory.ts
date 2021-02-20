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

export const updateBookInventory = async (id: string, checkedIn: boolean, isbn: string) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL update_book_inventory(?, ?, ?);",
            [id, checkedIn, isbn],
            (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const deleteBookInventory = async (id: string, isbn: string) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL delete_book_inventory(?, ?);",
            [id, isbn],
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
    app.put("/inventory/:isbn/:id", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        const id = req.params.id;
        const checkedIn = req.body.checkedIn;
        updateBookInventory(id, checkedIn, isbn).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.delete("/inventory/:isbn/:id", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        const id = req.params.id;
        deleteBookInventory(id, isbn).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
}