import { parseLanguageId } from '@tsdy/git-util'

export function parseLanguage(language_id: number) {
    let language = ''
    if (Number.isInteger(language_id)) {
        // 主语言id为-1的，不展示内容。
        language = parseLanguageId(language_id)
            ? parseLanguageId(language_id)!.name
            : ''
    }
    return language
}
