const { red, white } = require('chalk')
const { exec } = require('child_process');

module.exports = function checkforupdate() {

    exec('git status', (err, stdout, stderr) => {
        //Coming Soon
    });
}