/**
 * This module is responsible to construct complex Mongo queries which may include:
 *    - regular expressions (OR, AND)
 *    - conditions (see condition.js)
 *
 * The available operations while constructing a query are:
 *    use => indicates that a simple condition needs to be evaluated
 *    not => indicates that the condition will be recursively combined in order to create an NOT expression
 *    match_element => indicates that the condition will be recursively combined in order to determine whether an element belongs to the array (left part)
 *    and => indicates that two parts of an expression will be recursively combined in order to create an AND expression
 *    or  => indicates that two parts of an expression will be recursively combined in order to create an OR expression
 *    nor => indicates that two parts of an expression will be recursively combined in order to create an NOR expression
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
 *        op: 'not',                    // indicates that will be adding an OR query
 *        condition: 'USER_IS_OLD',   // simple condition
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
    } else if (expression.op === 'or' || expression.op === 'and' || expression.op === 'nor') {
        var list = []
        if (typeof expression.left === 'string') {
            list.push({[conditions[expression.left].prop]: evaluateCondition(conditions[expression.left])})
        } else {
            list.push(evaluateExpression(expression.left, conditions))
        }
        if (typeof expression.right === 'string') {
            list.push({[conditions[expression.right].prop]: evaluateCondition(conditions[expression.right])})
        } else {
            list.push(evaluateExpression(expression.right, conditions))
        }
        return {[`$${expression.op}`]: list}
    } else if (expression.op === 'not') {
        var cond = conditions[expression.condition]
        if (typeof expression.condition === 'string') {
            return {'$not': {[cond.prop]: evaluateCondition(cond)}}
        } else {
            return {'$not': evaluateExpression(expression.condition, conditions)}
        }
    } else if (expression.op === 'match_element') {
        var cond = conditions[expression.condition]
        if (typeof expression.condition === 'string') {
            return {'$elemMatch': {[cond.prop]: evaluateCondition(cond)}}
        } else {
            return {'$elemMatch': evaluateExpression(expression.condition, conditions)}
        }
    }
}
module.exports = evaluateExpression
