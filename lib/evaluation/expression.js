/**
 * This module is responsible to construct complex Mongo queries which may include:
 *    - regular expressions (OR, AND)
 *    - conditions (see condition.js)
 *
 * The available operations while constructing a query are:
 *    use => indicates that a simple condition needs to be evaluated
 *    and => indicates that two parts of an expression will be recursively combined in order to create an AND condition
 *    or => indicates that two parts of an expression will be recursively combined in order to create an OR condition
 *
 * It receives a single expression described in the following format:
 * {
 *     op: 'use',                     // indicates that will be adding a simple condition in the expression
 *     condition: 'COUNTRY_IS_UK'     // targets the condition that we need to evaluate
 * }
 * or in this format:
 * {
 *     op: 'and',                      // indicates that will be adding an AND query
 *     left: 'COUNTRY_IS_UK'           // targets the left part of the expression (in this case a simple condition)
 *     right: {                        // targets the right part of the expression (in this case, another expression)
 *        op: 'or',                    // indicates that will be adding an OR query
 *        left: 'USER_IS_OLD',   // simple condition
 *        right: 'USER_IS_RICH'  // simple condition
 *     }
 * }
 *
 * See condition.js on how to describe a simple condition.
 *
 * @param query
 * @param conditions
 * @returns {*}
 */
const evaluateCondition = require('./condition')
const evaluateExpression = (expression, conditions) => {
    if (expression.op === 'use') {
        var cond = conditions[expression.condition]
        return {[cond.prop]: evaluateCondition(cond)}
    } else if (expression.op === 'or') {
        var or = []
        if (typeof expression.left === 'string') {
            or.push({[conditions[expression.left].prop]: evaluateCondition(conditions[expression.left])})
        } else {
            or.push(evaluateExpression(expression.left, conditions))
        }
        if (typeof expression.right === 'string') {
            or.push({[conditions[expression.right].prop]: evaluateCondition(conditions[expression.right])})
        } else {
            or.push(evaluateExpression(expression.right, conditions))
        }
        return {'$or': or}
    } else if (expression.op === 'and') {
        var and = []
        if (typeof expression.left === 'string') {
            and.push({[conditions[expression.left].prop]: evaluateCondition(conditions[expression.left])})
        } else {
            and.push(evaluateExpression(expression.left, conditions))
        }
        if (typeof expression.right === 'string') {
            and.push({[conditions[expression.right].prop]: evaluateCondition(conditions[expression.right])})
        } else {
            and.push(evaluateExpression(expression.right, conditions))
        }
        return {'$and': and}
    }
}
module.exports = evaluateExpression
