import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { app } from './app.js'

async function start() {
  await connectDb()
  app.listen(env.PORT, () => console.log('API running on http://localhost:' + env.PORT))
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
