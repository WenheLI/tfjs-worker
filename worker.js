const buildModel = (tf) => {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    return model;
}

const predict = (tf, model, input) => {
    const x = tf.tensor2d(input, [1, 1]);
    return model.predict(x).dataSync();
}

module.exports = {
    buildModel,
    predict
}