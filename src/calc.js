//
let A = [-160, -30]
let B = [110, 50]
let M = [65, 148]

// BA
let BA = [
    (B[0] - A[0]),
    (B[1] - A[1])
]
let mBA = Math.sqrt((BA[0] * BA[0]) + (BA[1] * BA[1]))
console.log({ BA, mBA })
// MA
let MA = [
    (M[0] - A[0]),
    (M[1] - A[1])
]
let mMA = Math.sqrt((MA[0] * MA[0]) + (MA[1] * MA[1]))
console.log({ MA, mMA })
// unit mBA
let uBA = [
    (BA[0] / mBA),
    (BA[1] / mBA)
]
console.log({ uBA })
// dot MA and uBA
let dMAuBA = (MA[0] * uBA[0]) + (MA[1] * uBA[1])
console.log({ dMAuBA })
// dot MA and uBA / mBA
let deg = dMAuBA / mBA
console.log({ deg }, Math.acos(deg) * 180 / Math.PI)
