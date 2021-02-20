import * as React from "react";
import { Book } from "../../models/book";
import BookForm from "../book/form";
import BookList from "../book/list";
import BookPreview from "../book/preview";
import "../styles.css";
import InventoryReport from "./inventoryReport";

enum VIEWS {
    LIST,
    PREVIEW,
    FORM,
    INVENTORY
}

const Home: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState<VIEWS | null>(null);
    const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
    const selectBook = (book: Book) => {
        setModalOpen(VIEWS.PREVIEW);
        setSelectedBook(book);
    }
    const renderModal = () => {
        switch (modalOpen) {
            case VIEWS.LIST: return <BookList onBookSelected={selectBook} />;
            case VIEWS.PREVIEW: return selectedBook && <BookPreview book={selectedBook} />;
            case VIEWS.FORM: return <BookForm onClose={() => setModalOpen(null)} />;
            case VIEWS.INVENTORY: return <InventoryReport />;
            default: return null;
        }
    }
    return (
        <div>
            Welcome to your online bookstore manager!
            <div>
                <button onClick={() => setModalOpen(VIEWS.FORM)}>Add new book</button>
                <button onClick={() => setModalOpen(VIEWS.LIST)}>Find Book</button>
                <button onClick={() => setModalOpen(VIEWS.INVENTORY)}>Run inventory report</button>
            </div>
            {
                renderModal()
            }
        </div>
    )
}

export default Home;