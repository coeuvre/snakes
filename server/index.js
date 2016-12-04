import Koa from 'koa'
import serve from 'koa-static'
import path from 'path'

const app = new Koa()
const root = path.resolve(__dirname, '..', 'dist', 'app')

app.use(serve(root))

app.listen(3000)
