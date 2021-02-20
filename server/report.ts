import * as express from "express"
import database, { queryCallback } from "./database";
import { createResponse } from "./response";


export const createCSVReport = async (): Promise<string> => {
    let csv = "isbn,inventoryId,title,author,checkedIn\n"
    try {
        const booksResult: any[] = await new Promise((resolve, reject) => {
            database.getConnection().query(
                "CALL read_book_report();", (error, results) => {
                    queryCallback(error, results, resolve, reject);
                });
        });
        booksResult.forEach((result: any) => {
            csv += `${result.isbn},${result.id},${result.title},${result.author},${result.checkedIn ? "Y" : "N"}\n`
        });
    } catch (err) {
        console.log(err)
    }
    return csv;
}

export const setupReportRoutes = (app: express.Application) => {
    app.get("/report", (req: express.Request, res: express.Response) => {
        createCSVReport().then(report => {
            res.header("Content-Type", "text/csv");
            res.attachment(`${Date.now()}_report.csv`);
            return res.send(report);
        }).catch((err) => {
            res.send(createResponse(err, 500));
        });
    });
}