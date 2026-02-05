function assert(condition, message, errorType = TypeError) {
    if(!condition) {
        throw new errorType(message);
    }
}

const Validators = {
    isValidCapacity(value) {
        return Number.isInteger(value) && value >= 0;
    },
    isValidIndex(value) {
        return Number.isInteger(value) && value >= 0;
    },
    isValidValue(value) {
        return Number.isInteger(value);
    },
    isFunction(value) {
        return typeof value === 'function';
    }
}

class DynamicArray {
    #arr;
    #size;
    #capacity;
    #GROWTH = 2;

    constructor (cap = 0, fill = 0) {
        assert(Validators.isValidCapacity(cap), 'capacity must be an integer >= 0');
        assert(Validators.isValidValue(fill), "fill-value must be an integer");
        this.#arr = new Int32Array(cap);
        this.#size = 0;
        this.#capacity = cap;
    
    }

    size() {
        return this.#size;
    }

    capacity () {
        return this.#capacity;
    }

    empty() {
        return this.#size === 0;
    }

    reserve(n) {
        assert(Validators.isValidCapacity(n), 'capacity must be an integer >= 0');

        if(n > this.#capacity) {
            // copy the values in temporary variable, which is bigger than the array
            const tmp = new Int32Array(n);
            
            for(let i = 0; i < this.#size; ++i) {
                tmp[i] = this.#arr[i];
            }

            // change the referance of the array
            this.#arr = tmp;

            // modify the capacity
            this.#capacity = n;
        }
    }

    shrinkToFit() {
        this.#capacity = this.#size;
    }

    clear() {
        this.#size = 0;
    }

    /* =========== Element Access ========== */
    
    at(i) {
        assert(Validators.isValidIndex(i) && i < this.#size, 'cannot access an invalid index');
        return this.#arr[i];
    }

    set(i, value) {
        assert(Validators.isValidIndex(i) && i < this.#size, 'cannot mutate an invalid index');
        assert(Validators.isValidValue(value), 'value for set must be an integer');
        this.#arr[i] = value;
    }

    front() {
        if(this.empty()) {
            throw new Error('the array is empty');
        }
        return this.#arr[0];    
    }

    back() {
        if(this.empty()) {
            throw new Error('the array is empty');
        }
        return this.#arr[this.#size - 1];
    }

    toArray () {
        const tmp = new Array(this.#size);
        for(let i = 0; i < this.#size; ++i) {
            tmp[i] = this.#arr[i];
        }
        return tmp;
    }

    /* ========== Modifiers ========== */

    pushBack(value) {
        assert(Validators.isValidValue(value), 'push-value must be an integer');

        ++this.#size;

        //if size and capacity are equal, resize the capacity
        if(this.#size >= this.#capacity) {
            this.#resize(this.#size * this.#GROWTH); 
        }

        this.set(this.#size - 1, value);
    }

    popBack() {
        if(this.empty()) {
            throw new Error('pop failed: the array is empty');
        }

        const last = this.at(this.#size - 1);
        --this.#size;
        return last;
    }

    insert(pos, value) {
        assert(Validators.isValidIndex(pos) && pos <= this.#size, 'cannot insert at invalid position');
        assert(Validators.isValidValue(value), 'insert-value must be an integer');

        if(this.#size === this.#capacity) {
            this.#resize(this.#size * this.#GROWTH);
        }

        //shift elements to the right by one
        for(let i = this.#size; i > pos; --i) {
            this.#arr[i] = this.#arr[i - 1];
        }

        this.#arr[pos] = value;
        ++this.#size;
    }

    erase(pos) {
        assert(Validators.isValidIndex(pos) && pos < this.#size, 'cannot erase an invalid position');
        
        //shift elements to the left by one
        for(let i = pos; i < this.#size - 1; ++i) {
            [this.#arr[i], this.#arr[i + 1]] = [this.#arr[i + 1], this.#arr[i]];
        }

        --this.#size;
    }
    
    #resize(n) {
        assert(Validators.isValidCapacity(n), 'resize failed: invalid capacity');
        
        if(n < this.#size) {
            this.#size = n;
            this.#capacity = this.#size;
        } else {
            const tmp = new Int32Array(n);
            for(let i = 0; i < this.#size; ++i) {
                tmp[i] = this.#arr[i];
            }
            this.#arr = tmp;
            this.#capacity = n;
        }
    }

    swap(i, j) {
        assert(Validators.isValidIndex(i) &&
            i < this.#size &&
            Validators.isValidIndex(j) &&
            j < this.#size,
            'swap failed: invalid index/indexes'
        );

        [this.#arr[i], this.#arr[j]] = [this.#arr[j], this.#arr[i]];
    }

    [Symbol.iterator]() {
        const ourThis = this;
        let i = 0;
        return {
            next: function() {
                return {
                    value: ourThis.#arr[i++],
                    done: i > ourThis.#size,
                }
            }
        }
    }
    
    values() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                return {
                    value: ourThis.#arr[i++],
                    done: i > ourThis.#size,
                }
            }
        }
    }

    keys() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                return {
                    value: i++,
                    done: i > ourThis.#size
                }
            }
        }
    }

    entries() {
        let i = 0;
        return {
            next: () => {
                return {
                    value: [i, this.#arr[i++]],
                    done: i > this.#size,
                }
            }
        }
    }

    /* ========== High Order ========== */

    forEach(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        for(let i = 0; i < this.#size; ++i) {
            fn.call(thisArg, this.#arr[i], i, this.#arr);
        }
    }

    map(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        const elements = new DynamicArray();
        
        for(let i = 0; i < this.#size; ++i) {
            const newValue = fn.call(thisArg, this.at(i), i, this.#arr);
            elements.pushBack(newValue);
        }
        
        return elements;
    }

    filter(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');        
        
        const filtered = new DynamicArray();
        
        for(let i = 0; i < this.#size; ++i) {
            if(fn.call(thisArg, this.at(i), i, this.#arr) === true) {
                filtered.pushBack(this.at(i));
            }
        }
        
        return filtered;
    }

    reduce(fn, initial) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        if(this.empty() && initial === 'undefined') {
            throw new TypeError(`array is empty and/or initial value is missing: cannot run reduce`);
        }
        
        let accumulator;
        let i = 0;

        if(initial !== undefined) {
            accumulator = initial;
        } else {
            accumulator = this.at(0);
            i = 1;
        }

        while(i < this.#size) {
            accumulator = fn(accumulator, this.at(i), i, this.#arr);
             ++i;
        }

        return accumulator;
    }

    some(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        for(let i = 0; i < this.#size; ++i) {
            if(fn.call(thisArg, this.at(i), i, this.#arr) === true) {
                return true;
            }
        }
        
        return false;
    }

    every(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        for(let i = 0; i < this.#size; ++i) {
            if(fn.call(thisArg, this.at(i), i, this.#arr) === false) {
                return false;
            }
        }
        
        return true;
    }

    find(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        for(let i = 0; i < this.#size; ++i) {
            if(fn.call(thisArg, this.at(i), i, this.#arr) === true) {
                return this.at(i);
            }
        }
    }

    findIndex(fn, thisArg) {
        assert(Validators.isFunction(fn), 'callback must be a function');
        
        for(let i = 0; i < this.#size; ++i) {
            if(fn.call(thisArg, this.at(i), i, this.#arr) === true) {
                return i;
            }
        }
        
        return -1;
    }

    includes(value) {
        assert(Validators.isValidValue(value), 'value must be an integer');
        
        for(let i = 0; i < this.#size; ++i) {
            if(this.at(i) === value) {
                return true;
            }
        }
        
        return false;
    }

    /* ========== Extensions ========== */

    reverse() {
        if(!(this.empty())) {
            
            let i = 0;
            let j = this.#size - 1;
            
            while(i < j) {
                this.swap(i++, j--);
            }
        }
    }

    sort(compareFn) {
        compareFn = typeof compareFn === 'function' ? compareFn : (a, b) => a - b;

        const insertionSort = () => {
            for(let i = 1; i < this.#size; ++i) {
                const key = this.#arr[i];
                let j = i - 1;

                while( j >= 0 && compareFn(this.#arr[j], key) > 0) {
                    this.#arr[j + 1] = this.#arr[j];
                    --j;
                }
                this.#arr[j + 1] = key;
            }
        };

        let min = this.#arr[0];
        let max = this.#arr[0];
        
        for(let i = 1; i < this.#size; ++i) {
            if(this.#arr[i] < min) {
                min = this.#arr[i];
            }
            if(this.#arr[i] > max) {
                max = this.#arr[i];
            }
        }

        const countingSort = () => {
            const range = max - min + 1;
            const count = new Array(range).fill(0);
            
            for(let i = 0; i < this.#size; ++i) {
                ++count[this.#arr[i] - min];
            }
            
            for(let i = 1; i < range; ++i) {
                count[i] = count[i - 1];
            }

            const output = new Int32Array(this.#size);

            for(let i = this.#size - 1; i >= 0; --i) {
                const value = this.#arr[i];
                const index = value - min;
                const position = count[index] - 1; 
                output[position] = value;
                --count[index];
            }
            
            for(let i = 0; i < this.#size; ++i) {
                this.#arr[i] = output[i];
            }
        };

        const partition = (low, high) => {
            let pivot = this.#arr[low];
            let i = low + 1;
            let j = high;

            while(i <= j) {
                // if current element is smaller than pivot, it must stay at the left side of pivot
                while(compareFn(this.#arr[i], pivot) <= 0) {
                    ++i;
                }
                //if current element is bigger than pivot it must stay at the right side
                while(compareFn(this.#arr[j], pivot) > 0) {
                    --j;
                }
                if(i < j) {
                    this.swap(i, j);
                }
            }
            [this.#arr[low], this.#arr[j]] = [this.#arr[j], this.#arr[low]];
            return j;
        }

        const quickSort = (low = 0, high = this.#size - 1) => {
            if(low < high) {
                const pivotIndex = partition(low, high);
                quickSort(low, pivotIndex - 1);
                quickSort(pivotIndex + 1, high);
            }
        }

        if(this.#size <= 50) {
            insertionSort();
        }
        else if(max - min <= 100) {
            countingSort();
        } else {
            quickSort()
        }
    }

    clone() {
        const copy = new Int32Array(this.#size);
        let i = 0;
        
        for(const item of this) {
            copy[i++] = item;
        }
        
        return copy;
    }

    equals(other) {
        if(this.#size === other.size()) {
            for(let i = 0; i < this.#size; ++i) {
                let equal = false;
                if(this.#arr[i] == other.at(i)) {
                    equal = true;
                }
                if(!equal) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}

const arr = new DynamicArray(5);

for(let i = 5; i < 40; ++i) {
    arr.pushBack(i);
}

const arr1 = new DynamicArray(4, 3);

for(let i = 0; i < 10; ++i) {
    arr1.pushBack(i);
}

const arr2 = new DynamicArray(4, 3);

// console.log(`The size of array is: ${arr.size()}`);
// console.log(`Capacity is: ${arr.capacity()}`);
// console.log(`access value: ${arr.at(0)}`);
// console.log(`array is empty: ${arr.empty()}`);
// arr.set(0, 100);
// console.log(`first element ${arr.front()}`);
// console.log(`last element: ${arr.back()}`);
// arr.reserve(10);
// arr.shrinkToFit();
// console.log(`popped element: ${arr.popBack()}`);
// arr.erase(2);
// arr.swap(2, 3);
// arr.sort((a,b) => a - b);
// arr.clear();
// arr.reverse();

// console.log(arr.toArray());

// const values = arr.values()
// console.log(values.next());
// console.log(values.next());

// const keys = arr.keys();
// console.log(keys.next());
// console.log(keys.next());

// const entries = arr.entries();
// console.log(entries.next());
// console.log(entries.next());

// for(const item of arr) {
//     console.log(item);
// }

// console.log(arr.clone());
// console.log(arr1.equals(arr));

// arr1.forEach((item) => console.log(item));
// const elements = arr1.map((element) => element * 5);
// const filtered = arr1.filter((element) => element > 5);
// const reduced = arr1.reduce((acc, element) => acc + element, 100);
// console.log(reduced);

// console.log(arr1.includes(100));
// console.log(arr1.toArray());
// console.log(arr1.find((element) => element > 5));
// console.log(arr1.findIndex((element) => element === 2));
// console.log(arr1.every((element) => element >= 100));
// console.log(arr1.some((element) => element === 9));

