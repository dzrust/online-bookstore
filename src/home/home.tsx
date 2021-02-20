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
    const [books, setBooks] = React.useState<Book[]>([]);
    const selectBook = (book: Book) => {
        setModalOpen(VIEWS.PREVIEW);
        setSelectedBook(book);
    }
    const closeModal = (reload?: boolean) => {
        setModalOpen(null);
        setSelectedBook(null);
        if (reload) {
            setBooks([]);
        }
    }
    const renderModal = () => {
        switch (modalOpen) {
            case VIEWS.PREVIEW: return selectedBook && <BookPreview book={selectedBook} onClose={closeModal} onEdit={() => setModalOpen(VIEWS.FORM)} />;
            case VIEWS.FORM: return <BookForm onClose={closeModal} book={selectedBook ?? undefined} />;
            case VIEWS.INVENTORY: return <InventoryReport />;
            default: return null;
        }
    }
    return (
        <div className="home">
            <div className="home-container">
                <div className="home-header">
                    <h3>Welcome to your online bookstore manager!</h3>
                    <div className="home-header-btns">
                        <button onClick={() => setModalOpen(VIEWS.FORM)}>Add Book</button>
                        <button onClick={() => setModalOpen(VIEWS.INVENTORY)}>Inventory Report</button>
                    </div>
                </div>
                <div className="home-content">
                    <BookList onBookSelected={selectBook} books={books} setBooks={setBooks} />
                </div>
            </div>
            {
                renderModal()
            }
        </div>
    )
}

export default Home;