// index.ts
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import responseHeader from './responseHeader'
import authToken from './authToken'

function initMiddleware(app: express.Application) {
    app.use(express.json())
    // 使用 CORS 中间件，允许所有源访问（也可以根据需求设置特定的源）
    app.use(cors())
    app.use(cookieParser())
    // 或加密
    // app.use(cookieParser(process.env.COOKIE_SECRET, { signedCookies: true }));
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(
        authToken({
            unless: ['/login', '/logout'],
        })
    )
    app.use(responseHeader)
}

export default initMiddleware
