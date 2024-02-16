// import app from '@adonisjs/core/services/app/'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: 'localhost', // PostgreSQL host
        port: 5432, // PostgreSQL port
        user: 'postgres', // PostgreSQL username
        password: 'root', // PostgreSQL password
        database: 'adonis', // PostgreSQL database name
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig

// const dbConfig = defineConfig({
//   connection: 'sqlite',
//   connections: {
//     sqlite: {
//       client: 'better-sqlite3',
//       connection: {
//         filename: app.tmpPath('db.sqlite3')
//       },
//       useNullAsDefault: true,
//       migrations: {
//         naturalSort: true,
//         paths: ['database/migrations'],
//       },
//     },
//   },
// })

// export default dbConfig