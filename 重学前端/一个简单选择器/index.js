/**
 * 一个简单选择器，根据 id/class/属性/标签名称/* 来查找
 * @param {*} featureChar 
 * @returns 
 */
function querySelector(featureChar) {
    if (typeof featureChar !== 'string') {
        throw new Error('featureChar 不合法')
    }
    let targetEle = null
    let featureCharDetail = getFeatureCharDetail(featureChar)
    
    console.log('featureChar:', featureChar)
    console.log('featureCharDetail:', featureCharDetail)


    /**
     * 根据简单选择的类型，递归查询元素节点
     * @param {*} htmlCollection 
     * @returns 
     */
    function findTargetEle(htmlCollection) {
        let res = null
        for (let index = 0; index < htmlCollection.length; index++) {
            const element = htmlCollection[index];
            // 非属性选择器匹配
            if (featureCharDetail.type !== 'attr') {
                if (element[featureCharDetail.type] === featureCharDetail.value) {
                    return element
                } else if(element.children && element.children.length > 0) {
                    res = findTargetEle(element.children)
                }
            } else {
                const { nodeName, attributes } = element
                if (nodeName === 'A') {
                console.log(nodeName, haveAttribute(attributes, featureCharDetail.key, featureCharDetail.value, featureCharDetail.pattern))
                }
                // 属性选择器匹配
                if (nodeName === featureCharDetail.nodeName && haveAttribute(attributes, featureCharDetail.key, featureCharDetail.value, featureCharDetail.pattern)) {
                    return element
                } else if(element.children && element.children.length > 0) {
                    res = findTargetEle(element.children)
                }
            }
        }
        return res
    }

    if (featureCharDetail.type === '*') {
        targetEle = document.children[0]
    } else {
        targetEle = findTargetEle(document.children)
    }

    return targetEle
}

/**
 * 获取选择器类型和值
 * @param {*} featureChar 
 * @returns 
 */
function getFeatureCharDetail(featureChar) {
    if (featureChar === '*') {
        return {
            type: '*',
            value: '*'
        }
    }
    // class
    if (featureChar.substring(0,1) === '.') {
        return {
            type: 'className',
            value: featureChar.substring(1)
        }
    }
    // id
    if (featureChar.substring(0,1) === '#') {
        return {
            type: 'id',
            value: featureChar.substring(1)
        }
    }
    // 属性
    if (featureChar.indexOf('[') != -1 && featureChar.indexOf(']') != -1) {
        const attrStartIndex = featureChar.indexOf('[') + 1
        const attrEndIndex = featureChar.indexOf(']')
        const attr = featureChar.substring(attrStartIndex, attrEndIndex)
        const nodeName = featureChar.substring(0, attrStartIndex - 1).toUpperCase()
        
         
        // 只匹配属性
        if (attr.indexOf('=') === -1 && attr.indexOf('*') === -1 && attr.indexOf('$') === -1 && attr.indexOf('~') === -1) {
            return {
                nodeName, 
                type: 'attr',
                key: attr,
                value: ''
            }
        }
        // 准确匹配属性和属性值
        if (attr.indexOf('=') !== -1 && attr.indexOf('*') === -1 && attr.indexOf('$') === -1 && attr.indexOf('~') === -1) {
            const attrArray = attr.split('=')
            return {
                nodeName, 
                type: 'attr',
                key: attrArray[0],
                value: removeQuotationMark(attrArray[1])
            }
        }
        // 匹配存在属性并包含属性值
        if (attr.indexOf('=') !== -1 && attr.indexOf('*') !== -1 && attr.indexOf('$') === -1 && attr.indexOf('~') === -1) {
            const attrArray = attr.split('*=')
            return {
                nodeName, 
                type: 'attr',
                key: attrArray[0],
                value: removeQuotationMark(attrArray[1]),
                pattern: '*'
            }
        }
        // 匹配存在属性并结尾是属性值
        if (attr.indexOf('=') !== -1 && attr.indexOf('*') === -1 && attr.indexOf('$') !== -1 && attr.indexOf('~') === -1) {
            const attrArray = attr.split('$=')
            return {
                nodeName, 
                type: 'attr',
                key: attrArray[0],
                value: removeQuotationMark(attrArray[1]),
                pattern: '$'
            }
        }
        // 匹配存在属性并以空格分隔的属性值
        if (attr.indexOf('=') !== -1 && attr.indexOf('*') === -1 && attr.indexOf('$') === -1 && attr.indexOf('~') !== -1) {
            const attrArray = attr.split('~=')
            return {
                nodeName, 
                type: 'attr',
                key: attrArray[0],
                value: removeQuotationMark(attrArray[1]),
                pattern: '~'
            }
        }
        
    }
    // 标签
    return {
        type: 'nodeName',
        value: featureChar.toUpperCase()
    }
}

/**
 * 判断属性是否存在
 * @param {*} attributes 
 * @param {*} attrName 
 * @param {*} attrValue 
 * @returns 
 */
function haveAttribute(attributes, attrName, attrValue, pattern) {
    switch (pattern) {
        case '*':
            for(let attr of attributes) {
                if (attr.name === attrName && attr.value.indexOf(attrValue) !== -1) {
                    return true
                }
            }
            break
        case '$':
            for(let attr of attributes) {
                const attrSplit = attr.value.split(attrValue)
                if (attr.name === attrName &&  attrSplit[attrSplit.length - 1] === '') {
                    return true
                }
            }
            break
        case '~':
            for(let attr of attributes) {
                if (attr.name === attrName && attr.value.indexOf(attrValue) !== -1 && /\s/.test(attr.value)) {
                    return true
                }
            }
            break
        default:
            for(let attr of attributes) {
                if (attr.name === attrName && (!attrValue || (attr.value === attrValue))) {
                    return true
                }
            }
    }
  
    return false
}

/**
 * 去掉引号
 * @param {*} str 
 * @returns 
 */
function removeQuotationMark(str) {
    return str.substring(1, str.length -1)
}
