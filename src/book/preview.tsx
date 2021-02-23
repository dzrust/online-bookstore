import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, Typography } from "@material-ui/core";
import * as React from "react";
import { Book, BookInventory, BookLog } from "../../models/book";
import { APIResponse } from "../../models/response";
import Api from "../api";
import Confirmation from "../components/confirmation";
import Inventory from "./inventory";
import LogPreview from "./logPreview";

type BookPreviewProps = {
    book: Book;
    setSelectedBook: (book: Book) => void;
    onClose: (reload?: boolean) => void;
    onEdit: () => void;
    setError: (error: string | null) => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ book, onClose, onEdit, setSelectedBook, setError }) => {
    const [logs, setLogs] = React.useState<BookLog[]>([]);
    const [inventory, setInventory] = React.useState<BookInventory[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isConfirmingDeleteBook, setIsConfirmingDeleteBook] = React.useState(false);

    const deleteBook = async () => {
        setIsConfirmingDeleteBook(false);
        if (isLoading) return;
        setError(null);
        setIsLoading(true);
        Api.delete(`/book/${encodeURIComponent(book.isbn)}`).then(
            (result) => {
                setIsLoading(false);
                if (result.status === 200) {
                    onClose(true);
                }
            }
        ).catch(() => { setError("Failed to delete book"); setIsLoading(false) });
    }

    const getBook = () => Api.get(`/book/${encodeURIComponent(book.isbn)}`).then((result: APIResponse) => {
        if (result.status === 200) setSelectedBook(result.data);
    });

    const getLogs = () => Api.get(`/log/${encodeURIComponent(book.isbn)}`).then((result: APIResponse) => {
        if (result.status === 200) setLogs(result.data);
    });


    const getInventory = () => Api.get(`/inventory/${encodeURIComponent(book.isbn)}`).then((result: APIResponse) => {
        if (result.status === 200) setInventory(result.data);
    });

    const loadData = () => {
        setIsLoading(true);
        setError(null);
        return Promise.all([getLogs(), getInventory(), getBook()])
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }

    React.useEffect(() => {
        loadData();
    }, []);

    return (<Dialog open onClose={(() => onClose())} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
            {book.title}
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Typography>ISBN: {book.isbn}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Author(s): {book.author}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Description(s): {book.description}</Typography>

                </Grid>
                <Grid item>
                    <Inventory inventory={inventory} book={book} isLoading={isLoading} setError={setError} loadData={loadData} />

                </Grid>
                <Grid item >
                    <LogPreview logs={logs} isLoading={isLoading} />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color="primary" onClick={onEdit}>Edit</Button>
            <Button variant="contained" color="secondary" onClick={() => setIsConfirmingDeleteBook(true)} disabled={isLoading}>Delete</Button>
            <Button variant="contained" color="secondary" onClick={() => onClose(false)}>Close</Button>
        </DialogActions>
        <Confirmation isOpen={isConfirmingDeleteBook} onNo={() => setIsConfirmingDeleteBook(false)} onYes={deleteBook} />
    </Dialog>
    )
}

export default BookPreview;