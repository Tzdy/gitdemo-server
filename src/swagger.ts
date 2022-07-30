import SwaggerUI from 'swagger-ui-express'
import { createSwaggerDoc } from '@tsdy/express-plugin-swagger'
import { Application } from 'express'

export function swagger(app: Application) {
    if (process.env.NODE_ENV === 'development') {
        const swaggerDoc = createSwaggerDoc(app, {
            swagger: '2.0',
            tags: [
                {
                    name: 'auth',
                    description: '用户权限。',
                },
            ],
            info: {
                description: 'This is a sample server Petstore server.',
                version: '1.0.0',
                title: 'Swagger Petstore',
                contact: {
                    email: 'apiteam@swagger.io',
                },
            },
            host: 'localhost:10086',
            basePath: '/',
            securityDefinitions: {
                token: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'authorization',
                },
            },
        })
        app.use('/v2', SwaggerUI.serve, SwaggerUI.setup(swaggerDoc))
        console.log(`http://localhost:${process.env.PORT}/v2`)
    }
}
