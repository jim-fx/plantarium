import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';

const defaultOptions: Options = {
  type: 'sqlite',
  dbName: 'db.sql',
  highlighter: new SqlHighlighter(),
};

if (process.env.MONGO_URL) {
  defaultOptions.type = 'mongo';
  defaultOptions.highlighter = new MongoHighlighter();
  defaultOptions.clientUrl = process.env.MONGO_URL;
  defaultOptions.dbName = 'plantarium';
}

if (process.env.DB_NAME) {
  defaultOptions.dbName = process.env.DB_NAME;
}

const config: Options = {
  ...defaultOptions,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
