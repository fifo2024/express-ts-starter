import { NextFunction, Request, Response } from 'express'
import redisController from '../controllers/redis'

function applyRoutes(app: any, log: any) {
    app.get(
        '/redis/set',
        async (req: Request, res: Response, next: NextFunction) => {
            return redisController.setKey(req, res, next)
        }
    )
    app.get(
        '/redis/get',
        async (req: Request, res: Response, next: NextFunction) => {
            return redisController.getKey(req, res, next)
        }
    )
    app.get(
        '/redis/incr',
        async (req: Request, res: Response, next: NextFunction) => {
            log.info('/redis/incr')
            return redisController.incr(req, res, next)
        }
    )
}

export default applyRoutes
