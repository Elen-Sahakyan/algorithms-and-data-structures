class Priority_Queue {
    #heap;
    #size;
    #minHeap = false;

    constructor(cmp = (a, b) => a - b) {
        if(typeof cmp !== 'function') {
            throw new Error('compare function must be a function');
        }
        if(cmp(1, 2) < 0) {
            this.#minHeap = true;
        } 

        this.#heap = [];
        this.#size = 0;
    }

    /* ========== Basic State ========== */

    size() {
        return this.#size;
    }

    is_empty() {
        return this.#size === 0;
    }

    clear() {
        this.#heap = [];
        this.#size = 0;
    }

    /* ========== Access Operations ========== */

    peek() {
        if(this.is_empty()) {
            return;
        }
        return this.#heap[0];
    }

    /* ========== Modification Operations ========== */

    add(value) {
        if(!value) {
            throw new Error('value cannot be empty');
        }

        this.#heap.push(value);

        if(this.#minHeap) {
            this.#shiftUp_for_min_heap(this.#size);
        } else {
            this.#shiftUp_for_max_heap(this.#size);
        }

        ++this.#size;
    }

    pop() {
        if(this.is_empty()) return;

        this.#swap(0, this.#size - 1);
        const value = this.#heap.pop();

        if(this.#minHeap) {
            this.#shiftDown_for_min_heap(0);
        } else {
            this.#shiftDown_for_max_heap(0);
        }

        --this.#size;
        return value;
    }

    remove(value) {
        const idx = this.#indexOf(value);
        if(idx === undefined) return;

        this.#swap(idx, this.#size - 1);
        this.#heap.pop();
        --this.#size;

        if(this.#minHeap) {
            this.#shiftUp_for_min_heap(idx);
            this.#shiftDown_for_min_heap(idx);
        } else {
            this.#shiftUp_for_max_heap(idx);
            this.#shiftDown_for_max_heap(idx);
        }

    }

    /* ========== Heap Utilities ========== */

    toArray() {
        const arr = new Array(this.#size);
        let i = 0;
        for(const value of this) {
            arr[i++] = value;
        }
        return arr;
    }

    /* ========== Index Helpers ========== */

    #get_parent(idx) {
        return Math.floor((idx - 1) / 2);
    }

    #get_left_child(idx) {
        return 2 * idx + 1;
    }

    #get_right_child(idx) {
        return 2 * idx + 2;
    }

    #swap(i, j) {
        [this.#heap[i], this.#heap[j]] = [this.#heap[j],  this.#heap[i]];
    }

    /* ========== Heap Maintainance ========== */

    #shiftUp_for_min_heap(idx) {
        if(idx == 0) return;
        const parent = this.#get_parent(idx);

        if(this.#heap[idx] < this.#heap[parent]) {
            this.#swap(idx, parent);
            this.#shiftUp_for_min_heap(parent);
        }
    }
    
    #shiftUp_for_max_heap(idx) {
        if(idx == 0) return;
        const parent = this.#get_parent(idx);

        if(this.#heap[idx] > this.#heap[parent]) {
            this.#swap(idx, parent);
            this.#shiftUp_for_max_heap(parent);
        }
    }

    #shiftDown_for_min_heap(idx) {
        const leftChild = this.#get_left_child(idx);
        const rightChild = this.#get_right_child(idx);
        let min = idx;

        if(leftChild < this.#size && this.#heap[min] > this.#heap[leftChild]) {
            min = leftChild;
        }
        if(rightChild < this.#size && this.#heap[min] > this.#heap[rightChild]) {
            min = rightChild;
        }

        if(min !== idx) {
            this.#swap(idx, min);
            this.#shiftDown_for_min_heap(min);
        }
    }

    #shiftDown_for_max_heap(idx) {
        const leftChild = this.#get_left_child(idx);
        const rightChild = this.#get_right_child(idx);
        let max = idx;

        if(this.#heap[max] < this.#heap[leftChild]) {
            max = leftChild;
        }

        if(this.#heap[max] < this.#heap[rightChild]) {
            max = rightChild;
        }
        if(max !== idx) {
            this.#swap(idx, max);
            this.#shiftDown_for_max_heap(max);
        }
    }

    /* ========== Search Utility ========== */

    #indexOf(value) {
        for(let i = 0; i < this.#size; ++i) {
            if(this.#heap[i] === value) return i;
        }
    }

    /* ========== Advanced Heap Operations ========== */

    static heapify(array) {
        const heap = new Priority_Queue();
        const size = array.length;
        for(let i = 0; i < size; ++i) {
            heap.add(array[i]);
        }
        return heap;
    }

    contains(value) {
        for(const val of this) {
            if(val === value) return true;
        }
        return false;
    }

    /* ========== Iteration ========== */

    [Symbol.iterator]() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                if(i >= ourThis.#size) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                return {
                    value: ourThis.#heap[i++],
                    done: false
                }
            }
        }
    }

    values() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                if(i >= ourThis.#size) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                return {
                    value: ourThis.#heap[i++],
                    done: false
                }
            }
        }
    }

    entries() {
        const ourThis = this;
        let i = 0;
        return {
            next() {
                if(i >= ourThis.#size) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                return {
                    value: [i, ourThis.#heap[i++]],
                    done: false
                }
            }
        }
    }

}

// const pq = new Priority_Queue((a, b) => a - b);

// console.log(pq.size());
// console.log(pq.is_empty());
// pq.clear();
// pq.add(10);
// pq.add(4);
// pq.add(5);
// console.log(pq.peek());
// pq.add(2);
// pq.add(3);
// pq.add(6);
// console.log(pq.pop());
// for(const val of pq) {
//     console.log(val);
// }
// pq.add(2);

// console.log(pq.toArray());
// pq.remove(10);

// console.log(pq.toArray());

// const entries = pq.entries();
// console.log(entries.next());
// const values = pq.values();
// console.log(values.next());


// const heap = Priority_Queue.heapify([1, 4, 6, 8, 3]);
// console.log(heap.contains(1));






