function intToBinary(num) {
    const stack = [];

    while (num > 0) {
        stack.push(num % 2);
        num = Math.floor(num / 2);    
    }

    return stack.reverse().join('');
}

const bin = intToBinary(123)
console.log(bin);
console.log(parseInt(bin, 2));