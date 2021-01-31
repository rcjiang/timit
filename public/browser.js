import timit from './index.js'
import { primesByDefine, primesErichsenSieve} from './primes.js'

function primesByDefine_100() { 
    return primesByDefine(100)
}
function primesErichsenSieve_100() { 
    return primesByDefine(100)
 }

const testList = [
    // timit(func)
    () => timit(primesByDefine_100),
    
    // timit(func, repeat)
    () => timit(primesByDefine_100, 10),
    
    // timit(func, repeat, numbers)
    () => timit(primesByDefine_100, 5, 10000),
    
    // timti(func2[, func2, ...funcN], repeat, numbers)
    () => timit(primesByDefine_100, primesErichsenSieve_100, 3, 10000),
    
    // timit(funcs, repeat, numbers)
    () => timit([primesByDefine_100, primesErichsenSieve_100], 3, 10000),
    
    // timit(anonymous function)
    () => timit(() => primesErichsenSieve(10000), 3, 1),
    
    // timit(func, argsList)
    () => timit(primesByDefine, [100, 1000, 10000]),
    
    // timit(funcs, argsList)
    () => timit([primesByDefine, primesErichsenSieve], [100, 1000, 10000]),
    
    // timit(option)
    () => timit({
        funcs: [primesByDefine, primesErichsenSieve],
        argsList: [
            [100],
            [1000], 
            [10000],
        ],
        repeat: 3,
        numbers: 1,
        digits: 4,
    }),
    
    // use class
    () => {
        const tim = new timit({
            funcs: [primesByDefine, primesErichsenSieve],
            argsList: [
                [100],
                [1000], 
                [10000], 
            ],
            repeat: 5,
            numbers: 1,
            digits: 3,
        })
    
        tim.time()
    
        tim.time({
            argsList: [10**4, 10**5, 10**6],
            repeat: 1,
            digits: 2
        })
    }
]

function browserTest() {
    const fragment = document.createDocumentFragment();
    testList.forEach(test => {
        let elPre = document.createElement('pre')
        let elCode = document.createElement('code')
        elCode.innerText = test.toString();
        elPre.appendChild(elCode)
        fragment.appendChild(elPre)
    
        let div = document.createElement('div')
        let btn = document.createElement('button')
        btn.innerText = 'test'
        btn.addEventListener('click', () => {
            console.clear()
            test()
        })
        div.appendChild(btn)
        fragment.appendChild(div)
    })
    document.querySelector('.grid').appendChild(fragment)
}

browserTest()