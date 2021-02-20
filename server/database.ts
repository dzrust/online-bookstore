import * as mysql from "mysql";

export const queryCallback = (error: mysql.MysqlError | null, results: any, resolve:  (results:any) => void, reject: () => void) => {
    if (!error) resolve(results);
    reject();
}

class Database {
    private dbConnection: mysql.Connection;

    public openDatabse = () => {
        this.dbConnection = mysql.createConnection({
            host: "bookstore.c1r50rjcihgr.us-west-2.rds.amazonaws.com",
            user: "admin",
            password: "aUP50yshetLhSBcjXCvW",
            database: "bookstore"
        });
        //this.dbConnection.connect();
    }

    public getConnection () {
        return this.dbConnection;
    }
}

const database = new Database();
database.openDatabse();
export default database;