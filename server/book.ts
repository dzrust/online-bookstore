import * as express from "express"
import { Book } from "../models/book"
import database, { queryCallback } from "./database"
import { createResponse } from "./response";

const PAGE_SIZE = 100;

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
        isbn: bookResult[0].isbn,
        title: bookResult[0].title,
        author: bookResult[0].author,
        description: bookResult[0].bookDescription
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

export const readAllBooksCount = async (searchText: string): Promise<number> => {
    const booksResult: any[] = await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL read_all_books_count(?);", [`%${searchText}%`], (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
    return booksResult[0].resultCount;
}

export const readAllBooks = async (searchText: string, page: number, bookCount: number): Promise<Book[]> => {
    let pageStart = (page * PAGE_SIZE);
    let pageEnd = pageStart + PAGE_SIZE;
    const booksResult: any[] = await new Promise((resolve, reject) => {
        database.getConnection().query(
            "CALL read_all_books(?, ?, ?);", [`%${searchText}%`, pageStart, pageEnd], (error, results) => {
                queryCallback(error, results, resolve, reject);
            });
    });
    return booksResult.map((bookResult: any) => ({
        isbn: bookResult.isbn,
        title: bookResult.title,
        author: bookResult.author,
        description: bookResult.bookDescription
    }));
}

const validateBook = (book: Book): { valid: boolean, message: string } => {
    if (book.isbn.length < 10 || book.isbn.length > 20) {
        return { valid: false, message: "ISBN must be between 10 and 20 characters" };
    }
    if (book.title.length < 1 || book.title.length > 200) {
        return { valid: false, message: "Title must be between 1 and 200 characters" };
    }
    if (book.author.length < 1 || book.author.length > 200) {
        return { valid: false, message: "Author must be between 1 and 200 characters" };
    }
    return { valid: true, message: "" };
};

export const setupBookRoutes = (app: express.Application) => {
    app.post("/book", (req: express.Request, res: express.Response) => {
        const book: Book = req.body;
        const validation = validateBook(book);
        if (!validation.valid) {
            res.send(createResponse(validation.message, 400));
            return;
        }
        createBook(book).then(() => {
            res.send(createResponse(true, 200));
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
    app.get("/book", (req: express.Request, res: express.Response) => {
        const searchText = req.query.searchText as string;
        const page = parseInt(req.query.page as string, 10);
        if (searchText && searchText.length > 200) {
            res.send(createResponse("Search text cannot be greater than 200 characters", 200));
        }
        if (page === NaN) {
            res.send(createResponse("A valid numeric page is requried", 200));
        }
        readAllBooksCount(searchText).then((bookCount) => {
            readAllBooks(searchText, page, bookCount).then((books) => {
                res.send(createResponse({
                    books,
                    bookCount,
                }, 200));
            }).catch((err) => {
                res.send(createResponse(err, 500));
            });
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
        const validation = validateBook(book);
        if (!validation.valid) {
            res.send(createResponse(validation.message, 400));
            return;
        }
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