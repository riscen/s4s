class Perceptron {
	constructor() {
		this._weights = [];
		this._error = []
		this._trained = false;
	}

	get weights() {
		return this._weights;
	}

	get error() {
		return this._error;
	}

	get trained() {
		return this._trained;
	}

	/*
	*Weights are equal to the dimension of the input plus 1.
	*This extra weight is the bias, and has a const value of 1.
	*/
	initWeights(inputDataDimm) {
		for(let i = 0; i < inputDataDimm+1; i++) 
			this.weights.push(((Math.random()*3)+1)%3-1);
	}

	train(x, y, learningRate, epochs, progressBar=null, progressValue=null) {
		if(!this.checkValidData(x, y)) {
			return false;
		}
		let error, i = 0, done = false;
		this.initWeights(x[0].length);
		while(!done && i < epochs) {
			done = true;
			for(let j = 0; j < x.length; j++) {
				error = y[j] - this.calculateOutput(x[j]);
				if(error != 0) {
					done = false;
					this.updateWeights(x[j], error, learningRate);
				}
			}
			i++;
			if(progressBar != null) {
				progressBar.value = i;
				progressValue.innerHTML = i;
			}
		}
		if (done) {
			this._trained = true;
			return true;
		}
		return false;
	}

	/*
	*sum(w*x)-bias
	*bias = w[0]
	*sum(w[i+1]*x[i])-w[0]
	*/
	calculateOutput(x) {
		let output = this.weights[0];
		for(let i = 0; i < x.length; i++) {
			output += x[i]*this.weights[i+1];
		}
		return (output >= 0)?1:0;
	}

	updateWeights(x, error, learningRate) {
		this.weights[0] += learningRate*error;
		for(let i = 0; i < x.length; i++) 
			this.weights[i+1] += learningRate*x[i]*error;
	}

	checkValidData(inputData, outputData) {
		if(inputData.length === 0 || outputData.length === 0 || 
			inputData.length != outputData.length) {
			return false;
		}
		return true;
	}
}