import type { Repository } from "@/database/Repository";
import { UserDomain, type UserDto } from "../User";
import { SqliteDriver } from "@/database/SqliteDriver";
import type { DatabaseActions } from "@/database/DatabaseActions";
import { randomUUID } from "node:crypto";
import { EntityNotFoundError } from "@/server/helper/Error";

/**
 * Repository implementation for managing User entities using SQLite.
 */
export class SqliteUserRepository implements Repository<UserDto, UserDomain> {
  private sqliteDriver: SqliteDriver;

  /**
   * Creates an instance of SqliteUserRepository.
   * @param databaseDriver - The database driver implementing DatabaseActions.
   * @throws {Error} If the provided database driver is not an instance of SqliteDriver.
   */
  constructor(databaseDriver: DatabaseActions) {
    if (!(databaseDriver instanceof SqliteDriver)) {
      throw new Error(
        `Invalid database driver, expected SqliteDriver, received: ${typeof databaseDriver}`,
      );
    }

    this.sqliteDriver = databaseDriver;
  }

  /**
   * Creates a new user in the database.
   * @param entity - Partial user data to create a new user.
   * @returns The created UserDomain instance.
   * @throws Will throw an error if the creation fails.
   */
  async create(entity: Partial<UserDto>): Promise<UserDomain> {
    try {
      const { id, ...entityPayload } = entity;
      const entityId = randomUUID();

      const columns = ['id', ...Object.keys(entityPayload)];
      const placeholders = columns.map(() => '?').join(', ');
      const values = [entityId, ...Object.values(entityPayload)];

      const query = `
      INSERT INTO users (${columns.join(', ')})
      VALUES (${placeholders})
    `;

      await this.sqliteDriver.query(query, values);

      // * Libreria para crear objetos dinámicos de un constructor
      return new UserDomain(
        entityId,
        entityPayload.name ?? "not defined",
        entityPayload.age ?? 0,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Updates an existing user in the database.
   * @param dto - User data to update.
   * @returns The updated UserDomain instance.
   * @throws {Error} If no ID is provided, no fields to update, or the update fails.
   * @throws {EntityNotFoundError} If the user does not exist.
   */
  async update(dto: UserDto): Promise<UserDomain> {
    if (!dto.id) throw new Error("No id provided");

    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(dto)) {
      if (key === "id" || value === undefined) continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) throw new Error("No fields to update");

    // Verificar si el usuario existe
    const selectQuery = `
    SELECT id, name, age
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
    const user = await this.sqliteDriver.query(selectQuery, [dto.id]);
    if (!user) {
      throw new EntityNotFoundError(["User", dto.id]);
    }

    const updateQuery = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ?
  `;
    await this.sqliteDriver.query(updateQuery, [...values, dto.id]);

    // Obtener el usuario actualizado
    const result = await this.sqliteDriver.query(selectQuery, [dto.id]);
    if (!result) {
      throw new Error(`Failed to update user with id ${dto.id}`);
    }
    // ! Validar que es result
    return new UserDomain(result.id, result.name, result.age);
  }

  /**
   * Deletes a user from the database.
   * @param id - The ID of the user to delete.
   * @returns The deleted UserDomain instance.
   * @throws {EntityNotFoundError} If the user does not exist.
   */
  async delete(id: string): Promise<UserDomain> {
    // Verificar si el usuario existe
    const selectQuery = `
      SELECT id, name, age
      FROM users
      WHERE id = ?
      LIMIT 1
    `;
    const user = await this.sqliteDriver.query(selectQuery, [id]);
    if (!user) {
      throw new EntityNotFoundError(["User", id]);
    }

    // Eliminar el usuario
    const deleteQuery = `
      DELETE FROM users
      WHERE id = ?
    `;
    await this.sqliteDriver.query(deleteQuery, [id]);

    // Retornar el usuario eliminado
    return new UserDomain(user.id, user.name, user.age);
  }

  /**
  * Finds users matching the specified properties.
  * @param properties - A record of properties to filter users.
  * @returns An array of matching UserDomain instances.
  * @throws {Error} If no properties are provided.
  */
  async find(properties: Record<string, unknown>): Promise<UserDomain[]> {
    const keys = Object.keys(properties);
    const values = Object.values(properties);

    if (keys.length === 0) {
      throw new Error("No properties provided");
    }

    const whereClauses = keys.map((key) => `${key} = ?`).join(" AND ");

    const query = `
      SELECT id, name, age
      FROM users
      WHERE ${whereClauses}
    `;

    const results = await this.sqliteDriver.query(query, values);

    if (Array.isArray(results)) {
      return results.map((row) => new UserDomain(row.id, row.name, row.age));
    } if (results) {
      // Si solo se retorna un resultado
      return [new UserDomain(results.id, results.name, results.age)];
    }

    return [];
  }

  /**
   * Finds a single user matching the specified properties.
   * @param properties - A record of properties to filter the user.
   * @returns The matching UserDomain instance or null if not found.
   * @throws {Error} If no properties are provided.
   */
  async findOne(properties: Record<string, unknown>): Promise<UserDomain | null> {
    const keys = Object.keys(properties);
    const values = Object.values(properties);

    if (keys.length === 0) {
      throw new Error("No properties provided");
    }

    const whereClauses = keys.map((key) => `${key} = ?`).join(" AND ");

    const query = `
      SELECT id, name, age
      FROM users
      WHERE ${whereClauses}
      LIMIT 1
    `;

    const result = await this.sqliteDriver.query(query, values);
    if (result) {
      return new UserDomain(result.id, result.name, result.age);
    }
    return null;
  }

  /**
   * Retrieves all users from the database.
   * @returns An array of all UserDomain instances.
   */
  async findAll(): Promise<UserDomain[]> {
    const query = `
      SELECT id, name, age
      FROM users
    `;

    const results = await this.sqliteDriver.query(query, []);
    if (Array.isArray(results)) {
      return results.map((row) => new UserDomain(row.id, row.name, row.age));
    }
    return [];
  }

}