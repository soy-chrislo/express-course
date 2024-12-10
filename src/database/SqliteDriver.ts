import type { DatabaseActions } from "./DatabaseActions.ts";
import { Database, type RunResult } from "sqlite3";

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
    const sql = query.trim().toLowerCase();

    /**
     * Todos se pueden usar para cualquier propósito pero las respuestas son diferentes.
     */
    return new Promise((resolve, reject) => {
      if (sql.startsWith("select")) {
        if (sql.includes("limit 1")) {
          // * Un solo objeto o `undefined`. (SELECT ... LIMIT 1)
          /**
           * Si no se usa LIMIT 1 (explicitamente), retorna solo el primer objeto.
           */
          this.db.get(query, values, (err, row) => {
            if (err) {
              console.error("Error running query:", err);
              return reject(err);
            }
            resolve(row);
          });
        } else {
          // * Array de objetos o vacío. (SELECT ...)
          this.db.all(query, values, (err, rows) => {
            if (err) {
              console.error("Error running query:", err);
              return reject(err);
            }
            resolve(rows);
          });
        }
      } else {
        // * Ningún dato devuelto; solo estado. (INSERT, UPDATE, DELETE, CREATE TABLE)
        /**
         * Si se usa SELECT, no retornará nada.
         */
        this.db.run(query, values, function (this: RunResult, err: Error) {
          if (err) {
            console.error("Error running query:", err);
            return reject(err);
          }
          resolve({
            lastID: this.lastID,
            changes: this.changes,
          });
        });
      }
    });
  }

  async setup(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        password TEXT NOT NULL
      )
    `;
    await this.query(query, []);
  }
}
