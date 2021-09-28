/**
 * 词法解析。通过状态机，将字符流转换为token
 */

const EOF = ''

export function HTMLLexicalParser(syntaxer) {
    let token, attribute

    // ---------- 定义状态 ----------
    function data(c) {
        if (c === '<') {
            return tagOpenState
        }
        if (c === '\0') {
            error('data state 错误', c)
            emitToken(c)
            return data
        }
        if (c === EOF) {
            emitToken(EOF)
            return data
        }
        emitToken(c)
        return data
    }

    // 开始标签的开始state
    function tagOpenState(c) {
        if (c.match(/[a-zA-Z]/)) {
            token = new StartTagToken()
            token.name = c.toLocaleLowerCase()
            return tagNameState
        }
        if (c === '/') {
            return endTagOpenState
        }
         if (c === '!') {
            return bogusCommentStartState
        }
        error('开始标签的开始state 错误', c)
    }
    // 标签名称state
    function tagNameState(c) {
        // 将标签name的每个字符拼接起来
        if (c.match(/[a-zA-Z]/)) {
            token.name += c.toLocaleLowerCase()
            return tagNameState
        }
        if (c.match(/[\r \t\n\f]/)) {
            return beforeAttributeNameState
        }
        if (c === '/') {
            return selfClosingState
        }
        if (c === '>') {
            emitToken(token)
            return data
        }
    }
    // 属性开始之前的state
    function beforeAttributeNameState(c) {
        if (c.match(/[\r \t\n\f]/)) {
            return beforeAttributeNameState
        }
        if (c === '>') {
            emitToken(token)
            return data
        }
        if (c === '/') {
            return selfClosingState
        }
        if (c.match(/["'<]/)) {
            error('beforeAttributeNameState 错误', c)
            return data
        }
        attribute = new AttributeToken
        attribute.name = c.toLocaleLowerCase()
        attribute.value = ''
        return attributeNameState
    }
    // 属性名称state
    function attributeNameState(c) {
        if (c === '/') {
            token[attribute.name] = attribute.value
            return selfClosingState
        }
        if (c.match(/[a-zA-Z]/)) {
            attribute.name += c.toLocaleLowerCase()
            return attributeNameState
        }
        if (c.match(/[\r \t\n\f]/)) {
            token[attribute.name] = attribute.value
            return beforeAttributeNameState
        }
        if (c === '=') {
            return beforeAttributeValueState
        }
        if (c === '>') {
            token[attribute.name] = attribute.value
            emitToken(token)
            return data
        }
        error('属性名称state 错误', c)
        return data
    }
    // 属性值开始state
    function beforeAttributeValueState(c) {
        if (c.match(/['"]/)) {
            return attributeValueQuotation
        }
        if (c.match(/[a-zA-Z]/)) {
            attribute.value += c.toLocaleLowerCase()
            return attributeNameState
        }
        error('属性值开始state 错误', c)
        return data
    }
     // 属性值state
     function attributeValueState(c) {
        if (c.match(/[a-zA-Z]/)) {
            attribute.value += c.toLocaleLowerCase()
            return attributeNameState
        }
        if (c.match(/['"]/)) {
            return attributeNameState
        }
        error('属性值state 错误', c)
        return data
    }
     // 属性值引号state
     function attributeValueQuotation(c) {
        if (c.match(/['"]/)) {
            return attributeValueState
        }
        if (c.match(/[a-zA-Z]/)) {
            attribute.value += c.toLocaleLowerCase()
            return attributeValueState
        }
        error('属性值开始引号state 错误', c)
        return data
    }
    // 结束标签的开始state
    function endTagOpenState(c) {
        if (c.match(/[a-zA-Z]/)) {
            token =  new EndTagToken
            token.name =  c.toLocaleLowerCase()
            return tagNameState
        }
        error('结束标签的开始state 错误', c)
        return data
    }
    // 评论标签开始的state
    function bogusCommentStartState(c) {}
    // 自身标签结束state
    function selfClosingState(c) {
        if(c === '>') {
            emitToken(token)
            return data
        }
    }

    function error(msg, c) {
        console.error('lexer:', msg +':'+ c)
    }


    function emitToken(c) {
        syntaxer.receiveInput(c)
    }

    let state = data
    this.receiveInput = function(char) {
        state = state(char)
    }
}

 // ---------- 定义词token ----------
// 开始标签token
export function StartTagToken() {}
// 属性token
function AttributeToken() {}
// 结束标签token
export function EndTagToken() {}
// 文本节点token
function CharacterToken() {}