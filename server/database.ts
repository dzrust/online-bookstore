import * as mysql from "mysql";

export const queryCallback = (error: mysql.MysqlError | null, results: any, resolve: (results: any) => void, reject: (error: mysql.MysqlError | null) => void) => {
    if (!error) {
        resolve(results[0]);
    } else {
        reject(error);
    }
}

class Database {
    private dbConnection: mysql.Connection;

    public openDatabase = () => {
        try {
            this.dbConnection = mysql.createConnection({
                host: process.env.DB_HOSTNAME ?? "localhost",
                user: "root",
                password: "password",
                database: "bookstore"
            });
            this.dbConnection.connect((err) => {
                if (err) {
                    console.log("Failed to connect to DB");
                    setTimeout(this.openDatabase, 5000);
                    return;
                }

                console.log('connected as id ' + this.dbConnection.threadId);
            });
        } catch (err) {
            console.log("Failed to connect to DB");
            setTimeout(this.openDatabase, 5000);
        }
    }

    public getConnection() {
        return this.dbConnection;
    }
}

const database = new Database();
database.openDatabase();
export default database;