import * as mysql from "mysql";

export const queryCallback = (error: mysql.MysqlError | null, results: any, resolve: (results: any) => void, reject: (error: mysql.MysqlError | null) => void) => {
    if (!error) {
        resolve(results[0]);
    } else {
        reject(error);
    }
}

class Database {
    private dbConnectionPool: mysql.Pool;

    public openDatabase = () => {
        try {
            this.dbConnectionPool = mysql.createPool({
                connectionLimit: 50,
                host: process.env.DB_HOSTNAME ?? "localhost",
                user: "root",
                password: "password",
                database: "bookstore"
            });
        } catch (err) {
            console.log("Failed to connect to DB");
            setTimeout(this.openDatabase, 5000);
        }
    }

    public getConnection()  {
        return this.dbConnectionPool;
    }
}

const database = new Database();
database.openDatabase();
export default database;