/**
 * Created by zhaoyadong on 12/11/2017.
 */
import type { Request, Response, NextFunction } from 'express'
import Redis from 'ioredis'
import log from '../utils/logger'

const redis = new Redis()

export default {
    incr: async function (req: Request, res: Response, next: NextFunction) {
        log.info(req.query)
        // 每次访问增加PV计数器
        await redis.incr('website:pv')
        res.status(200).send('OK')
        next()
    },
    getKey: async function (req: Request, res: Response, next: NextFunction) {
        // 获取PV计数器的值
        const result = await redis.get('website:pv').then((pvCount) => {
            console.log('PV Count:', pvCount)
            return pvCount
        })

        res.status(200).send(result)
        next()
    },
    setKey: async function (req: Request, res: Response, next: NextFunction) {
        log.info({ id: 40, query: req.query })
        // 获取缓存数据
        const redisRes = await redis.set('mykey', req.query.name + '')
        // 设置缓存数据
        redis.set(
            'user:123',
            JSON.stringify({ name: 'John', age: 30 }),
            'EX',
            3600
        ) // 设置过期时间

        // 获取缓存数据
        // redis.get('user:123').then((data) => {
        //     if (data) {
        //         const user = JSON.parse(data)
        //         console.log(user)
        //     } else {
        //         // 如果缓存不存在，从后端数据库获取数据并更新缓存
        //         // ...
        //     }
        // })

        log.info(redisRes)

        res.setHeader('Content-type', 'text/html;charset=utf-8')

        res.status(200).send(redisRes)

        next()
    },
}
// 发布/订阅
// Redis提供了发布/订阅功能，用于构建实时消息系统和事件通知系统。发布者可以将消息发布到指定的频道，而订阅者可以监听并接收感兴趣的频道上的消息。
// const Redis = require("ioredis");
// const subscriber = new Redis();
// const publisher = new Redis();

// // 订阅频道
// subscriber.subscribe("news-channel");

// // 接收消息
// subscriber.on("message", (channel, message) => {
//   console.log(`Received message from channel ${channel}: ${message}`);
// });

// // 发布消息
// publisher.publish("news-channel", "Breaking news: Redis is awesome!");

// 地理位置信息存储
// 通过Redis的地理位置功能，可以存储和查询地理位置信息，实现附近的人、附近的商店等应用。
// const Redis = require("ioredis");
// const redis = new Redis();
// // 存储地理位置信息
// redis.geoadd("locations", 13.361389, 38.115556, "Palermo");
// redis.geoadd("locations", 15.087269, 37.502669, "Catania");

// // 查询附近的地点
// redis.georadius("locations", 15, 37, 200, "km").then((locations) => {
//   console.log("Nearby locations:", locations);
// });

// 分布式锁
// 在分布式系统中，经常需要实现互斥访问共享资源的功能。Redis提供了分布式锁的功能，可以确保在分布式环境下，只有一个客户端可以访问某个共享资源，从而避免竞争条件。
// const Redis = require('ioredis')
// const redis = new Redis()

// // 获取锁
// async function acquireLock(key, timeout) {
//     const lockValue = Date.now() + timeout + 1
//     const result = await redis.setnx(key, lockValue)

//     if (result === 1 || Date.now() > parseInt(await redis.get(key), 10)) {
//         await redis.set(key, lockValue)
//         return true
//     }

//     return false
// }

// // 释放锁
// async function releaseLock(key) {
//     await redis.del(key)
// }

// // 使用锁
// async function someFunction() {
//     const lockKey = 'my-lock'
//     const lockTimeout = 5000

//     if (await acquireLock(lockKey, lockTimeout)) {
//         try {
//             // 执行需要互斥访问的操作
//             // ...
//         } finally {
//             await releaseLock(lockKey)
//         }
//     } else {
//         // 未能获取锁，可以选择重试或采取其他策略
//     }
// }
