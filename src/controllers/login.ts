/**
 * Created by zhaoyadong on 05/27/2024.
 */
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Redis from 'ioredis'
import log from '../utils/logger'

const redis = new Redis()

export default {
    login: async function (req: Request, res: Response, next: NextFunction) {
        const { userId, userName, password } = req.body

        const userNameValue = await redis.get(userName)
        let token = ''
        let message = ''

        if (userNameValue) {
            const storedToken = userNameValue.toString()
            const verifyRes = jwt.verify(storedToken, process.env.JWT_SECRET)

            if (verifyRes) {
                redis.del(userName, () => {
                    const newToken = jwt.sign(
                        { userId, userName },
                        process.env.JWT_SECRET
                    )
                    redis.set(userName, newToken)
                    token = newToken
                    message =
                        'Logged in successfully. Previous session invalidated.'
                })
            }
        } else {
            const newToken = jwt.sign(
                { userId, userName }, // 填入想存储的用户信息
                (process.env as any).JWT_SECRET, // 秘钥，可以为随机一个字符串
                {
                    expiresIn: '7d', // 其他选项，如过期时间
                }
            )
            redis.set(userName, newToken)
            token = newToken
            message = 'Logged in successfully.'
        }

        // 安装cookie-parser后可以这样写
        const oneDay = 1000 * 60 * 60 * 24
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + oneDay),
            secure: true,
            // signed: true,
        })

        // 它实际上进行操作是：
        /**
            let cookieString = `token=${token}; Expires=${oneDay}; HttpOnly`;
            if (process.env.NODE_ENV === 'production') {
                cookieString += '; Secure';
            }
            res.setHeader('Set-Cookie', cookieString);
        */
        res.status(200).json({
            msg: message,
            token,
        })
        next()
    },
    logout: async function (req: Request, res: Response, next: NextFunction) {
        res.clearCookie('token')
        res.status(200).send('ok')
        next()
    },
}
