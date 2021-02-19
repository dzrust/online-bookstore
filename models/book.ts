export type Book = {
    isbn: string; // effectively id
    title: string;
    author: string;
    description: string;
}

export type BookInventory = {
    id: string
    checkedIn: boolean;
}

export type BookLog = {
    id: string;
    dateTime: Date;
    message: string;
}

export type Bookstore = {
    books: Book[];
    inventory: Map<string, BookInventory[]>; // map isbn -> inventory
    logs: Map<string, BookLog[]>; // map isbn -> log
}