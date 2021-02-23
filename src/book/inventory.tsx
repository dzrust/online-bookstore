import * as React from "react";
import { Accordion, AccordionSummary, Typography, AccordionDetails, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Book, BookInventory } from "../../models/book";
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
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [inventorySelectedToDelete, setInventorySelectedForDelete] = React.useState<BookInventory | null>(null);
    const deleteInventory = () => {
        if (isUpdating) return;
        setError(null);
        setIsUpdating(true);
        const item = { ...inventorySelectedToDelete };
        setInventorySelectedForDelete(null);
        Api.delete(`/inventory/${encodeURIComponent(book.isbn)}/${encodeURIComponent(item.id)}`).then(
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
        Api.post(`/inventory/${encodeURIComponent(book.isbn)}`).then(
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
        Api.put(`/inventory/${encodeURIComponent(book.isbn)}/${encodeURIComponent(item.id)}`, {
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
        <Grid>
            <Grid item>
                <Button onClick={addInventory} disabled={isUpdating || isLoading} variant="contained" color="secondary">
                    Add Inventory
                </Button>
            </Grid>
            <Grid item>
                <Accordion>
                    <AccordionSummary
                        expandIcon={() => <Typography >+</Typography>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Inventory ({inventory.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            isLoading ? (
                                <Typography>Loading Inventory</Typography>
                            ) : null
                        }
                        {!isLoading && inventory.length > 0 ? (<TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell align="right">Check In/Out</TableCell>
                                        <TableCell align="right">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inventory.map((item: BookInventory) =>
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row">
                                                {item.id}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={() => updateInventory(item)} disabled={isUpdating} variant="contained" color="primary" >
                                                    {item.checkedIn ? "Check Out" : "Check In"}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={() => setInventorySelectedForDelete(item)} disabled={isUpdating || inventorySelectedToDelete !== null} variant="contained" color="secondary">
                                                    Delete
                                                    </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        ) : null
                        }
                        {
                            inventory.length === 0 ? (
                                <Typography>No Inventory</Typography>
                            ) : null
                        }
                    </AccordionDetails >
                </Accordion >
            </Grid>

            <Confirmation isOpen={inventorySelectedToDelete !== null} onNo={() => setInventorySelectedForDelete(null)} onYes={deleteInventory} />
        </Grid>

    )
}

export default Inventory;