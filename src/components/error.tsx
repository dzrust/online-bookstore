import { Snackbar } from "@material-ui/core";
import * as React from "react";

type ErrorDisplayProps = {
    message: string
    onClose: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            open
            autoHideDuration={6000}
            onClose={onClose}
            message={message}
        />
    )
}

export default ErrorDisplay;