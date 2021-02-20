import * as mysql from "mysql";

export const queryCallback = (error: mysql.MysqlError | null, results: any, resolve: (results: any) => void, reject: () => void) => {
    if (!error) {
        resolve(results);
    } else {
        reject();
    }
}

class Database {
    private dbConnection: mysql.Connection;

    public openDatabase = () => {
        try {
            this.dbConnection = mysql.createConnection({
                //host: "online-bookstore_database_1.online-bookstore_default",
                host: "localhost",
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