function isPrime(n) {
    if (n < 4) return n > 1
    if (n % 2 === 0 || n % 3 === 0 ) return false
    for (let i = 5;i * i <= n;i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false
        }
    }
    return true
}

export function primesByDefine(n) {
    let count = 0
    for (let i = 2;i <= n;i++) {
        if (isPrime(i)) count++
    }
    return count
}

export function primesErichsenSieve(n) {
    const flags = new Uint8Array(n + 1)
    flags.set([1, 1])
    for (let i = 2;i <= n;i++) {
        if (flags[i] === 1) {
            continue
        }
        for (let j = i*i;j <= n;j += i) {
            flags[j] = 1
        }
    }
    return flags.filter(v => v === 0).length
}