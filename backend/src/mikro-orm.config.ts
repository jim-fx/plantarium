import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

let type = 'sqlite';
let dbName = 'db.sql';
let clientUrl;

if (process.env.DB_NAME) {
	dbName = process.env.DB_NAME;
}

if (process.env.MONGO_URL) {
	type = 'mongo';
	clientUrl = process.env.MONGO_URL;
}

const config: Options = {
	type: type as 'sqlite' | 'mongo',
	dbName,
	clientUrl,
	entities: ['dist/**/*.entity.js'],
	entitiesTs: ['src/**/*.entity.ts'],
	highlighter: new SqlHighlighter(),
	metadataProvider: TsMorphMetadataProvider,
};

export default config;
