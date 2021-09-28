import { HTMLLexicalParser } from'./lexer.js'
import { HTMLSyntaticalParser } from './syntaxer.js'

const testHTML = `<html maaa=a >
    <head>
        <title>cool</title>
    </head>
    <body>
        <img src="a" />
    </body>
</html>`

const dummySyntaxer = {
  receiveInput: (token) => {
    if (typeof token === 'string') {
      console.log(`String(${token.replace(/\n/, '\\n').replace(/ /, '<whitespace>')})`)
    } else {
      console.log(token)
    }
  }
}

const htmlSyntaticalParser = new HTMLSyntaticalParser
const lexer = new HTMLLexicalParser(htmlSyntaticalParser)

for (let c of testHTML) {
  lexer.receiveInput(c)

}

const DOM = htmlSyntaticalParser.getOutput()
console.log('DOM: ', DOM)