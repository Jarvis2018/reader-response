/**
 * 词法分析器
 */

const numbers = ['0','1','2','3','4','5','6','7','8','9']
const operators = ['+','-','*','/']

// 数字 token
class NumberToken {
    constructor() {
        this.value = []
        this.type = 'Number'
    }
}
// 操作符 token
class OperatorToken {
    constructor() {
        this.value = ''
        this.type = ''
    }
 }


export function LexicalParser(syntacticalParser) {
    let numberToken, operatorToken

    function data(char) {
        if (numbers.includes(char)) {
            numberToken = new NumberToken
            numberToken.value.push(char)
            return numberState
        }

        if (operators.includes(char)) {
            operatorToken = new OperatorToken
            operatorToken.value = char
            operatorToken.type = char
            emitToken(operatorToken)
            return data
        }

        if (char.match(/[\t \f\r\n]/)) {
            return data
        }

        error('data', char)
    }

    function numberState(char) {
        if (numbers.includes(char)) {
            numberToken.value.push(char)
            return numberState
        }
        emitToken(numberToken)

        if (char === 'EOF') {
            emitToken({
                type: 'EOF'
            })
            return
        }
        return data
    }

    function emitToken(token) {
        if(token instanceof NumberToken) {
            token.value = token.value.join('')
        }
        syntacticalParser.receiveInput(token)
    }
    
    function error(msg, c) {
        console.error('lexer:', msg +':'+ c)
    }

    let state = data 
    this.receiveInput = function(char) {
        state = state(char)
    }
}