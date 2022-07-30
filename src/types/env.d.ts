declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // NODE_ENV 不需要在.env.local中配置。
            NODE_ENV: 'development' | 'production'
            PORT: string
            DB_URL: string
            TOKEN_SECRET: string
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
