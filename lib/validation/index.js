const Promise = require('bluebird')
const Joi = Promise.promisifyAll(require('joi'))
const ops = require('./ops')
module.exports = (expressions, conditions) => {
    var conditionSchema = Joi.object().keys({
        prop: Joi.string().required(),
        op: Joi.any().valid(ops.condition).required(),
        value: Joi.alternatives().try(Joi.string(), Joi.array().min(1), Joi.boolean(), Joi.number()).required(),
        isDate: Joi.boolean()
    })
    var expressionSchema = Joi.object().keys({
        op: Joi.any().valid(ops.expression).required(),
        condition: Joi.alternatives().try(Joi.string(), Joi.lazy(() => expressionSchema).description('Expression')),
        left: Joi.alternatives().try(Joi.string(), Joi.lazy(() => expressionSchema).description('Left Expression')),
        right: Joi.alternatives().try(Joi.string(), Joi.lazy(() => expressionSchema).description('Right Expression'))
    })
    var promises = []
    if (Object.keys(expressions).length && Object.keys(expressions).length > 0) {
        Object.keys(expressions).forEach((i) => {
            promises.push(Joi.validateAsync(expressions[i], expressionSchema, {convert: false}))
        })
    } else {
        return Promise.reject(false)
    }
    if (Object.keys(conditions).length && Object.keys(conditions).length > 0) {
        Object.keys(conditions).forEach((i) => {
            promises.push(Joi.validateAsync(conditions[i], conditionSchema, {convert: false}))
        })
    } else {
        return Promise.reject(false)
    }
    return Promise.all(promises).catch((err) => { console.log(err); return Promise.reject(false) })
}
