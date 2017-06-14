require('should')
const queryBuilder = require('../index')

describe('Build Mongo Queries', () => {
    it('Combine simple conditions', () => {
        var expressions = {
            FIND_BY_COUNTRY: {
                op: 'use',
                condition: 'COUNTRY_IS_USA'
            },
            FIND_BY_MODEL: {
                op: 'use',
                condition: 'MODEL_IS_NOT_APPLE'
            }
        }
        var conditions = {
            COUNTRY_IS_USA: {
                prop: 'build.country',
                op: 'equal',
                value: 'USA'
            },
            MODEL_IS_NOT_APPLE: {
                prop: 'build.model',
                op: 'nequal',
                value: 'APPLE'
            }
        }
        return queryBuilder(expressions, conditions).then((query) => {
            query['build.country'].should.equal('USA')
            Object.keys(query).length.should.equal(2)
        })
    })
    it('Combine simple conditions inside an expression', () => {
        var expressions = {
            FIND_BY_COUNTRY_OR_MODEL: {
                op: 'or',
                left: 'COUNTRY_IS_USA',
                right: 'MODEL_IS_NOT_APPLE'
            }
        }
        var conditions = {
            COUNTRY_IS_USA: {
                prop: 'build.country',
                op: 'equal',
                value: 'USA'
            },
            MODEL_IS_NOT_APPLE: {
                prop: 'build.model',
                op: 'nequal',
                value: 'APPLE'
            }
        }
        return queryBuilder(expressions, conditions).then((query) => {
            query['$or'].length.should.equal(2)
            query['$or'][0]['build.country'].should.equal('USA')
        })
    })
    it('Combine expressions (recursive build)', () => {
        var expressions = {
            FIND_SMARTPHONE_USERS_IN_USA: {
                op: 'and',
                left: 'COUNTRY_IS_USA',
                right: {
                    op: 'or',
                    left: 'MODEL_IS_APPLE',
                    right: 'MODEL_IS_SAMSUNG'
                }
            }
        }
        var conditions = {
            COUNTRY_IS_USA: {
                prop: 'build.country',
                op: 'equal',
                value: 'USA'
            },
            MODEL_IS_APPLE: {
                prop: 'build.model',
                op: 'equal',
                value: 'APPLE'
            },
            MODEL_IS_SAMSUNG: {
                prop: 'build.model',
                op: 'equal',
                value: 'SAMSUNG'
            }
        }
        return queryBuilder(expressions, conditions).then((query) => {
            query['$and'].length.should.equal(2)
            query['$and'][1]['$or'][1]['build.model'].should.equal('SAMSUNG')
        })
    })
})
