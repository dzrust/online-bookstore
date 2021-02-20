import * as React from "react";
import { Book, BookInventory, BookLog } from "../../models/book";
import { APIResponse } from "../../models/response";
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
    const [isLogsOpen, setIsLogsOpen] = React.useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);
    const [fullBook, setFullBook] = React.useState(book);

    const deleteBook = async () => {
        if (isLoading) return;
        setIsLoading(true);
        Api.delete(`http://localhost:8080/book/${encodeURIComponent(book.isbn)}`).then(
            (result) => {
                if (result.status === 200) {
                    onClose(true);
                }
                setIsLoading(false);
            }
        ).catch(() => setIsLoading(false));
    }

    const deleteInventory = (item: BookInventory) => {
        if (isUpdating) return;
        setIsUpdating(true);
        Api.delete(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}/${encodeURIComponent(item.id)}`).then(
            () => {
                setIsUpdating(false);
                loadData();
            }
        ).catch(() => setIsUpdating(false));
    }

    const addInventory = () => {
        if (isLoading) return;
        setIsLoading(true);
        Api.post(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}`).then(
            () => {
                setIsUpdating(false);
                loadData();
            }
        ).catch(() => setIsUpdating(false));
    }

    const updateInventory = (item: BookInventory) => {
        if (isUpdating) return;
        setIsUpdating(true);
        Api.put(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}/${encodeURIComponent(item.id)}`, {
            ...item,
            checkedIn: !item.checkedIn
        }).then(
            () => {
                setIsUpdating(false);
                loadData();
            }
        ).catch(() => setIsUpdating(false));
    }

    const getBook = () => Api.get(`http://localhost:8080/book/${encodeURIComponent(book.isbn)}`).then((result: APIResponse) => {
        if (result.status === 200) setFullBook(result.data);
    });

    const getLogs = () => Api.get(`http://localhost:8080/log/${encodeURIComponent(book.isbn)}`).then((result: APIResponse) => {
        if (result.status === 200) setLogs(result.data);
    });


    const getInventory = () => Api.get(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}`).then((result: APIResponse) => {
        if (result.status === 200) setInventory(result.data);
    });


    const loadData = () => {
        setIsLoading(true)
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
                    <div>Description: {fullBook.description}</div>
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