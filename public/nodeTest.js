const timit = require('../dist/timit.js')

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

function primesByDefine(n) {
    let count = 0
    for (let i = 2;i <= n;i++) {
        if (isPrime(i)) count++
    }
    return count
}

function primesErichsenSieve(n) {
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

function* test() {
    const testList = [
        () => timit(function primes_1000() { return primesErichsenSieve(1000) }, 5, 100),
        () => timit(primesByDefine, primesErichsenSieve, [100, 1000, 10000, 100000]),
    ]
    for(let i = 0;i < testList.length;i++) {
        yield testList[i]()
    }
    return
}

function nodeTest() {
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const gen = test()
    rl.on('line', () => {
        if (gen.next().done) {
            rl.close()
            process.exit()
        } else {
            console.log('Press Enter to continue')
        }
    });
    console.log('Press Enter to continue')
}

nodeTest()