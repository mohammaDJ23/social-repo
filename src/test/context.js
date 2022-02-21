const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");
const pool = require("../pool");

const DEFAULT_OPTS = {
  host: "localhost",
  port: 5432,
  database: "socialnetwork-test",
  user: "postgres",
  password: "fsiFJOIDW23493854"
};

class Context {
  constructor(roleName) {
    this.roleName = roleName;
  }

  static async build() {
    // randomly generating a role name to connect to PG as
    // notice postgres can't accept a name with a number as starting a character

    const roleName = "a" + randomBytes(4).toString("hex");

    // connect to PG as usual

    await pool.connect(DEFAULT_OPTS);

    // create a new role

    await pool.query(format(`CREATE ROLE %I WITH LOGIN PASSWORD %L;`, roleName, roleName));

    // create a schema with the same name

    await pool.query(format(`CREATE SCHEMA %I AUTHORIZATION %I;`, roleName, roleName));

    // disconnect entirely from PG

    await pool.colse();

    // run our migrations in the new schema

    await migrate({
      schema: roleName,
      direction: "up",
      log: function () {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        database: "socialnetwork-test",
        user: roleName,
        password: roleName
      }
    });

    // connect to PG as the newly created role

    await pool.connect({
      host: "localhost",
      port: 5432,
      database: "socialnetwork-test",
      user: roleName,
      password: roleName
    });

    return new Context(roleName);
  }

  async close() {
    // disconnect from PG

    await pool.colse();

    // reconnect as our root user

    await pool.connect(DEFAULT_OPTS);

    // delete the role and schema we created

    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));

    await pool.query(format("DROP ROLE %I;", this.roleName));

    // disconnect

    await pool.colse();
  }

  async reset() {
    return pool.query("DELETE FROM users;");
  }
}

module.exports = Context;
