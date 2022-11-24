import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import fs, { readdirSync } from 'fs'
import http from 'http'
import https from 'https'

dotenv.config()

const pre = ''
const protocol = process.env.PROTOCOL === 'https' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '8080'

const privateKey = process.env.PRIVATE_KEY
  ? fs.readFileSync(process.env.PRIVATE_KEY, 'utf8')
  : undefined
const certificate = process.env.CERTIFICATE
  ? fs.readFileSync(process.env.CERTIFICATE, 'utf8')
  : undefined
const credentials = privateKey && certificate ? { key: privateKey!, cert: certificate! } : undefined

const app = express()

app.set('protocol', protocol)
app.set('port', port)
app.set('host', host)

const staticFldr = 'build'

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

getDirectories(staticFldr).forEach(fldr => {
  app.use('/' + fldr, express.static(`${staticFldr}/${fldr}`))
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/.?*', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: './build' })
})

const server =
  protocol === 'https' && credentials ? https.createServer(credentials!, app) : new http.Server(app)

process.on('uncaughtException', e => {
  server.close()
})
process.on('SIGTERM', () => {
  server.close()
})
try {
  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${protocol}://${host}:${port}`)
  })
} catch (error: any) {
  console.log(error.getMessage())
}

export default app
