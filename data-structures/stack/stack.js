class Stack {
    #stack;
    #size;
    #cap;

    constructor(cap) {
        this.#stack = new Array(cap).fill(0);
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
    }

    /* ========== Core Stack Operations ========== */

    push(value) {
        if(this.is_full()) {
            throw new Error('maximum stack size reached');
        }
        this.#stack[this.#size] = value;
        ++this.#size;        
    }

    pop() {
        if(this.is_empty()) {
            throw new Error('pop failed: stack is empty');
        }
        const removed = this.#stack[this.#size - 1];
        --this.#size;
        return removed;
    }

    peek() {
        if(this.is_empty()) {
            throw new Error('invalid action: stack is empty');
        }
        return this.#stack[this.#size];
         
    }
}


// const stack = new Stack(10);

// console.log(stack.size());
// console.log(stack.capacity());
// console.log(stack.is_empty());
// console.log(stack.is_full());

// stack.push(0);
// stack.push(1);
// stack.push(2);
// stack.push(3);
// stack.push(4);
// stack.push(5);
// stack.push(6);
// stack.push(7);
// stack.push(8);
// stack.push(9);
// // stack.push(1);

// const removed = stack.pop();
// console.log(removed);

// console.log(stack.peek());




