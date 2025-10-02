import { defineConfig } from '@adonisjs/lucid'
import { resolve } from 'node:path'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: resolve('./tmp', process.env.SQLITE_DB_NAME || 'app.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
