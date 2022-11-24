import { ApolloServer } from 'apollo-server-express'
import { createClient } from 'redis'
import { initGraphqls } from './graphql/init-graphql'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import fs, { readdirSync } from 'fs'
import http from 'http'
import https from 'https'
import session from 'express-session'

const staticFldr = 'build'

const RedisStore = require('connect-redis')(session)
dotenv.config()

const startApolloServer = async (
  dbhost: string,
  dbport: string,
  db: string,
  user: string,
  password: string
) => {
  const modules = initGraphqls(dbhost, parseInt(dbport), db, user, password)

  const app = express()
  const redisClient = createClient({ legacyMode: true })
  redisClient.connect().catch(console.error)

  if (process.env.ENV === 'production') {
    app.set('trust proxy', true)

    app.set('x-forwarded-proto', 'https')
  }

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: true,
      secret: 'keyboard cat',
      resave: false,
      cookie: {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  )

  const server = new ApolloServer({
    csrfPrevention: true,
    cache: 'bounded',
    modules: modules,
    context: ({ req }) => ({ session: req.session, cookies: req.cookies }),
  })

  const privateKey = process.env.PRIVATE_KEY
    ? fs.readFileSync(process.env.PRIVATE_KEY, 'utf8')
    : undefined
  const certificate = process.env.CERTIFICATE
    ? fs.readFileSync(process.env.CERTIFICATE, 'utf8')
    : undefined
  const credentials =
    privateKey && certificate ? { key: privateKey!, cert: certificate! } : undefined

  await server.start()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    cors<cors.CorsRequest>({
      origin: ['https://knihovna.danek-family.cz' /*, 'https://studio.apollographql.com'*/],
      credentials: true,
    })
  )

  // server.applyMiddleware({ app })
  server.applyMiddleware({ app })

  const protocol = process.env.APOLLO_PROTOCOL || 'http'
  const port = process.env.APOLLO_PORT || 4000
  const host = process.env.HOST || '0.0.0.0'

  app.set('protocol', protocol)
  app.set(
    'credentials',
    app.get('protocol') === 'https'
      ? {
          key: fs.readFileSync(process.env.PRIVATE_KEY || '', 'utf8'),
          cert: fs.readFileSync(process.env.CERTIFICATE || '', 'utf8'),
        }
      : undefined
  )
  app.set('port', port)
  app.set('host', host)

  app.use(express.static('build'))

  app.get('/.?*', (req: Request, res: Response) => {
    res.sendFile('index.html', { root: staticFldr })
  })

  const httpsServer =
    protocol === 'https' && credentials
      ? https.createServer(credentials!, app)
      : new http.Server(app)

  httpsServer.listen(port, () =>
    console.log(`Express GraphQL Server Now Running On ${protocol}://${host}:${port}`)
  )
  return [app, server]
}

if (
  process.env.DBHOST &&
  process.env.DBPORT &&
  process.env.DBNAME &&
  process.env.DBUSER &&
  process.env.DBPASSWORD
) {
  startApolloServer(
    process.env.DBHOST,
    process.env.DBPORT,
    process.env.DBNAME,
    process.env.DBUSER,
    process.env.DBPASSWORD
  )
}
/*
const pre = ''
const protocol = process.env.PROTOCOL === 'https' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '8080'

const privateKey  = process.env.PRIVATE_KEY ? fs.readFileSync(process.env.PRIVATE_KEY, 'utf8') : undefined
const certificate = process.env.CERTIFICATE ? fs.readFileSync(process.env.CERTIFICATE, 'utf8') : undefined
const credentials = privateKey && certificate ? {key: privateKey!, cert: certificate!} : undefined

const app = express()

app.set('protocol', protocol)
app.set('port', port)
app.set('host', host)

const staticFldr = 'build'

// const getDirectories = (source:string) =>
//   readdirSync(source, { withFileTypes: true })
//     .filter(dirent => dirent.isDirectory())
//     .map(dirent => dirent.name)

// getDirectories(staticFldr).forEach(fldr => { app.use('/'+fldr, express.static(`${staticFldr}/${fldr}`))})

app.use(express.static('build'))

app.get('/.?*', (req: Request, res: Response) => {
  res.sendFile('index.html', {'root': staticFldr});
});

const server = protocol === 'https' && credentials ? https.createServer(credentials!, app) : new http.Server(app)

process.on('uncaughtException', (e) => {server.close()})
process.on('SIGTERM', () => {server.close()})
try {
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${protocol}://${host}:${port}`)
})
}  catch(error:any) {
  console.log(error.getMessage())
}
*/
/*
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { initGraphqls } from './graphql/init-graphql'
import fs, { readdirSync } from 'fs'
import https from 'https'
import http from 'http'
import cors from 'cors'

dotenv.config()

const startApolloServer = async (
  db: string,
  user: string,
  password: string,
) => {
  const modules = initGraphqls(db, user, password)

  const app = express()

  const server = new ApolloServer({
    csrfPrevention: true,
    cache: 'bounded',
    modules,
  })

  const privateKey  = process.env.PRIVATE_KEY ? fs.readFileSync(process.env.PRIVATE_KEY, 'utf8') : undefined
  const certificate = process.env.CERTIFICATE ? fs.readFileSync(process.env.CERTIFICATE, 'utf8') : undefined
  const credentials = privateKey && certificate ? {key: privateKey!, cert: certificate!} : undefined
  
  await server.start()

  server.applyMiddleware({ app })
  const protocol = process.env.PROTOCOL || 'http'
  const port = process.env.PORT || 8080
  const host = process.env.HOST || '0.0.0.0'
  app.set('protocol', protocol)
  app.set(
    'credentials',
    app.get('protocol') === 'https'
      ? {
          key: fs.readFileSync(process.env.PRIVATE_KEY || '', 'utf8'),
          cert: fs.readFileSync(process.env.CERTIFICATE || '', 'utf8'),
        }
      : undefined,
  )
  app.set('port', port)
  app.set('host', host)

  const httpsServer = protocol === 'https' && credentials ? https.createServer(credentials!, app) : new http.Server(app)

  httpsServer.listen(8000, () =>
    console.log('Express GraphQL Server Now Running On localhost:8000/graphql'),
  )
  return [app, server]
}

if (
  process.env.DBNAME &&
  process.env.DBUSER &&
  process.env.DBPASSWORD
) {
  startApolloServer(
    process.env.DBNAME,
    process.env.DBUSER,
    process.env.DBPASSWORD,
  )
}

const pre = ''
const protocol = process.env.PROTOCOL === 'https' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '8080'

const privateKey  = process.env.PRIVATE_KEY ? fs.readFileSync(process.env.PRIVATE_KEY, 'utf8') : undefined
const certificate = process.env.CERTIFICATE ? fs.readFileSync(process.env.CERTIFICATE, 'utf8') : undefined
const credentials = privateKey && certificate ? {key: privateKey!, cert: certificate!} : undefined

const app = express()

app.set('protocol', protocol)
app.set('port', port)
app.set('host', host)

const staticFldr = 'build'

const getDirectories = (source:string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

getDirectories(staticFldr).forEach(fldr => { app.use('/'+fldr, express.static(`${staticFldr}/${fldr}`))})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors<cors.CorsRequest>({ origin: ['https://knihovna.danek-family.cz'] }))

app.get('/.?*', (req: Request, res: Response) => {
  res.sendFile('index.html', {'root': './build'});
});

const server = protocol === 'https' && credentials ? https.createServer(credentials!, app) : new http.Server(app)

process.on('uncaughtException', (e) => {server.close()})
process.on('SIGTERM', () => {server.close()})
try {
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${protocol}://${host}:${port}`)
})
} catch(error:any) {
  console.log(error.getMessage())
}

*/
