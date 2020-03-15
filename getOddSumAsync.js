(() => {
    
    const {
        add,
        mod,
        equal,
        less,
    } = Homework;

/* Промисификация необходимых функций */

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


/*  Основная функция поиска нечетных чисел.
    Создаем два счетчика, начатых итераций и законченных.
    Законченные проверяем через setTimeout. (функция checkReady).
    Начатые проверяем каждую итерацию с длинной всего массива.
    Изменение суммы и счетчика конечных итераций нужно делать
    по принципу транзакций, чтобы не было перезаписей асинхронных результатов,
    для этого я ввожу булевый флаг, если он отрицательный -
    откладываю задачу через setTimeout.
    Экспортирую функцию через привязку к window.
*/

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
                const value = await new Promise(resolve => {
                    a.get(startedCounter, (res) => resolve(res));
                });
        
                (async function changeSummAndEndedCounter() {
                    if (!transaction) {
                        transaction = true;
                        if (await modPromise(value, 2)) {
                            summ = await addPromise(summ, value);
                        }
                        endedCounter = await addPromise(endedCounter, 1);
                        transaction = false;
                    } else {
                        setTimeout(changeSummAndEndedCounter, 100);       
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