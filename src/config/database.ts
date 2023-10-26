import { Collection, Db, MongoClient } from "mongodb";
import { promiseHandler } from "../api/helpers/promiseHandler";
import { ErrorResponse } from "../api/utils/ErrorResponse";

export class Database {

    #databaseName: string = process.env.DB_NAME;
    #username: string = process.env.DB_USERNAME;
    #password: string = process.env.DB_PASSWORD;

    #connectionString: string = process.env.CONNECTION_STRING
        .replace('{{USERNAME}}', this.#username)
        .replace('{{PASSWORD}}', this.#password)
        .replace('{{NAME}}', this.#databaseName);

    #client = new MongoClient(this.#connectionString);

    #db: Db;

    static #instance: Database;

    static get(): Database {
        if (!this.#instance) {
            this.#instance = new Database();
        }
        return this.#instance;
    }

    private constructor() {
        this.#client = new MongoClient(this.#connectionString);
        this.#db = this.#client.db();
        this.#connectDatabase();
    }

    #connectDatabase = async () => {
        const { result, error } = await promiseHandler(this.#client.connect()); 
        if (error) {
            return new ErrorResponse('Database connection failed', 500);
        }
        console.log(`Database connection was creaated successfully! db: ${result.options.dbName}`);
    }
    
    getCollection = (collection: string): Collection<any> => this.#db.collection(collection);
}
