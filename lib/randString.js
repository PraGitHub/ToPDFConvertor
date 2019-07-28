const magicArray = [
    108,
    105,
    97,
    114,
    106,
    114,
    97,
    111,
    107,
    103
];

const charArray = 'qwerty0uiopas1dfghjk2lzxcv3bnmQW4ERTYU5IOPAS6DFGH7JKL8ZXCVB9NM';
const maxLength = charArray.length;

const getRandString = (length = 40) =>{
    var str = '';
    const start = Math.floor(Math.random() * new Date().getTime());
    const times = Math.floor(length / 10);
    const extra = length % 10;
    for(let i=start; i<start+times; i++){
        magicArray.forEach((element) => {
            var num = i * element * Number(new Date().getTime());
            num = num % maxLength;
            str = str + charArray.charAt(num);
        });
    }
    for(let i=0; i<extra; i++){
        const element = magicArray[i];
        var num = i * element * Number(new Date().getTime());
        num = num % maxLength;
        str = str + charArray.charAt(num);
    }
    return str;
}

module.exports = getRandString;

