import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { BloomFilter } from './lib/bloom-fitler.js'
import { userNames } from './constants/usernames.js'

const app = new Hono()
const filter = new BloomFilter(1918832,13)

app.get('/:username', (c) => {
  const username  = c.req.param("username")
  
  const start = performance.now()
  const isUserExist  =  filter.search(username)
  const end = performance.now()
  
  return c.json({
    isUserExist,
    time:`${(end - start).toFixed(2)} ms`
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  userNames.forEach(value => { filter.add(value)  })
  console.log(`Server is running on http://localhost:${info.port}`)
})
