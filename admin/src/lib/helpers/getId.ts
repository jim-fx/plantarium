export function getId(entity: unknown): string {
  if (entity["id"]) return entity["id"];
  if (entity["_id"]) return entity["_id"];
  return ""
}
