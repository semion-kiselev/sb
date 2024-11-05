export const getUpdateSqlWithValues = (
  sql: string,
  keyValueMap: Record<string, unknown>
): [string, unknown[]] => {
  const values: unknown[] = [];

  const updateString = Object.entries(keyValueMap)
    .filter((value) => typeof value !== "undefined")
    .map(([key, value]) => {
      if (key === "datetime()") {
        return `${key}=${value}`;
      }
      values.push(value);
      return `${key}=?`;
    })
    .join(", ");

  return [sql.replace("%s", updateString), values];
};
