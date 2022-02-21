module.exports = function (rows) {
  return rows.map(function (row) {
    const replaced = {};

    for (const key in row) {
      const camelCase = key.replace(/([-_][a-z])/gi, function ($1) {
        return $1.toUpperCase().replace("_", "");
      });

      replaced[camelCase] = row[key];
    }

    return replaced;
  });
};
