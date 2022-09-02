declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // NODE_ENV 不需要在.env.local中配置。
            NODE_ENV: 'development' | 'production'
            MYSQL_HOST: string
            MYSQL_PORT: string
            MYSQL_USERNAME: string
            MYSQL_PASSWORD: string
            MYSQL_DATABASE: string
        }
    }

    namespace Express {
        interface Request {
            user?: {
                _id: string
            }
        }
    }
}

export {}
