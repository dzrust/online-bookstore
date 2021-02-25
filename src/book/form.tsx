import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import * as React from "react";
import { Book } from "../../models/book";
import Api from "../api";

type BookFormProps = {
    book?: Book;
    onClose: (reload?: boolean) => void;
    setError: (error: string | null) => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onClose, setError }) => {
    const [formBook, setFormBook] = React.useState(book ?? { isbn: "", title: "", author: "", description: "" });
    const updateBookISBN = (e: React.ChangeEvent<HTMLInputElement>) => setFormBook({ ...formBook, isbn: e.target.value });
    const updateBookTitle = (e: React.ChangeEvent<HTMLInputElement>) => setFormBook({ ...formBook, title: e.target.value });
    const updateBookAuthor = (e: React.ChangeEvent<HTMLInputElement>) => setFormBook({ ...formBook, author: e.target.value });
    const updateBookDescription = (e: React.ChangeEvent<HTMLInputElement>) => setFormBook({ ...formBook, description: e.target.value });

    const submitBookForm = async () => {
        setError(null);
        try {
            const jsonResponse = await (!book ? Api.post("/book", formBook) : Api.put("/book", formBook));
            if (jsonResponse.data && jsonResponse.status === 200) {
                onClose(true);
            } else {
                setError(jsonResponse.data);
            }
        } catch (err) {
            setError(err)
        }
    }
    return (
        <Dialog open={true} onClose={(() => onClose())} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">
                {book ? "Edit Book" : "Add Book"}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <TextField
                            label="ISBN"
                            variant="outlined"
                            type="text"
                            value={formBook.isbn}
                            onChange={updateBookISBN}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Title"
                            variant="outlined"
                            type="text"
                            value={formBook.title}
                            onChange={updateBookTitle}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Author"
                            variant="outlined"
                            type="text"
                            value={formBook.author}
                            onChange={updateBookAuthor}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Description"
                            variant="outlined"
                            type="text"
                            value={formBook.description}
                            onChange={updateBookDescription}
                            multiline
                            fullWidth
                            rows={4}
                            rowsMax={10}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={() => onClose()}>
                    Close
                </Button>
                <Button variant="contained" color="primary" onClick={submitBookForm}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BookForm;