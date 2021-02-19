import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home/Home";

const bootstrapApp = (location: string) => {
    switch(location) {
        case "HOME": {
            ReactDOM.render(<Home />, document.getElementById("app"))
        } break;
    }
};

(window as any).bootstrapApp = bootstrapApp;
