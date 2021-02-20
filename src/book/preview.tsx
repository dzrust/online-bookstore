import * as React from "react";
import { Book, BookInventory, BookLog } from "../../models/book";
import Api from "../api";

type BookPreviewProps = {
    book: Book;
    onClose: (reload?: boolean) => void;
    onEdit: () => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ book, onClose, onEdit }) => {
    const [logs, setLogs] = React.useState<BookLog[]>([]);
    const [inventory, setInventory] = React.useState<BookInventory[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const [isLogsOpen, setIsLogsOpen] = React.useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);

    const deleteBook = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await Api.delete(`http://localhost:8080/book/${encodeURIComponent(book.isbn)}`);
            if (result.status === 200 && isMounted) onClose(true);
        } catch (err) { }
        setIsLoading(false);
    }

    const deleteInventory = async (item: BookInventory) => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            const result = await Api.delete(`http://localhost:8080/inventory/${encodeURIComponent(item.id)}`);
            if (result.status === 200 && isMounted) await loadData();
        } catch (err) { }
        setIsUpdating(false);
    }

    const addInventory = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await Api.post(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}`);
            if (result.status === 200 && isMounted) await loadData();
        } catch (err) { }
        setIsLoading(false);
    }

    const updateInventory = async (item: BookInventory) => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            const result = await Api.delete(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}`, {
                ...item,
                checkedIn: !item.checkedIn
            });
            if (result.status === 200 && isMounted) await loadData();
        } catch (err) { }
        setIsUpdating(false);
    }

    const getLogs = async () => {
        const result = await Api.get(`http://localhost:8080/log/${encodeURIComponent(book.isbn)}`);
        if (result.status === 200 && isMounted) setLogs(result.data);
    }

    const getInventory = async () => {
        const result = await Api.get(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}`);
        if (result.status === 200 && isMounted) setInventory(result.data);
    }

    const loadData = () => Promise.all([getLogs(), getInventory()]); 
    React.useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
        loadData().then(() => setIsLoading(false)).catch(() => setIsLoading(false));
        return () => setIsMounted(false);
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
                    <div onClick={() => setIsInventoryOpen(!isInventoryOpen)}>
                        Inventory ({inventory.length}) {isInventoryOpen ? "-" : "O"}
                        <button onClick={addInventory} disabled={isLoading || isUpdating}>Add Inventory</button>
                    </div>
                    {
                        isInventoryOpen && !isLoading ? (
                            <div className="table">
                                {
                                    inventory.length > 0 ? inventory.map((item: BookInventory) => {
                                        return (
                                            <div key={item.id} className="row">
                                                <div className="column bold">{item.id}</div>
                                                <div className="column">
                                                    <button onClick={() => updateInventory(item)} disabled={isUpdating}>
                                                        {item.checkedIn ? "Check Out" : "Check In"}
                                                    </button>
                                                </div>
                                                <div className="column">
                                                    <button onClick={() => deleteInventory(item)} disabled={isUpdating}>Delete</button>
                                                </div>
                                            </div>
                                        )
                                    }) : <div>No Inventory Found</div>
                                }
                            </div>
                        ) : null
                    }
                    <div onClick={() => setIsLogsOpen(!isLogsOpen)}>
                        Logs {isLogsOpen ? "-" : "O"}
                    </div>
                    {
                        isLogsOpen && !isLoading ? (
                            <div className="table">
                                {
                                    logs.map((log: BookLog) => {
                                        return (
                                            <div key={log.id} className="row">
                                                <div className="column bold">{log.dateTime}</div>
                                                <div className="column">{log.message}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ) : null
                    }
                </div>

                <div className="preview-footer">
                    <button onClick={onEdit}>Edit</button>
                    <button onClick={deleteBook} disabled={isLoading}>Delete</button>
                    <button onClick={() => onClose(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default BookPreview;