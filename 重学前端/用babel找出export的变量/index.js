const babelParser = require('@babel/parser')
const fs = require('fs')
const path = require('path')

fs.readFile(path.join(__dirname, './example.js'), 'utf-8', (error, exampleCode) => {
    const ast = babelParser.parse(exampleCode, {
        sourceType: 'module'
    })
    const ExportNamedDeclaration_nodes = ast.program.body.filter(item => item.type === 'ExportNamedDeclaration')
    // console.log(ExportNamedDeclaration_nodes)
    const exportVariables = [] 
    for (let node of ExportNamedDeclaration_nodes) {
        // console.log('body--->', node.declaration.body)
        // console.log('declarations--->', node.declaration.declarations)
        // console.log('id--->', node.declaration.id)
        let { type, declarations, id} = node.declaration
        switch(type) {
            case 'ClassDeclaration':
                exportVariables.push(id.loc.identifierName)
                break
            case 'VariableDeclaration':
                exportVariables.push(declarations[0].id.name)
                break
        }

    }

    console.log('export 的变量', exportVariables)
})


