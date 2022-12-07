declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // NODE_ENV 不需要在.env.local中配置。
            NODE_ENV: 'development' | 'production'
            PORT: string
            HOST: string
            BASE: string
            MYSQL_HOST: string
            MYSQL_PORT: string
            MYSQL_USERNAME: string
            MYSQL_PASSWORD: string
            MYSQL_DATABASE: string
            JWT_SECRET: string
            UPLOAD_INFO_AVATAR: string
            GIT_ROOT_PATH: string
        }
    }

    namespace Express {
        interface Request {
            user: {
                id: number
                [K: string]: any
            }
        }
    }
}

export {}
