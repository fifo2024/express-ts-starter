/**
 * Created by zhaoyadong on 12/11/2017.
 */
import type { Request, Response, NextFunction } from 'express'
import nodemailer from 'nodemailer'
import log from '../utils/logger'

export default {
    send: async function (req: Request, res: Response, next: NextFunction) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.freesmtpservers.com',
            port: 25,
            auth: {
                user: 'atding@163.com',
                pass: 'my-password',
            },
        })

        try {
            const send = await transporter.sendMail({
                from: '阿丁<atding@163.com>', // sender address
                to: 'zhifou80@163.com', // list of receivers
                cc: 'somethree@example.com',
                bcc: 'somefour@example.com',
                subject: 'Hello!', // subject line
                text: 'Hello world!', // plain text body
                html: '<p>Hello world!</p>', // HTML body
                attachments: [
                    {
                        // get file content from disk
                        filename: 'text1.txt',
                        path: '/path/to/file1.txt',
                    },
                    {
                        // get file content from a URL
                        filename: 'text2.txt',
                        path: 'https://myserver.com/text2.txt',
                    },
                    {
                        // create file from UTF-8 string
                        filename: 'text3.txt',
                        content: 'This is the file content!',
                    },
                    {
                        // create file from data URI
                        filename: 'text4.txt',
                        path: 'data:text/plain;base64,SGVsbG8gd29ybGQh',
                    },
                ],
            })

            console.dir(send, { depth: null, color: true })
        } catch (e) {
            console.dir(e, { depth: null, color: true })
        }

        res.status(200).send('ok')
        next()
    },
}
