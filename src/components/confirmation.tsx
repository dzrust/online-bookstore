import * as React from "react";

type ConfirmationProps = {
    onYes: () => void;
    onNo: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({onYes, onNo}) => {
    return (
        <div className="confirmation modal">
            <div>
                Are you sure you wish to continue?
            </div>
            <div>
                <button onClick={onYes}>Yes</button>
                <button onClick={onNo}>No</button>
            </div>
        </div>
    )
}

export default Confirmation;