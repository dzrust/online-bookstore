import * as React from "react";

type ErrorDisplayProps = {
    message: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({message}) => {
    return (
        <div className="error">
            {message}
        </div>
    )
}

export default ErrorDisplay;