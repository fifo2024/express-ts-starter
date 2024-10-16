/**
 * Created by zhaoyadong on 12/11/2017.
 */
import type { Request, Response, NextFunction } from 'express'
import Redis from 'ioredis'
import { type Union } from '../types'
import log from '../utils/logger'

const redis = new Redis()

export default {
    lesson1: async function (req: Request, res: Response, next: NextFunction) {
        // 获取缓存数据
        const redisRes = await redis.get('mykey').then((data) => {
            if (data) {
                // const user = JSON.parse(data)
                console.log(data)
                return data
            } else {
                // 如果缓存不存在，从后端数据库获取数据并更新缓存
                // ...
            }
        })

        log.info(redisRes)

        // res.send('hello express');
        res.setHeader('Content-type', 'text/html;charset=utf-8')
        // res.render('index', { title: 'Hello', content: 'World' })
        const person: Union = {
            name: 'zhaoya',
            age: 18,
            value: redisRes,
        }
        log.info(JSON.stringify(person))
        res.status(200).send(JSON.stringify(person))
        next()
    },
}
