class Queue {
    #queue;
    #front;
    #back;
    #size;
    #cap;

    constructor(cap) {
        this.#queue = new Array(cap).fill(0);
        this.#front = 0;
        this.#back = -1;
        this.#size = 0;
        this.#cap = cap;
    }

    /* ========== Basic State ========== */

    size() {
        return this.#size;
    }

    capacity() {
        return this.#cap;
    }

    is_empty() {
        return this.#size === 0;
    }

    is_full() {
        return this.#size === this.#cap;
    }

    clear() {
        this.#size = 0;
        this.#front = 0;
        this.#back = 0;
    }

    /* ========== Core Queue Operations ========== */

    enqueue(value) {
        if(this.is_full()) {
            throw new Error('maximum queue size reached');
        }
        this.#back = (this.#back + 1) % this.#cap;
        this.#queue[this.#back] = value;
        ++this.#size;
    }

    dequeue() {
        if(this.is_empty()) {
            throw new Error('dequeue failed: queue is empty');
        }
        const first = this.#queue[this.#front];
        this.#queue[this.#front] = 0;
        this.#front = (this.#front + 1) % this.#cap;
        --this.#size;
        return first;
    }

    peek() {
        if(this.is_empty()) {
            throw new Error('queue is empty');
        }
        return this.#queue[this.#front];
    }

    back() {
        if(this.is_empty()) {
            throw new Error('queue is empty');
        }
        return this.#queue[this.#back];
    }

    print() {
        for(let i = 0; i < this.#size; ++i) {
            const index = (this.#front + i) % this.#cap;
            console.log(this.#queue[index]);
        }
    }

}

module.exports = Queue;

// const queue = new Queue(10);

// console.log(queue.is_empty());
// console.log(queue.is_full());
// queue.enqueue(500);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(10);
// queue.enqueue(1000);
// queue.enqueue(10);
// console.log(queue.dequeue());
// queue.dequeue()
// console.log(queue.size());
// console.log(queue.capacity());
// console.log(queue.peek());
// console.log(queue.back());
// queue.print();








