import * as React from "react";
import { Book } from "../../models/book";
import Api from "../api";

type BookListProps = {
    books: Book[];
    setBooks: (books: Book[]) => void;
    onBookSelected: (book: Book) => void;
}

let timeout: any | null = null;

const BookList: React.FC<BookListProps> = ({ books, setBooks, onBookSelected }) => {
    const [searchText, setSearchText] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const updateSearchText = (searchText: string) => {
        setSearchText(searchText);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            if (searchText === "") {
                setBooks([]);
                return;
            }
            setError(null);
            const results = await Api.get("http://localhost:8080/book?searchText=" + encodeURIComponent(searchText));
            if (results.status !== 200) {
                setError(results.data);
            } else {
                setBooks(results.data);
            }
        }, 500);
    }
    return (
        <div>
            Search for book either by isbn, title, or author
            <div>
                <input type="text" value={searchText} onChange={(e) => updateSearchText(e.target.value)} />
            </div>
            <div style={{ display: error ? "block" : "none" }}>{error}</div>
            <div className="table">
                {
                    books.map((book: Book) => {
                        return (
                            <div key={book.isbn} className="row">
                                <div className="column">{book.isbn}</div>
                                <div className="column bold">{book.title}</div>
                                <div className="column">{book.author}</div>
                                <button className="column" onClick={() => onBookSelected(book)}>View</button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BookList;