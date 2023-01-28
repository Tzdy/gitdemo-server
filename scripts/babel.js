const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const fs = require('fs/promises')
const { join, resolve } = require('path')

const ENTRY = resolve('src/dto')
const OUTPUT = resolve('dtoTypeOut')

async function fsTraverse(path, callback) {
    const st = await fs.stat(path)
    if (st.isDirectory()) {
        const dir = await fs.readdir(path)
        await callback(path, true)
        for (let item of dir) {
            await fsTraverse(join(path, item), callback)
        }
    } else {
        await callback(path, false)
    }
}

async function main() {
    await fs.rm(OUTPUT, {
        recursive: true,
        force: true,
    })
    await fsTraverse(ENTRY, async (path, isDirectory) => {
        const out = join(OUTPUT, path.replace(ENTRY, ''))
        if (isDirectory) {
            await fs.mkdir(out)
        } else {
            const buffer = await fs.readFile(path)
            const ast = babelParser.parse(buffer.toString(), {
                sourceType: 'module',
                plugins: [
                    'typescript',
                    ["decorators", { decoratorsBeforeExport: true }]
                ]
            })
            traverse(ast, {
                enter(path) {
                    if (path.type === 'Decorator') {
                        path.remove()
                    }
                    if (path.type === 'ImportDeclaration' && path.node.source && (path.node.source.value === '@tsdy/express-plugin-swagger' || path.node.source.value === 'class-validator')) {
                        path.remove()
                    }
                },
            });
            const { code } = generate(
                ast,
            );
            await fs.writeFile(out, code)
        }
    })

}

main()

