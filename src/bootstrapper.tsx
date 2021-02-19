import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./home/home";

const bootstrapApp = (location: string) => {
    switch(location) {
        case "HOME": {
            ReactDOM.render(<Home />, document.getElementById("app"))
        } break;
    }
};

(window as any).bootstrapApp = bootstrapApp;
