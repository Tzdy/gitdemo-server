import { asyncException } from '@tsdy/express-plugin-exception'
import { ExpressSwagger } from '@tsdy/express-plugin-swagger'
import { validatorMiddleWare } from '@tsdy/express-plugin-validator'
import { NextFunction, Request, Response, Router } from 'express'
import multer from 'multer'
type MethodType = 'get' | 'post' | 'delete' | 'put' | 'all'

interface RouteOptions {
    method: MethodType
    path: string
    handle: (...argvs: any[]) => Promise<any>
    guards: ((req: Request, res: Response, next: NextFunction) => void)[]
    middleware: ((req: Request, res: Response, next: NextFunction) => void)[]
    parameter: Array<any>
    swagger: Record<string, any>
}

export interface RouterOptions {
    router: Router
    base: string
    ctx: Record<string, any>
    routes: Record<string, RouteOptions>
}

function getRouterOptions(target: any) {
    if (target.prototype) {
        const options = Reflect.getMetadata('router', target) as RouterOptions
        if (options) {
            return options
        }
    } else {
        const options = Reflect.getMetadata(
            'router',
            target.constructor
        ) as RouterOptions
        if (options) {
            return options
        }
    }
    const options: RouterOptions = {
        base: '',
        ctx: {},
        router: Router(),
        routes: {},
    }
    const Ctor = target.prototype ? target : target.constructor
    Reflect.ownKeys(Ctor.prototype).forEach((key) => {
        if (key !== 'constructor' && typeof key === 'string') {
            options.routes[key] = {
                path: '',
                method: 'post',
                async handle(...argvs) {},
                guards: [],
                middleware: [],
                parameter: [],
                swagger: {
                    parameter: {},
                    responses: {},
                    security: [],
                },
            }
        }
    })
    Reflect.defineMetadata('router', options, Ctor)
    return options
}

export function applyRouter(router: Router, Ctors: any[]) {
    Ctors.forEach((ctor) => {
        const options = getRouterOptions(ctor)
        router.use(
            options.base[0] === '/' ? options.base : `/${options.base}`,
            options.router
        )
        Object.values(options.routes).forEach((route) => {
            const { method, parameter, path, swagger, handle } = route
            options.router[method](
                path[0] === '/' ? path : `/${path}`,
                ...route.guards,
                ...route.middleware,
                ExpressSwagger({
                    tags: swagger.tags,
                    parameter: swagger.parameter,
                    responses: swagger.responses,
                    security: swagger.security,
                }),
                validatorMiddleWare(
                    swagger.parameter.dto,
                    swagger.parameter.in
                ),
                asyncException(async (req: Request, res: Response) => {
                    const result = await handle.apply(
                        options.ctx,
                        parameter.map((f) => {
                            if (f instanceof Function) {
                                return f(req, res)
                            }
                            return f
                        })
                    )
                    if (result) {
                        res.send(result)
                    }
                })
            )
        })
    })
}

export function ApiSecurity(name: string) {
    return function (target: any, propKey: string, decorator: any) {
        const options = getRouterOptions(target)
        options.routes[propKey].swagger.security.push({
            [name]: [],
        })
    }
}

export function UseGuards(
    middleware: (req: Request, res: Response, next: NextFunction) => void
) {
    return function (target: any, propKey: string, decorator: any) {
        const options = getRouterOptions(target)
        options.routes[propKey].guards.push(middleware)
    }
}

function addMiddleware(
    target: any,
    propKey: string,
    middleware: (req: Request, res: Response, next: NextFunction) => void
) {
    const options = getRouterOptions(target)
    options.routes[propKey].middleware.push(middleware)
}

export function Middleware(
    middleware: (req: Request, res: Response, next: NextFunction) => void
) {
    return function (target: any, propKey: string, decorator: any) {
        addMiddleware(target, propKey, middleware)
    }
}

export function Controller(base: string | undefined = '') {
    return function <T extends { new (...argvs: any[]): {} }>(Ctor: T) {
        const options = getRouterOptions(Ctor)
        options.base = base
        const parameter = Reflect.getMetadata('design:paramtypes', Ctor)
        class C extends Ctor {
            constructor(...argvs: any[]) {
                super(
                    ...parameter.map(
                        (InjectClass: { new (): {} }) => new InjectClass()
                    )
                )
            }
        }
        options.ctx = new C()
        return C
    }
}

function execRouter(method: MethodType, path: string) {
    return function (
        target: any,
        propKey: string,
        descriptor: TypedPropertyDescriptor<(...argvs: any[]) => Promise<any>>
    ) {
        const options = getRouterOptions(target)
        if (descriptor.value) {
            options.routes[propKey].handle = descriptor.value
            options.routes[propKey].path = path
            options.routes[propKey].method = method
        }
    }
}

export function Post(path: string) {
    return execRouter('post', path)
}

export function RequestMapper(path: string) {
    return execRouter('all', path)
}

export function Body() {
    return function (target: any, propKey: string, parameterIndex: number) {
        const options = getRouterOptions(target)
        const parameter = Reflect.getMetadata(
            'design:paramtypes',
            target,
            propKey
        )
        options.routes[propKey].swagger.parameter = {
            in: 'body',
            dto: parameter[parameterIndex],
        }
        options.routes[propKey].parameter[parameterIndex] = function (
            req: Request
        ) {
            return req.body
        }
    }
}

export function Req() {
    return function (target: any, propKey: string, parameterIndex: number) {
        const options = getRouterOptions(target)
        options.routes[propKey].parameter[parameterIndex] = function (
            req: Request
        ) {
            return req
        }
    }
}

export function Res() {
    return function (target: any, propKey: string, parameterIndex: number) {
        const options = getRouterOptions(target)
        options.routes[propKey].parameter[parameterIndex] = function (
            req: Request,
            res: Response
        ) {
            return res
        }
    }
}

export function ApiResponse(
    status: number,
    dto: { new (...argvs: any[]): {} }
) {
    return function (
        target: any,
        propKey: string,
        descriptor: TypedPropertyDescriptor<(...argvs: any[]) => Promise<any>>
    ) {
        const options = getRouterOptions(target)
        options.routes[propKey].swagger.responses[status] = {
            dto,
        }
    }
}

export function ApiTag(name: string) {
    return function (Ctor: { new (...argvs: any[]): {} }) {
        const options = getRouterOptions(Ctor)
        Object.values(options.routes).forEach((route) => {
            route.swagger.tags = [name]
        })
    }
}

// custom
export function TokenPlyload(key?: string) {
    return function (target: any, propKey: string, parameterIndex: number) {
        const options = getRouterOptions(target)
        options.routes[propKey].parameter[parameterIndex] = function (
            req: Request
        ) {
            if (key) {
                return req.user[key]
            } else {
                return req.user
            }
        }
    }
}
export interface MulterOptions extends Omit<multer.Options, 'storage'> {
    /** @override */
    storage?: multer.DiskStorageOptions
    fields?: multer.Field[]
}
export function Upload(options: MulterOptions) {
    return function (
        target: any,
        propKey: string,
        descriptor: TypedPropertyDescriptor<(...argvs: any[]) => Promise<any>>
    ) {
        const { storage: storageOptions, fields, ...op } = options
        const multerOptions: multer.Options = {
            ...op,
            storage: storageOptions
                ? multer.diskStorage(storageOptions)
                : undefined,
        }
        const upload = multer(multerOptions)
        // 如果fields不存在，则拒绝所有文件，但是不会拒绝formdata中的文本
        const uploadMiddleware = fields ? upload.fields(fields) : upload.none()
        addMiddleware(target, propKey, uploadMiddleware)
    }
}

export function Files() {
    return function (target: any, propKey: string, parameterIndex: number) {
        const options = getRouterOptions(target)
        options.routes[propKey].parameter[parameterIndex] = function (
            req: Request
        ) {
            return req.files
        }
    }
}
