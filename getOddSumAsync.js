(() => {
    
    const {
        add,
        mod,
        equal,
        less,
    } = Homework;

    const promisify = (fn) => {
        return (...args) => {
            return new Promise((resolve) => {
            function cb(res) {
                return resolve(res); 
                }
                args.push(cb)
                fn.call(this, ...args)
            });
        }
    }
    
    const addPromise = promisify(add);
    const modPromise = promisify(mod);
    const equalPromise = promisify(equal);
    const lessPromise = promisify(less);
    
    function getOddSumAsync(a, cb) {

        const checkReady = (len) => {
            setTimeout(async () => {
                if (await equalPromise(endedCounter, len)) {
                    cb(summ);
                } else {
                    checkReady(len);
                }
            }, 100);
        }
        
        let summ = 0;
        let transaction = false;
        let endedCounter = 0;
        let startedCounter = 0;
    
        async function iterate(len) {
            (async () => {
                const value = await new Promise(resolve => a.get(startedCounter, (res) => resolve(res)));
        
                (async function changeGlobalVariables() {
                    if (!transaction) {
                        transaction = true;
                        if (await modPromise(value, 2)) {
                            summ = await addPromise(summ, value);
                        }
                        endedCounter = await addPromise(endedCounter, 1);
                        transaction = false;
                    } else {
                        setTimeout(changeGlobalVariables, 100);       
                    }
                })();
            })();
    
            startedCounter = await addPromise(startedCounter, 1);
    
            if (await lessPromise(startedCounter, len)) {
                iterate(len);
            } else {
                checkReady(len);
            }
        }
    
        a.length(len => iterate(len));
    }

    window.getOddSumAsync = getOddSumAsync;
})();