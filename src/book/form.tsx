import * as React from "react";
import { Book } from "../../models/book";
import Api from "../api";

type BookFormProps = {
    book?: Book;
    onClose: () => void;
    setError: (error: string | null) => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onClose, setError }) => {
    const [formBook, setFormBook] = React.useState(book ?? { isbn: "", title: "", author: "", description: "" });
    const updateBookISBN = (isbn: string) => setFormBook({ ...formBook, isbn });
    const updateBookTitle = (title: string) => setFormBook({ ...formBook, title });
    const updateBookAuthor = (author: string) => setFormBook({ ...formBook, author });
    const updateBookDescription = (description: string) => setFormBook({ ...formBook, description });

    const submitBookForm = async () => {
        setError(null);
        try {
            const jsonResponse = await (!book ? Api.post("http://localhost:8080/book", formBook) : Api.put("http://localhost:8080/book", formBook));
            if (jsonResponse.data && jsonResponse.status === 200) {
                onClose();
            } else {
                setError(jsonResponse.data);
            }
        } catch (err) {
            setError(err)
        }
    }
    return (
        <div className="modal">
            <h1>Book Form</h1>
            <div>
                <label>Book ISBN:</label>
                <input type="text" value={formBook.isbn} onChange={(e) => updateBookISBN(e.target.value)} maxLength={20} />
            </div>
            <div>
                <label>Book Title:</label>
                <input type="text" value={formBook.title} onChange={(e) => updateBookTitle(e.target.value)} maxLength={200} />
            </div>
            <div>
                <label>Book Author:</label>
                <input type="text" value={formBook.author} onChange={(e) => updateBookAuthor(e.target.value)} maxLength={200} />
            </div>
            <div>
                <label>Book Description:</label>
                <input type="text" value={formBook.description} onChange={(e) => updateBookDescription(e.target.value)} />
            </div>
            <div>
                <button onClick={submitBookForm}>
                    Submit
                </button>
                <button onClick={() => onClose()}>
                    Close
                </button>
            </div>

        </div>
    )
}

export default BookForm;