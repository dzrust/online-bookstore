import * as React from "react";
import { Book } from "../../models/book";

type BookPreviewProps = {
    book: Book;
    onClose: () => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ book, onClose }) => {
    return (
        <div className="modal">
            <div className="preview">
                <div className="preview-header">
                    Title: <div className="bold">{book.title}</div>
                </div>
                <div className="preview-body">
                    <div>ISBN: {book.isbn}</div>
                    <div>Author: {book.author}</div>
                    <div>Description: {book.description}</div>
                </div>
                <div className="preview-footer">
                    <button>Edit</button>
                    <button>Delete</button>
                    <button>Check out</button>
                    <button>Check in</button>
                    <button>View Logs</button>
                    <button>Add Inventory</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default BookPreview;