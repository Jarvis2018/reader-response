import { LexicalParser } from "./lexer.js";
import { SyntaxerParser } from './syntaxer.js'

let input = "1 + 2 * 3 / 6"


const syntaxer = new SyntaxerParser()
const lexer = new LexicalParser(syntaxer)

for (const value of input.split('')) {
    lexer.receiveInput(value)
}
// 告诉 lexer 结束了
lexer.receiveInput('EOF')

console.log('source', syntaxer.getSource())
const AST = syntaxer.getAST()
console.log('AST', AST)


/**
 * 
 * @param {*} node 
 */
function evaluate(node) {
    if (node.type === 'Expression') {
         return evaluate(node.children[0])
    }

    if (node.type === 'AdditiveExpression') {
        if (node.operator === '+') {
            return evaluate(node.children[0]) + evaluate(node.children[2])
        }
        if (node.operator === '-') {
            return evaluate(node.children[0]) - evaluate(node.children[2])
        }
        return evaluate(node.children[0])
    }

    if (node.type === 'MultiplicativeExpression') {
        if (node.operator === '*') {
            return evaluate(node.children[0]) * evaluate(node.children[2])
        }
        if (node.operator === '/') {
            return evaluate(node.children[0]) / evaluate(node.children[2])
        }
        return evaluate(node.children[0])
    }

    if (node.type  === 'Number') {
        return Number(node.value)
    }
}

console.log(`${input} = ${evaluate(AST)}`)