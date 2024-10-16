import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export type Params = {
    unless: string[]
    /**
     * The Key or a function to retrieve the key used to verify the JWT.
     */
    // secret: jwt.Secret | GetVerificationKey,
    /**
     * Defines how to retrieves the token from the request object.
     */
    // getToken?: TokenGetter,
    /**
     * Defines how to verify if a token is revoked.
     */
    // isRevoked?: IsRevoked,
    /**
     * If sets to true, continue to the next middleware when the
     * request doesn't include a token without failing.
     *
     * @default true
     */
    // credentialsRequired?: boolean,
    /**
     * Allows to customize the name of the property in the request object
     * where the decoded payload is set.
     * @default 'auth'
     */
    // requestProperty?: string,
    /**
     * List of JWT algorithms allowed.
     */
    // algorithms: jwt.Algorithm[],
    /**
     * Handle expired tokens.
     */
    // onExpired?: ExpirationHandler,
} & jwt.VerifyOptions

export default (options: Params) => {
    const { unless } = options
    // 验证的中间件
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const isUnlessPath = unless.includes(req.originalUrl)

        if (isUnlessPath) {
            console.log(52, isUnlessPath)
            return next()
        }
        // ... 根据存储方式拿到token
        // 获取token
        console.log(79, req.originalUrl)
        console.log(49, req.cookies.token)
        const token = req.cookies.token
        // const authHeader: string = req.headers.authorization || ''

        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     res.status(401).json({ msg: 'No token provided' })
        // }

        // const token = authHeader.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) // 传入token和秘钥
            console.log(32, decoded)
            // 拿到解出来的
            const { userId, username }: any = decoded
            // ... 进一步从数据库中判断这个用户信息是否存在
            // 以mongose为例
            //   const user = await User.findById(userId).select('-password');
            const user = {
                _id: userId,
                userId,
                username,
                email: 'atding@163.com',
            }
            // 将信息挂载req.user中供后续接口使用
            ;(req as any).user = {
                userId: user._id,
                username: user.username,
                email: user.email,
            }
            return next()
        } catch (error) {
            console.log(80, error)
            res.status(401).json({ msg: '用户验证失败' })
        }
    }

    return middleware
}
