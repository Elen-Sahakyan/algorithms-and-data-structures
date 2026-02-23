class Deque {
    #arr;
    #cap;
    #front;
    #size;

    constructor(cap = 8) {
        if(cap < 2 || !Number.isInteger(cap)) {
            throw new Error('capacity must be an integer >= 2');
        }
        this.#cap = cap;
        this.#arr = new Array(cap).fill(null);
        this.#front = 0;
        this.#size = 0;
    }

    /* ========== Basic State ========== */

    size() {
        return this.#size;
    }

    capacity() {
        return this.#cap;
    }

    empty() {
        return this.#size === 0;
    }

    full() {
        return this.#size === this.#cap;
    }

    /* ========== Internal Helpers ========== */

    #mod(i) {
        return i % this.#cap;
    }

    #index(i) {
        return this.#mod(this.#front + i);
    }

    #ensureCapacityForOneMore() {
        if(this.#size < this.#cap) return;
        let arr = new Array(this.#cap * 2).fill(null);
        for(let i = 0; i < this.#size; ++i) {
            arr[i] = this.#arr[this.#index(i)];
        }
        this.#arr = arr;
        this.#front = 0;
        this.#cap *= 2;    }

    /* ========== Element Access ========== */ 
    
    front() {
        if(this.empty()) {
            throw new Error('invalid action: deque is empty');
        }
        return this.#arr[this.#front];
    }

    back() {
        if(this.empty()) {
            throw new Error('invalid action: deque is empty');
        }
        return this.#arr[this.#index(this.#size - 1)]; 
    }

    at(i) {
        if(i < 0 || i >= this.#size) {
            throw new Error('invalid index');
        }
        return this.#arr[this.#index(i)];
    }

    /* ========== Modifiers ========== */

    push_back(value) {
        if(!value) return;
        this.#ensureCapacityForOneMore();
        let idx = this.#index(this.#size);
        this.#arr[idx] = value;
        ++this.#size;
    }

    push_front(value) {
        if(!value) return;
        this.#ensureCapacityForOneMore();
        this.#front = (this.#front - 1 + this.#cap) % this.#cap;
        this.#arr[this.#front] = value;
        ++this.#size;
    }

    pop_front() {
        if(this.empty()) {
            throw new Error('pop failed: deque is empty');
        }
        let removed = this.#arr[this.#front];
        this.#arr[this.#front] = null;
        this.#front = (this.#front + 1 + this.#cap) % this.#cap;
        --this.#size;
        return removed;
    }

    pop_back() {
        if(this.empty()) {
            throw new Error('pop failed: deque is empty');
        }
        let removed = this.#arr[this.#index(this.#size - 1)];
        this.#arr[this.#index(this.#size - 1)] = null;
        --this.#size;
        return removed;        
    }

    clear() {
        for(let i = 0; i < this.#size; ++i) {
            this.#arr[i] = null;
        }
        this.#front = 0;
        this.#size = 0;
    }

    /* ========== Extended Professional Methods ========== */

    reserve(newCapacity) {
        if(newCapacity < 1 || !Number.isInteger(newCapacity)) {
            throw new Error('reserve failed: capacity must be an integer >= 1');
        }
        if(newCapacity <= this.#cap) return;
        let arr = new Array(newCapacity).fill(null);
        for(let i = 0; i < this.#size; ++i) {
            arr[i] = this.#arr[this.#index(i)];
        }
        this.#arr = arr;
        this.#front = 0;
        this.#cap = newCapacity;
    }
    
    shrinkToFit() {
        if(this.#size === this.#cap) return;
        const arr = new Array(this.#size);
        for(let i = 0; i < this.#size; ++i) {
            arr[i] = this.at(i);
        }
        this.#arr = arr;
        this.#front = 0;
        this.#cap = this.#size;
    }

    rotateLeft(k = 1) {
        if(this.empty()) return;
        if(!Number.isInteger(k) || k < 0) {
            throw new Error('rotation factor must be a positive integer');
        }
        k %= this.#size;
        if(k === 0) return;
        while(k--) {
            let popped = this.pop_back();
            this.push_front(popped);
        }
    }

    rotateRight(k = 1) {
        if(this.empty()) return;
        if(!Number.isInteger(k) || k < 0) {
            throw new Error('rotation factor must be a positive integer');
        }
        k %= this.#size;
        if(k === 0) return;
        while(k--) {
            let popped = this.pop_front();
            this.push_back(popped);
        }
    }

    swap(i, j) {
        if(i < 0 || i >= this.#size ||
            j < 0 || j >= this.#size
        ) {
            throw new Error('invalid index i and/or j');
        }
        let indexI = this.#index(i);
        let indexJ = this.#index(j);
        [this.#arr[indexI], this.#arr[indexJ]] = [this.#arr[indexJ], this.#arr[indexI]];
    }

    /* ========== Search and Utilities ========== */

    find(value) {
        if(!value) return;
        for(let i = 0; i < this.#size; ++i) {
            if(this.at(i) === value) {
                return i;
            }
        }
        return -1;
    }

    includes(value) {
        if(!value) return;
        for(const item of this) {
            if(item === value) {
                return true;
            }
        }
        return false;
    }

    toArray() {
        const array = new Array(this.#size);
        for(let i = 0; i < this.#size; ++i) {
            array[i] = this.at(i);
        }
        return array;
    }

    clone() {
        const deque = new Deque(this.#cap);
        deque.#size = this.#size;
        deque.#front = 0;
        for(let i = 0; i < this.#size; ++i) {
            const item = this.at(i);
            deque.#arr[i] = item === undefined 
            ? undefined
            : JSON.parse(JSON.stringify(item));
        }
        return deque;
    }

    equals(otherDeque) {
        if(!(otherDeque instanceof Deque)) {
            throw new Error('deque must be an instance of class Deque');
        }
        if(this.#size !== otherDeque.#size) {
            return false;
        }
        for(let i = 0; i < this.#size; ++i) {
            if(this.at(i) !== otherDeque.at(i)) {
                return false;
            }
        }
        return true;
    }

    /* ========== Iteration ========== */

    [Symbol.iterator]() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                return {
                    value: ourThis.#arr[ourThis.#index(i++)],
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
                    value: ourThis.#arr[ourThis.#index(i++)],
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
                    done: i > ourThis.#size,
                }
            }
        }
    }

    entries() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                return {
                    value: [i, ourThis.#arr[ourThis.#index(i++)]],
                    done: i > ourThis.#size,
                }
            }
        }
    }
    
    /* ========== Functional Style ========== */

    forEach(fn, thisArg) {
        if(typeof fn !== 'function') {
            throw new Error('callback must be a function');
        }
        for(let i = 0; i < this.#size; ++i) {
            fn.call(thisArg, this.at(i), i, this.#arr);
        }
    }

    map(fn, thisArg) {
        if(typeof fn !== 'function') {
            throw new Error('callback must be a function');
        }
        const deque = new Deque(this.#cap);
        for(let i = 0; i < this.#size; ++i) {
            const mapped = fn.call(thisArg, this.at(i), i, this.#arr);
            deque.push_back(mapped);
        }
        return deque;
    }

    filter(fn, thisArg) {
        if(typeof fn !== 'function') {
            throw new Error('callback must be a function');
        }
        const filtered = new Deque(this.#cap);
        for(let i = 0; i < this.#size; ++i) {
            const element = this.at(i);
            if(fn.call(thisArg, element, i, this.#arr) === true) {
                filtered.push_back(element);
            }
        }
        return filtered;
    }

    reduce(fn, initial) {
        if(typeof fn !== 'function') {
            throw new Error('callback must be a function');
        }
        if(this.empty() && initial === 'undefined') {
            throw new Error('deque is empty and/or initial is missing');
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
            const element = this.at(i);
            accumulator = fn(accumulator, element, i, this.#arr);
            ++i;
        }
        return accumulator;
    }


}

const deque = new Deque();

for(let i = 0; i < 20; ++i) {
    deque.push_back(i);
}

// console.log(deque.size());
// console.log(deque.capacity());
// console.log(deque.empty());
// console.log(deque.full());

// console.log('popped element ->', deque.pop_front());
// console.log('popped element ->', deque.pop_front());

// deque.clear();
// deque.shrinkToFit();
// deque.reserve(20);
// deque.rotateRight(1);
// deque.rotateLeft(1);
// deque.swap(0, 13);
// console.log('front ->', deque.front());
// console.log('back ->', deque.back());
// console.log(deque.at(8));
// console.log('size ->', deque.size());
// console.log('cap ->', deque.capacity());

// for(const item of deque) {
//     console.log(item);
// }

// console.log(deque.find(130));
// console.log(deque.includes(10));
// const arr = deque.toArray();
// console.log(arr);
// const dq = deque.clone();
// dq.push_front(1);

// for(const item of dq) {
//     console.log(item);
// }

// console.log(deque.equals(dq));

// let values = dq.values();
// console.log(values.next());
// console.log(values.next());
// console.log(values.next());

// let keys = dq.keys();
// console.log(keys.next());
// console.log(keys.next());
// console.log(keys.next());

// let entries = dq.entries();
// console.log(entries.next());
// console.log(entries.next());
// console.log(entries.next());

// deque.forEach((item) => console.log(item));

// const mapped = deque.map((item) => item * 2);
// console.log('mapped =>');
// for(const item of mapped) {
//     console.log(item);
// }

// const filtered = deque.filter((item) => item > 0);
// console.log('filtered =>');
// for(const item of filtered) {
//     console.log(item);
// }
