const {initWorker, predict} = require('./src/index');
const path = require('path');
const main = async () => {
    const worker = await initWorker(path.join(__dirname, './worker.js'));
    const res = await predict(worker, [5]);
    console.log(res)
}

main()