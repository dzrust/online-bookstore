import * as React from "react";
import { Book } from "../../models/book";
import Api from "../api";

type BookListProps = {
    onBookSelected: (book: Book) => void;
}

let timeout: any | null = null;

const BookList: React.FC<BookListProps> = ({onBookSelected}) => {
    const [searchText, setSearchText] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [searchResults, setSearchResults] = React.useState([]);
    const updateSearchText = (searchText: string) => {
        setSearchText(searchText)
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            setError(null);
            const results = await Api.get("http://localhost:8080/book?searchText="+encodeURIComponent(searchText));
            if (results.status !== 200) {
                setError(results.data);
            } else {
                setSearchResults(results.data);
            }
        }, 500);
    }
    return (
        <div>
            Search for book either by isbn, title, or author
            <div>
                <input type="text" value={searchText} onChange={(e) => updateSearchText(e.target.value)} />
            </div>
            <div>
                {
                    searchResults.map((searchResult: Book) => {
                        return (
                            <div key={searchResult.isbn}>
                                <div>{searchResult.isbn}</div>
                                <div>{searchResult.title}</div>
                                <div>{searchResult.author}</div>
                                <div onClick={() => onBookSelected(searchResult)}>View</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BookList;