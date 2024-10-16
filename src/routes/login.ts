import { NextFunction, Request, Response } from 'express'
import loginController from '../controllers/login'

function applyRoutes(app: any, log: any) {
    app.post(
        '/login',
        async (req: Request, res: Response, next: NextFunction) => {
            log.info('/login')
            return loginController.login(req, res, next)
        }
    )
    app.post(
        '/logout',
        async (req: Request, res: Response, next: NextFunction) => {
            log.info('/logout')
            return loginController.logout(req, res, next)
        }
    )
}

export default applyRoutes
