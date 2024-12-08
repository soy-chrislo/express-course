import type { DatabaseActions } from "./DatabaseActions.ts";
import { Database } from "sqlite3";

export class SqliteDriver implements DatabaseActions {
  private db: Database;
  private dbPath: string;

  constructor() {
    this.dbPath = "./db.sqlite";
    this.db = new Database(this.dbPath, (err) => {
      if (err) {
        console.error("Error opening database", err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    }
    );
  }

  async connect(): Promise<void> {
    console.warn("SQLite does not require a connection.");
  }

  async disconnect(): Promise<void> {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing the database", err.message);
      } else {
        console.log("Closed the database connection.");
      }
    });
  }

  async query(query: string, values: unknown[]): Promise<unknown> {
    const isSelect = query.trim().toLowerCase().startsWith("select");

    if (isSelect) {
      this.db.all(query, values, (err, rows) => {
        if (err) {
          console.error("Error running the query", err.message);
          return err;
        }
        return rows;
      })
    }

    this.db.run(query, values, (error) => {
      if (error) {
        console.error("Error running the query", error.message);
        return error;
      }
      console.log("Query executed successfully.");
      return null;
    })
    return null;
  }

  async setup(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
      )
    `;
    await this.query(query, []);
  }
}
