import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";
import * as React from "react";

type ConfirmationProps = {
    isOpen: boolean;
    onYes: () => void;
    onNo: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ isOpen, onYes, onNo }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onNo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title"> Are you sure you wish to continue?</DialogTitle>
            <DialogActions>
                <Button onClick={onYes} color="primary">
                    Yes
                </Button>
                <Button onClick={onNo} color="secondary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Confirmation;