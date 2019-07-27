const randString = require('./randString');

const num = process.argv[2] || 100;

for(let  i=1; i<=num; i++){
    const str = randString();
    console.log('length = ', str.length, ' str = ', str);
}