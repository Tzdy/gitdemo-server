import { parseLanguageId } from '@tsdy/git-util'

export function parseLanguage(language_id: number) {
    let language = ''
    let color = ''
    if (Number.isInteger(language_id)) {
        // 主语言id为-1的，不展示内容。
        const langItem = parseLanguageId(language_id)
        if (langItem) {
            language = langItem!.name
            color = langItem.color as string
        } else {
            language = 'Other'
            color = '#563d7c'
        }
    }
    return { language, color }
}
