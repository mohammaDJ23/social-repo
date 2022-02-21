const pg = require("pg");

class Pool {
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);

    // by default pool creates some clients and all of them are not going to connect to database
    // so we will use a query to make sure that we are connect to our database

    return this._pool.query("SELECT 1 + 1;");
  }

  colse() {
    return this._pool.end();
  }

  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

module.exports = new Pool();
