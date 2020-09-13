const {
    Worker,
    isMainThread,
    parentPort
} = require('worker_threads');

if (isMainThread) {

    function initWorker(main, tfjs='@tensorflow/tfjs') {
        let worker = new Worker(__filename);
        worker.postMessage({
            action: 'init',
            data: {
                tfjs,
                main
            }
        });

        return new Promise((resolve, reject) => {
            worker.on('message', (e) => {
                if (e.action === 'init') {
                    resolve(worker);
                }
            });
            worker.on('error', (e) => {
                reject(e);
            })
        });
    }
    function predict(worker, input) {
        return new Promise(resolve => {
            worker.postMessage({
                action: 'data',
                data: input
            });
            worker.on('message', (e) => {
                if (e.action === 'predict') {
                    resolve(e.data);
                }
            });
        });
    }

    module.exports = {
        predict,
        initWorker
    }

} else {
    let model;
    let predict;
    let train;
    let tf;

    parentPort.on('message', (e) => {
        switch (e.action) {
            case 'init':
                const {
                    tfjs, main
                } = e.data;
                tf = require(tfjs);
                const ret = require(main);
                model = ret.buildModel(tf);
                predict = ret.predict;
                train = ret.train ? ret.train : () => {};
                parentPort.postMessage({action: 'init', status: 'success'});
                break;
            case 'data':
                input = e.data;
                if (model && predict) {
                    let res = predict(tf, model, input);
                    parentPort.postMessage({action: 'predict', data: res});
                }
                break;
            default:
                break;
        }
    });
}