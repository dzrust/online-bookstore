import express from "express"
import { Book, BookLog } from "../models/book"
import database, { queryCallback } from "./database"
import { createResponse } from "./response";


export const createBook = async (book: Book) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL create_book(?, ?, ?, ?);",
            [book.isbn, book.title, book.author, book.description],
            (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const readBook = async (isbn: string): Promise<Book> => {
    const bookResult: any = await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL read_book(?);",
            [isbn], (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
    return {
        isbn: bookResult.isbn,
        title: bookResult.title,
        author: bookResult.author,
        description: bookResult.bookDescription
    };
}

export const updateBook = async (book: Book) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL update_book(?, ?, ?, ?);",
            [book.isbn, book.title, book.author, book.description],
            (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const deleteBook = async (isbn: string) => {
    await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL delete_book(?);",
            [isbn], (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
}

export const readAllBooks = async (): Promise<Book[]> => {
    const booksResult: any[] = await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL read_all_books();", (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
    return booksResult.map((bookResult) => ({
        isbn: bookResult.isbn,
        title: bookResult.title,
        author: bookResult.author,
        description: bookResult.bookDescription
    }));
}

export const setupBookRoutes = (app: express.Application) => {
    app.post("/book", (req: express.Request, res: express.Response) => {
        const book = req.body;
        createBook(book).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.get("/book", (req: express.Request, res: express.Response) => {
        readAllBooks().then((books) => {
            res.send(createResponse(books, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.get("/book/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        readBook(isbn).then((book) => {
            res.send(createResponse(book, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.put("/book", (req: express.Request, res: express.Response) => {
        const book = req.body;
        updateBook(book).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.delete("/book/:isbn", (req: express.Request, res: express.Response) => {
        const isbn = req.params.isbn;
        deleteBook(isbn).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
}