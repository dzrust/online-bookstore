import * as React from "react";
import { Book } from "../../models/book";

const BookFinder: React.FC = () => {
    const [searchText, setSearchText] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    return (
        <div>
            Search for book either by isbn, title, or author
            <div>
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div>
                {
                    searchResults.map((searchResult: Book) => {
                        return (
                            <div key={searchResult.isbn}>
                                <div>{searchResult.isbn}</div>
                                <div>{searchResult.title}</div>
                                <div>{searchResult.author}</div>
                                <div>View</div>
                                <div>Delete</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BookFinder;