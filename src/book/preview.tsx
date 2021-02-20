import * as React from "react";
import { Book } from "../../models/book";

type BookPreviewProps = {
    book: Book;
}

const BookPreview: React.FC<BookPreviewProps> = ({book}) => {
    return (
        <div>
            ISBN: {book.isbn}
            Title: {book.title}
            Author: {book.author}
            Description: {book.description}
            <button>Edit</button>
            <button>Delete</button>
            <button>Check out</button>
            <button>Check in</button>
            <button>View Logs</button>
            <button>Add Inventory</button>
        </div>
    )
}

export default BookPreview;