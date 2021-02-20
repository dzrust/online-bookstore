import * as React from "react";
import { Book } from "../../models/book";
import BookForm from "../book/form";
import BookList from "../book/list";
import BookPreview from "../book/preview";
import ErrorDisplay from "../components/error";
import "../styles.css";

enum VIEWS {
    LIST,
    PREVIEW,
    FORM
}

const Home: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState<VIEWS | null>(null);
    const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [reloadObject, setReloadObject] = React.useState({});
    const selectBook = (book: Book) => {
        setModalOpen(VIEWS.PREVIEW);
        setSelectedBook(book);
    }
    const closeModal = (reload?: boolean) => {
        setModalOpen(null);
        setSelectedBook(null);
        if (reload) {
            setReloadObject({});
        }
    }
    const renderModal = () => {
        switch (modalOpen) {
            case VIEWS.PREVIEW: return selectedBook && <BookPreview book={selectedBook} onClose={closeModal} onEdit={() => setModalOpen(VIEWS.FORM)} setSelectedBook={setSelectedBook} setError={setError} />;
            case VIEWS.FORM: return <BookForm onClose={closeModal} book={selectedBook ?? undefined} setError={setError} />;
            default: return null;
        }
    }
    return (
        <div className="home">
            <div className="home-container">
                <div className="home-header">
                    <h1>Book Sm4rt!</h1>
                    <div className="home-header-btns">
                        <button onClick={() => setModalOpen(VIEWS.FORM)}>Add Book</button>
                        <a href="/report" target="_blank">Inventory Report</a>
                    </div>
                </div>
                <div className="home-content">
                    <BookList onBookSelected={selectBook} reloadObject={reloadObject} setError={setError} />
                </div>
            </div>
            {
                renderModal()
            }
            {
                error && <ErrorDisplay message={error}/>
            }
        </div>
    )
}

export default Home;