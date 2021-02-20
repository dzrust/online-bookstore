import * as React from "react";
import "../styles.css";
import BookFinder from "./bookFinder";
import BookForm from "./bookForm";
import InventoryReport from "./inventoryReport";

const Home: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState<string | null>(null);
    const renderModal = () => {
        switch (modalOpen) {
            case "FINDER": return <BookFinder />;
            case "FORM": return <BookForm onClose={() => setModalOpen(null)} />;
            case "INVENTORY": return <InventoryReport />;
            default: return null;
        }
    }
    return (
        <div>
            Welcome to your online bookstore manager!
            <div>
                <button onClick={() => setModalOpen("FORM")}>Add new book</button>
                <button onClick={() => setModalOpen("FINDER")}>Find Book</button>
                <button onClick={() => setModalOpen("INVENTORY")}>Run inventory report</button>
            </div>
            {
                renderModal()
            }
        </div>
    )
}

export default Home;