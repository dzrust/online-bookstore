import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
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
        timeout = setTimeout(() => getBooks(searchText), 500);
    }

    const getBooks = async (searchText: string) => {
        if (searchText === "") {
            setBooks([]);
            return;
        }
        setError(null);
        const results = await Api.get("/book?searchText=" + encodeURIComponent(searchText));
        if (results.status !== 200) {
            setError("Search failed");
        } else {
            setBooks(results.data);
        }
    }

    React.useEffect(() => {
        getBooks(searchText);
    }, [reloadObject]);
    return (
        <Grid>
            <Grid item>
                Search for book either by isbn, title, or author
            </Grid>
            <Grid item>
                <TextField
                    label="Search"
                    variant="outlined"
                    type="text"
                    value={searchText}
                    onChange={(e) => updateSearchText(e.target.value)} />
            </Grid>
            <Grid item>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ISBN</TableCell>
                                <TableCell align="right">Title</TableCell>
                                <TableCell align="right">Author</TableCell>
                                <TableCell align="right">Preview</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book: Book) => (
                                <TableRow key={book.isbn}>
                                    <TableCell component="th" scope="row">
                                        {book.isbn}
                                    </TableCell>
                                    <TableCell align="right">{book.title}</TableCell>
                                    <TableCell align="right">{book.author}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" color="primary" onClick={() => onBookSelected(book)}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}

export default BookList;