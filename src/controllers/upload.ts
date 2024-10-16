import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import fs from 'fs'

// 指定文件存储位置和文件名
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // 这里的 destination() 函数指定了文件存储的目录
        const dir = './uploads' // './uploads' 为指定文件存储的目录
        if (!fs.existsSync(dir)) {
            // 如果该目录不存在，则创建该目录
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, './uploads') // 将文件存储到指定目录
    },
    filename(req, file, cb) {
        // 这里的 filename() 函数指定了文件命名规则
        const ext = file.originalname.split('.').pop() // 获取文件后缀名
        cb(null, `${Date.now()}-${file.fieldname}.${ext}`) // 将文件存储到指定位置，并以指定的文件名命名
    },
})

// 创建一个 multer 实例并配置相关选项
const uploadImage = multer({
    storage, // 存储位置和文件名规则
    limits: {
        fileSize: 1024 * 1024 * 5, // 限制文件大小为 5 MB
    },
    fileFilter(req, file, cb) {
        // 这里的 fileFilter() 函数指定了文件类型过滤规则
        // 拒绝上传非图片类型的文件
        if (!file.mimetype.startsWith('image/')) {
            const err: any = new Error('Only image files are allowed!') // 错误的具体信息
            err.status = 400 // 设置错误状态码为 400
            return cb(err, false)
        }
        return cb(null, true)
    },
})

export default {
    uploadImage: async function (
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const result = await uploadImage.single('file')
        console.log(result)
        res.json({ message: '文件上传成功', data: req.file }) // 返回上传成功的信息和上传的文件信息
        next()
    },
}
