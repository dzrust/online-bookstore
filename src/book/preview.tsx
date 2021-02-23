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
                if (result.status === 200) {
                    onClose(true);
                }
                setIsLoading(false);
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

    return (
        <div className="modal">
            <div className="preview">
                <div className="preview-header">
                    Title: <div className="bold">{book.title}</div>
                </div>
                <div className="preview-body">
                    <div>ISBN: {book.isbn}</div>
                    <div>Author: {book.author}</div>
                    <div>Description: {book.description}</div>
                    <Inventory inventory={inventory} book={book} isLoading={isLoading} setError={setError} loadData={loadData} />
                    <LogPreview logs={logs} isLoading={isLoading} />

                </div>

                <div className="preview-footer">
                    <button onClick={onEdit}>Edit</button>
                    <button onClick={() => setIsConfirmingDeleteBook(true)} disabled={isLoading}>Delete</button>
                    <button onClick={() => onClose(false)}>Close</button>
                </div>
            </div>
            {
                isConfirmingDeleteBook && <Confirmation onNo={() => setIsConfirmingDeleteBook(false)} onYes={deleteBook} />
            }
        </div>
    )
}

export default BookPreview;