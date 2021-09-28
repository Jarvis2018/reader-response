import { StartTagToken, EndTagToken } from './lexer.js'

/**
 * html语法解析器，将token转换为dom
 */
export function HTMLSyntaticalParser() {
    const stack = [new HTMLDocument]

    this.receiveInput = function(token) {
        console.log('html语法解析器收到：', token)
        if (typeof token === 'string') {
            if (getTop(stack) instanceof Text) {
                getTop(stack).value += token
            } else {
                const text = new Text(token)
                getTop(stack).childNodes.push(text)
                stack.push(text)
            }
        } else if(getTop(stack) instanceof Text) {
            // 如果文本token，则出栈，以防标签没法闭合
            stack.pop()
        }
        
        if (token instanceof StartTagToken) {
            const element = new Element(token)
            // 如果开始token，入栈
            getTop(stack).childNodes.push(element)
            stack.push(element)
        } else if (token instanceof EndTagToken) {
            // 结束标签出栈
            stack.pop()
        }
    }
    this.getOutput = function() {
        return stack[0]
    }
}

class HTMLDocument {
    constructor() {
        this.isDocument = true
        this.childNodes = []
    }
}

class Node {}

class Element extends Node{
    constructor(token) {
        super()
        this.childNodes = []
        for(let key in token) {
            this[key] = token[key]
        }
    }
}

class Text extends Node{
    constructor(token) {
        super()
        this.value = token || ''
    }
}

// 获取栈顶元素
function getTop(stack) {
    return stack[stack.length - 1]
}