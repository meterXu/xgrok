import program from  'commander'

function range (val) {
    return val.split('..').map(Number);
}

function list (val) {
    return val.split(',')
}

//定义参数,以及参数内容的描述
program
    .usage('[options] [value ...]')
    .option('-p, --port <int>', 'port number,default:11525')

//添加额外的文档描述
program.on('help', function() {
    console.log('   Examples:')
    console.log('')
    console.log('       # input string, integer and float')
    console.log('       $ ./nodecmd.js -m \"a string\" -i 1 -f 1.01')
    console.log('')

    console.log('       # input range 1 - 3')
    console.log('       $ ./nodecmd.js -r 1..3')
    console.log('')

    console.log('       # input list: [1,2,3]')
    console.log('       $ ./nodecmd.js -l 1,2,3')
    console.log('')
});

//解析commandline arguments
program.parse(process.argv)

module.exports={
    port:program.port
};
