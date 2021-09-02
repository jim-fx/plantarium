import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const type = 'sqlite';
const host = 'localhost';
let dbName = 'db.sql';

if (process.env.DB_NAME) {
  dbName = process.env.DB_NAME;
}

const config: Options = {
  type: type as 'sqlite' | 'mongo',
  host,
  dbName,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
