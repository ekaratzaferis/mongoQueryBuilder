/**
 * The engine is where we combine the results of different expression evaluations,
 * in order to construct the final Mongo Query.
 *
 * Expressions Format:
 * {
 *     FIND_BY_COUNTRY: {
 *         op: 'use',
 *         condition: 'COUNTRY_IS_UK'
 *     },
 *     FIND_BY_CLASS: {
 *         op: 'and',
 *         left: 'USER_IS_OLD',
 *         right: {
 *             op: 'or',
 *             left: 'USER_IS_RICH',
 *             right: 'USER_HAS_REAL_ESTATE'
 *         }
 *     }
 * }
 *
 * Conditions Format:
 * {
 *     COUNTRY_IS_UK: {
 *         prop: 'country',
 *         op: 'equal',
 *         value: 'UK'
 *     },
 *     USER_IS_OLD: {
 *         prop: 'age',
 *         op: 'gt',
 *         value: 60
 *     },
 *     USER_IS_RICH: {
 *         prop: 'income',
 *         op: 'gt',
 *         value: 60000
 *     },
 *     USER_HAS_REAL_ESTATE: {
 *         prop: 'owns.real_estate',
 *         op: 'inside',
 *         value: 'VACATION_HOUSE'
 *     }
 * }
 *
 * @type {evaluateExpression}
 */
const evaluateExpression = require('./evaluation/expression')
module.exports = (expressions, conditions) => {
    var query = {}
    Object.keys(expressions).forEach((i) => {
        query = Object.assign(query, evaluateExpression(expressions[i], conditions))
    })
    return query
}
