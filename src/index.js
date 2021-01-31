import { 
    positiveInt,
    isPositiveInt,
    isObject,
    pipe,
    round as toFixed,
} from './lib/utils.js'
import timeit from './core/timeit.js'

class Timit {
    constructor(option) {
        this.option = Object.assign({
            funcs: [],
            argsList: [[]],
            repeat: 5,
            numbers: 1,
            output: log,
            digits: 3,
        }, option)
    }

    time(...params) {
        const option = pipe(params, overload, addendum(this.option), standard, validate)
        const { funcs, argsList, repeat, numbers, output } = option
        const data = timeit(funcs, argsList, repeat, numbers)
        const pipes = [stat, round]
        if (typeof output === 'function') {
            pipes.push(output)
        }
        return pipe({data, option}, ...pipes)
    }
}

function overload(params) {
    let option = params[0]
    if (typeof option === 'object' && !Array.isArray(option)) {
        return option
    }

    let i = Array.isArray(option) ? 1 : params.findIndex(v => typeof v !== 'function')
    if (i === -1) i = params.length
    const funcs = params.slice(0, i).flat();
    const others = params.slice(i);
    if (others.length < 3 && isPositiveInt(others[0])) {
        others.unshift(undefined);
    }
    const [ argsList, repeat, numbers ] = others;
    return {
        funcs: funcs.length ? funcs : undefined,
        argsList,
        repeat,
        numbers,
    }
}

function addendum(patch) {
    return obj =>  {
        let data = Object.entries(obj).reduce((o, [key, value]) => {
            if (value !== undefined) {
                o[key] = value
            }
            return o
        }, {})
        return Object.assign(Object.create(null), patch, data)
    }
}

function standard({funcs, argsList, repeat, numbers, output, digits}) {
    return {
        funcs: funcs ? [].concat(funcs) : [],
        argsList: [].concat(argsList).map(v => [].concat(v)),
        repeat: positiveInt(repeat),
        numbers: positiveInt(numbers),
        digits: parseInt(digits),
        output: output,
    }
}

function validate(option) {
    const { funcs, digits } = option
    if (!(funcs.length && funcs.every(value => typeof value === 'function'))) {
        throw new TypeError('The param funcs is required a array of functions!')
    }
    if (isNaN(digits)) {
        throw new TypeError('The param digits is required int number!')
    }
    return option
}

function stat(res) {
    const data = res.data
    const average = data.map(item => item.map(values => {
        const sum = values.reduce((a, b) => a + b)
        return sum / values.length
    }))
    const min = data.map(item => item.map(values => Math.min(...values)))
    const max = data.map(item => item.map(values => Math.max(...values)))
    return {
        stat: {
            average,
            min,
            max, 
        },
        ...res,
    }
}

function round(res) {
    const { data: oData, stat: oStat, option: { digits }} = res
    const data = oData.map(item => 
        item.map(values => 
            values.map(value => toFixed(value, digits))
        )
    )
    const stat = Object.entries(oStat).reduce((o, [key, value]) => {
        o[key] = value.map(item => 
            item.map(value => toFixed(value, digits))
        )
        return o;
    }, Object.create(null))

    return {
        data,
        stat,
        option: res.option
    } 
}

function log({data, stat, option}) {
    const funcs = option.funcs.map((fn, i) => fn.name ||`(anonymous${i})`)
    const argsList = option.argsList.map(args => JSON.stringify(args).slice(1, -1))
    const logData = data.map((v, i) => {
        const item = Object.assign(Object.create(null), {
            '(arguments)': argsList[i]
        })
        return funcs.reduce((item, key, index) => {
            item[key] = stat.average[i][index]
            return item
        }, item)
    })
    if (data.length > 1) {
        console.table(logData)
        return logData
    }
    
    const records = data[0];
    const rows = records[0].map((v, i) => {
        return funcs.reduce((item, key, index) => {
            item[key] = records[index][i]
            return item
        }, Object.create(null))
    });
    if (rows.length > 1)  {
        const average = logData[0]
        delete average['(arguments)']
        rows['average'] = average
    }
    console.table(rows)
    return rows
}

export default function timit(option) {
    if (new.target) {
        if (!isObject(option)) {
            throw new TypeError('option required Object type!')
        }
        return new Timit(option)
    }
    if (!timit.__instance) {
        timit.__instance = new Timit()
    }
    return timit.__instance.time(...arguments)
}
