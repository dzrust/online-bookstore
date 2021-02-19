import * as mysql from "mysql";

export const queryCallback = (error, results, resolve, reject) => {
    if (!error) resolve(results);
    reject();
}

class Database {
    private dbConnection: mysql.Connection;

    public openDatabse = () => {
        this.dbConnection = mysql.createConnection({
            host: 'localhost',
            user: 'me',
            password: 'secret',
            database: 'my_db'
        });
        this.dbConnection.connect();
    }

    public getConnection () {
        return this.dbConnection;
    }
}

const database = new Database();
database.openDatabse();
export default database;