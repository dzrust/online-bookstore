import { createBook } from "./server/book";
import { Book } from "./models/book";
import fetch from "node-fetch";

// This is for easier testing

type GoogleApiResponse = {
    kind: string;
    totalItems: number;
    items: Array<{
        volumeInfo: {
            title: string;
            authors: string[],
            description: string,
            industryIdentifiers: Array<{
                type: string;
                identifier: string;
            }>,
        }
    }>
}

let count = 0;
let max = 0;
(async () => {
    while (count < 1000 || count >= max) {
        const apiResult = await fetch(`https://www.googleapis.com/books/v1/volumes?q=scifi&printType=books&startIndex=${count}&maxResults=40`, {
            method: "GET",
            headers: { 'content-type': 'application/json' }
        });
        const jsonResult: GoogleApiResponse = await apiResult.json();
        max = jsonResult.totalItems;
        if (jsonResult.items) {
            await Promise.all(jsonResult.items.map((item) => {
                if (!item || !item.volumeInfo || !item.volumeInfo) return Promise.resolve();
                if (!item.volumeInfo.industryIdentifiers || item.volumeInfo.industryIdentifiers.length < 1) return Promise.resolve();
                if (!item.volumeInfo.authors || item.volumeInfo.authors.length < 1) return Promise.resolve();
                if (!item.volumeInfo.title) return Promise.resolve();
                let authors = "";
                item.volumeInfo.authors.forEach((author: any) => authors += author + "; ");
                const book: Book = {
                    isbn: item.volumeInfo.industryIdentifiers[0].identifier,
                    author: authors.trim(),
                    title: item.volumeInfo.title,
                    description: item.volumeInfo.description,
                }
                return new Promise((resolve) => createBook(book).then(resolve).catch((err) => {
                    console.log(err);
                    resolve(err);
                }));

            }));
        }
        count += 40;
        console.log("Processed: ", count);
    }
    console.log("Done! Exit with ctlr+c");
})();