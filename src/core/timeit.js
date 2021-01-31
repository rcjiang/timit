import { now, toMillisecond } from './hrtime.js'

function duration(func, numbers = 1) {
    const start = now()
    while (numbers--) {
        func()
    }
    return toMillisecond(now() - start)
}

function iterate(func, repeat = 5, numbers) {
    return Array.from({length: repeat}).map(() => duration(func, numbers))
}

function timeit(funcs, argsList, repeat, numbers) {
    return argsList.map(args =>
        funcs.map(func => 
            iterate(func.bind(null, ...args), repeat, numbers)
        )
    );
}

export default timeit
