import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from "@material-ui/core";
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
    const [bookCount, setBookCount] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const updateSearchText = (searchText: string) => {
        setPage(0);
        setIsLoading(true);
        setSearchText(searchText);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => getBooks(searchText, 0), 500);
    }

    const getBooks = async (searchText: string, pageNumber: number) => {
        if (searchText === "") {
            setBooks([]);
            setPage(0);
            setBookCount(0);
            setIsLoading(false);
            return;
        }
        setError(null);
        try {
            const results = await Api.get(`/book?page=${pageNumber}&searchText=${encodeURIComponent(searchText)}`);
            if (results.status !== 200) {
                setError("Search failed");
            } else {
                setBooks(results.data.books);
                setBookCount(results.data.bookCount);
            }
        } catch (err) {
            setError("Failed to get books try again");
        }
        setIsLoading(false);
    }

    const changePage = (_: any, page: number) => {
        setPage(page);
        getBooks(searchText, page);
    }

    React.useEffect(() => {
        getBooks(searchText, page);
    }, [reloadObject]);
    return (
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Typography>
                    Search for book either by isbn, title, or author
                </Typography>
            </Grid>
            <Grid item>
                <TextField
                    label="Search"
                    variant="outlined"
                    type="text"
                    value={searchText}
                    onChange={(e) => updateSearchText(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item>
                {
                    isLoading ? (
                        <Typography>
                            Loading...
                        </Typography>
                    ) : (
                            <Typography>
                                Total Books Found: {bookCount}
                            </Typography>
                        )
                }
            </Grid>
            <Grid item>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell align="right">Author</TableCell>
                                <TableCell align="right">ISBN</TableCell>
                                <TableCell align="right">Preview</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book: Book) => (
                                <TableRow key={book.isbn}>
                                    <TableCell component="th" scope="row">{book.title}</TableCell>
                                    <TableCell align="right">{book.author}</TableCell>
                                    <TableCell align="right">
                                        {book.isbn}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" color="primary" onClick={() => onBookSelected(book)}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[100]}
                                    count={bookCount}
                                    rowsPerPage={100}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={changePage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid >
    )
}

export default BookList;