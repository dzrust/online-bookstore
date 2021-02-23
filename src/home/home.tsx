import { Container, Button, Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { Book } from "../../models/book";
import BookForm from "../book/form";
import BookList from "../book/list";
import BookPreview from "../book/preview";
import ErrorDisplay from "../components/error";

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
        <Container maxWidth="md">
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Typography variant="h2">
                        Book Sm4rt!
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setModalOpen(VIEWS.FORM)} style={{ marginRight: "10px" }}>
                        Add Book
                    </Button>
                    <Button variant="contained" color="primary" href="/report" target="_blank">
                        Inventory Report
                    </Button>
                </Grid>
                <Grid item>
                    <BookList onBookSelected={selectBook} reloadObject={reloadObject} setError={setError} />
                </Grid>
            </Grid>
            {
                renderModal()
            }
            {
                error && <ErrorDisplay message={error} onClose={() => setError(null)} />
            }
        </Container>
    )
}

export default Home;