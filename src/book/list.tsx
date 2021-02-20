import * as React from "react";
import { Book } from "../../models/book";
import Api from "../api";

type BookListProps = {
    reloadObject: object
    onBookSelected: (book: Book) => void;
    setError: (error: string | null) => void;
}

let timeout: any | null = null;

const BookList: React.FC<BookListProps> = ({ reloadObject, onBookSelected, setError }) => {
    const [searchText, setSearchText] = React.useState("");
    const [books, setBooks] = React.useState<Book[]>([]);
    const updateSearchText = (searchText: string) => {
        setSearchText(searchText);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(getBooks, 500);
    }

    const getBooks = async () => {
        if (searchText === "") {
            setBooks([]);
            return;
        }
        setError(null);
        const results = await Api.get("http://localhost:8080/book?searchText=" + encodeURIComponent(searchText));
        if (results.status !== 200) {
            setError("Search failed");
        } else {
            setBooks(results.data);
        }
    }

    React.useEffect(() => {
        getBooks();
    }, [reloadObject]);
    return (
        <div>
            Search for book either by isbn, title, or author
            <div>
                <input type="text" value={searchText} onChange={(e) => updateSearchText(e.target.value)} />
            </div>
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