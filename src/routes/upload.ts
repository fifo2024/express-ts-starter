import { NextFunction, Request, Response } from 'express'
import uploadController from '../controllers/upload'

function applyRoutes(app: any, log: any) {
    app.post(
        '/upload/image',
        async (req: Request, res: Response, next: NextFunction) => {
            log.info('/upload/image')
            return uploadController.uploadImage(req, res, next)
        }
    )
}

export default applyRoutes
