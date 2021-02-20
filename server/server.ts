import * as express from "express";
import * as mappings from "../pages/server_mapping.json";
import * as path from "path";
import * as bodyParser from "body-parser";
import { setupBookRoutes } from "./book";
import { setupInventoryRoutes } from "./inventory";
import { setupLogRoutes } from "./log";
import { setupReportRoutes } from "./report";
const app = express();
const PORT = 8080;

mappings.mappings.forEach((mapping: any) => {
    // this will look at server_mappings.json and bind each route to a .html page
    app.get(mapping.path, (req: express.Request, res: express.Response) => res.sendFile(path.join(__dirname, "../pages", `${mapping.file}`)));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/scripts/index.js",
    (req: express.Request, res: express.Response) => res.sendFile(path.join(__dirname, "..", "dist/index.js"))
);

setupBookRoutes(app);
setupInventoryRoutes(app);
setupLogRoutes(app);
setupReportRoutes(app);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

