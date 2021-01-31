const useHrtime = globalThis.process && globalThis.process.hrtime

const now = useHrtime 
    ? globalThis.process.hrtime.bigint.bind(globalThis.process.hrtime)
    : globalThis.performance.now.bind(globalThis.performance)

const toMillisecond = useHrtime ? value => parseInt(value) / 1e6 : value => value;

export { now, toMillisecond }