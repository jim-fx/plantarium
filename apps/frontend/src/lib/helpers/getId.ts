export function getId(entity: object): string {
	if ('id' in entity) return entity['id'];
	if ('_id' in entity) return entity['_id'];
}
