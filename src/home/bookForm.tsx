import * as React from "react";
import { Book } from "../../models/book";

type BookFormProps = {
    book?: Book;
    onClose: () => void;
}

const BookForm: React.FC<BookFormProps> = (props) => {
    const [formBook, setFormBook] = React.useState(props.book ?? { isbn: "", title: "", author: "", description: "" });
    const [error, setError] = React.useState(null);
    const updateBookISBN = (isbn: string) => setFormBook({ ...formBook, isbn });
    const updateBookTitle = (title: string) => setFormBook({ ...formBook, title });
    const updateBookAuthor = (author: string) => setFormBook({ ...formBook, author });
    const updateBookDescription = (description: string) => setFormBook({ ...formBook, description });

    const submitBookForm = async () => {
        setError(null);
        try {
            const response = await fetch("http://localhost:8080/book", {
                body: JSON.stringify(formBook),
                headers: new Headers({ 'content-type': 'application/json' }),
                mode: "cors",
                method: props.book ? "PUT" : "POST"
            });
            const jsonResponse = await response.json();
            if (jsonResponse.data && jsonResponse.status === 200) {
                props.onClose();
            } else {
                setError(jsonResponse.data);
            }
        } catch (err) {
            setError(err)
        }
    }
    return (
        <div>
            <h1>Book Form</h1>
            <div style={{ display: error ? "block" : "none" }}>
                Error occurred
            </div>
            <div>
                <div>Book ISBN:</div>
                <input type="text" value={formBook.isbn} onChange={(e) => updateBookISBN(e.target.value)} maxLength={20} />
            </div>
            <div>
                <div>Book Title:</div>
                <input type="text" value={formBook.title} onChange={(e) => updateBookTitle(e.target.value)} maxLength={200} />
            </div>
            <div>
                <div>Book Author:</div>
                <input type="text" value={formBook.author} onChange={(e) => updateBookAuthor(e.target.value)} maxLength={200} />
            </div>
            <div>
                <div>Book Description:</div>
                <input type="text" value={formBook.description} onChange={(e) => updateBookDescription(e.target.value)} />
            </div>
            <div onClick={submitBookForm}>
                Submit
            </div>
        </div>
    )
}

export default BookForm;