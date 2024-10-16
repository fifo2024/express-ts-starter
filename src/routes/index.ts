import express, {
    Express,
    NextFunction,
    Request,
    Response,
    Router,
} from 'express'
import silentHandle from '../utils/silentHandle'
import studyController from '../controllers/study'
import mailerController from '../controllers/mailer'
import applyRoutesRedis from './redis'
import applyRoutesUpload from './upload'
import applyRoutesLogin from './login'
import log from '../utils/logger'

// 路由配置接口
interface RouterConf {
    path: string
    router: Router
    meta?: unknown
}

// 路由配置
const routerConf: Array<RouterConf> = []

const getInfo = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() > 0.5
                ? resolve('info...' + Math.random())
                : reject('error...' + Math.random())
        }, 500)
    })
}

function generateData(res: Response) {
    let count = 0
    const intervalId = setInterval(() => {
        if (count > 10) {
            clearInterval(intervalId)
            res.end() // 结束HTTP响应
            return
        }
        res.write(`data: ${count}\n\n`) // 传输数据
        count++
    }, 1000) // 每秒发送一次数据
}

function routes(app: express.Application) {
    // 根目录
    app.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello Express TS' + process.env.JWT_SECRET)
    })
    app.get('/getInfo', async (req: Request, res: Response) => {
        const [e, result] = await silentHandle(getInfo)
        e ? res.status(500).send('getInfo Error') : res.status(200).send(result)
    })
    app.get(
        '/study',
        async (req: Request, res: Response, next: NextFunction) => {
            console.log(35, req.headers, next)
            return studyController.lesson1(req, res, next)
        }
    )
    app.get(
        '/mailer',
        async (req: Request, res: Response, next: NextFunction) => {
            return mailerController.send(req, res, next)
        }
    )

    app.get('/stream', (req, res) => {
        res.setHeader('Content-Type', 'text/plain')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        generateData(res)
    })

    applyRoutesRedis(app, log)
    applyRoutesUpload(app, log)
    applyRoutesLogin(app, log)

    routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

export default routes
