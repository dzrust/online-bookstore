import * as React from "react";
import "../styles.css";

const Home: React.FC = () => {
    return (
        <div>
            Welcome to your online bookstore manager!
            <div>
                <button>Add new book</button>
                <button>Find Book</button>
                <button>Run inventory report</button>
            </div>
        </div>
    )
}

export default Home;