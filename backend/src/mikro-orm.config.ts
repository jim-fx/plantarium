import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { DB_MONGO_URL, DB_NAME } from "./config";

const defaultOptions: Options = {
  type: 'sqlite',
  dbName: 'db.sql',
  highlighter: new SqlHighlighter(),
};

if (DB_MONGO_URL) {
  defaultOptions.type = 'mongo';
  defaultOptions.highlighter = new MongoHighlighter();
  defaultOptions.clientUrl = DB_MONGO_URL;
  defaultOptions.dbName = 'plantarium';
}

if (DB_NAME) {
  defaultOptions.dbName = DB_NAME;
}

const config: Options = {
  ...defaultOptions,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  entities: ['./**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
