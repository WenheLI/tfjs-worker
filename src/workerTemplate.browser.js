let input;
let model;
let predict;

self.addEventListener('message', (e) => {
    const {data} = e;
    switch (data.action) {
        case 'init':
            const {tfjs, main} = data.data;
            importScripts(tfjs);
            importScripts(main);
            const ret = main({[alias]: tf});
            model = ret.model;
            predict = ret.predict;
            break;
        case 'data':
            input = data.data;
            if (model && predict) {
                let res = predict(model, input);
                self.postMessage('predict', res);
            }
            break;
        default:
            break;

    }
});