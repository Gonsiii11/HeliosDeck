import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`)
  
  // Determina la ruta del archivo
  let filePath = path.join(__dirname, '../dist', pathname === '/' ? 'index.html' : pathname)
  
  // Intenta servir el archivo exacto (CSS, JS, etc)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath)
    const ext = path.extname(filePath)
    const mimeTypes = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.html': 'text/html',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif'
    }
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    return res.send(content)
  }
  
  // Para cualquier otra ruta, sirve index.html (React Router maneja)
  const indexPath = path.join(__dirname, '../dist/index.html')
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.send(content)
  }
  
  res.status(404).send('Not found')
}
