import * as React from "react";
import { Book, BookInventory, BookLog } from "../../models/book";
import Api from "../api";
import Confirmation from "../components/confirmation";

type InventoryProps = {
    inventory: BookInventory[];
    book: Book;
    isLoading: boolean;
    setError: (error: string | null) => void;
    loadData: () => Promise<void>;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, book, isLoading, setError, loadData }) => {
    const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isConfirmingDeleteInventory, setIsConfirmingDeleteInventory] = React.useState(false);
    const deleteInventory = (item: BookInventory) => {
        if (isUpdating) return;
        setError(null);
        setIsUpdating(true);
        Api.delete(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}/${encodeURIComponent(item.id)}`).then(
            () => {
                setIsUpdating(false);
                loadData();
            }
        ).catch(() => { setError("Failed to delete inventory"); setIsUpdating(false); });
    }

    const addInventory = () => {
        if (isLoading) return;
        setError(null);
        setIsUpdating(true)
        Api.post(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}`).then(
            () => {
                setIsUpdating(false);
                loadData();
            }
        ).catch(() => { setError("Failed to add inventory"); setIsUpdating(false) });
    }

    const updateInventory = (item: BookInventory) => {
        if (isUpdating) return;
        setError(null);
        setIsUpdating(true);
        Api.put(`http://localhost:8080/inventory/${encodeURIComponent(book.isbn)}/${encodeURIComponent(item.id)}`, {
            ...item,
            checkedIn: !item.checkedIn
        }).then(
            () => {
                setIsUpdating(false);
                loadData();
            }
        ).catch(() => { setError("Failed to update inventory"); setIsUpdating(false) });
    }
    return (
        <div>
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
                                            <button onClick={() => setIsConfirmingDeleteInventory(true)} disabled={isUpdating || isConfirmingDeleteInventory}>Delete</button>
                                        </div>
                                        {isConfirmingDeleteInventory && <Confirmation onYes={() => deleteInventory(item)} onNo={() => setIsConfirmingDeleteInventory(false)} />}
                                    </div>
                                )
                            }) : <div>No Inventory Found</div>
                        }
                    </div>
                ) : null
            }
        </div>
    )
}

export default Inventory;