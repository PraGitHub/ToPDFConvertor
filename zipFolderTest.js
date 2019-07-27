const zipFolder = require('./zipFolder');
const randString = require('./randString');

zipFolder(__dirname+'/node_modules', __dirname+'/' + randString(20) + '.zip', (result, err) => {
    if(err){
        console.log('zipFolder returned error = ', err);
    }else{
        console.log('zipFolder result = ', result);
    }
});