class Node {
    #value;
    #next;
    constructor(value = 0) {
        this.value = value;
        this.next = null;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        if(!Number.isFinite(value)) {
            throw new Error('value must be a number');
        }
        this.#value = value;
    }

    get next() {
        return this.#next;
    }

    set next(new_node) {
        if(!(new_node instanceof Node) && new_node !== null) {
            throw new Error('node must be an instance of class Node');
        }
        this.#next = new_node;
    }
}


class SinglyLinkedList {
    #head = null;
    #size = 0;

    constructor(iterable) {
        if(typeof iterable === 'undefined') {
            this.#head = new Node();
        }
        else if(typeof iterable[Symbol.iterator] === 'function') {
            for(const item of iterable) {
                this.pushBack(item);
            }
        }
        else if(Number.isFinite(iterable)) {
            this.pushBack(iterable);
        }
    }

    /* ========== Size & State =========== */

    size() {
        return this.#size;        
    }

    isEmpty() {
        return this.#size === 0;
    }

    clear() {
        this.#head = null;
        this.#size = 0;
    }

    /* ========== Front Access =========== */

    front() {
        if(this.isEmpty()) {
            throw new Error('list is empty');
        }
        return this.#head
    }

    /* ========== Push & Pop =========== */

    pushFront(value) {
        if(!value || !(Number.isFinite(value))) {
            throw new Error('value must be a number');
        }
        let new_node = new Node(value);
        new_node.next = this.#head;
        this.#head = new_node;
        ++this.#size;
    }

    pushBack(value) {
        if(!value || !(Number.isFinite(value))) {
            throw new Error('value must be a number');
        }
        let new_node = new Node(value);
        if(this.isEmpty()) {
            this.#head = new_node;
            ++this.#size;
            return;
        }
        let current = this.#head;
        while(current.next) {
            current = current.next;
        }
        current.next = new_node;
        ++this.#size;
    }

    popFront() {
        if(this.isEmpty()) {
            throw new Error('list is empty');
        } 
        let removed = this.#head;
        this.#head = removed.next;
        --this.#size;
        return removed;
    }

    popBack() {
        if(this.isEmpty()) {
            throw new Error('list is empty');
        }
        if(this.size() === 1) {
            this.clear();
            return;
        }
        let current = this.#head;
        while(current.next.next) {
            current = current.next;
        }
        let removed = current.next;
        current.next = null;
        --this.#size;
        return removed;
    }

    /* ========== Random-like Access =========== */

    at(index) {
        if(index < 0 || index > this.size()) {
            throw new Error('index is invalid');
        }
        let current = this.#head;
        while(index) {
            current = current.next;
            --index;
        }

        return current;
    }
    
    insert(index, value) {
        if(index < 0 || index > this.size()) {
            throw new Error('invalid index');
        }
        if(!value || !(Number.isFinite(value))) {
            throw new Error('value must be a number');
        }
        else if(index === 0) {
            this.pushFront(value);
        }
        else if(index === this.size()) {
            this.pushBack(value);
        } else {
            let new_node = new Node(value);
            let prev = this.at(index - 1);
            new_node.next = prev.next;
            prev.next = new_node;
            ++this.#size;
        }
    }

    erase(index) {
        if(index < 0 || index >= this.size()) {
            throw new Error('invalid index');
        }
        if(this.isEmpty()) {
            throw new Error('invalid action: list is empty');
        }
        else if(index === 0) {
            this.popFront();
        }
        else if(index + 1 === this.size()) {
            this.popBack();
        } else {
            let curr = this.at(index);
            curr.value = curr.next.value;
            curr.next = curr.next.next;
            --this.#size;
        }
    }

    remove(value) {
        if(!value || !(Number.isFinite(value))) {
            throw new Error('value must be a number');
        }
        if(this.isEmpty()) {
            throw new Error('remove failed: list is empty');
        }
        let count = 0;
        let current = this.#head;
        while(current) {
            if(current.value === value) {
                if(current.next === null) {
                    this.popBack();
                    ++count;
                    return;
                }
                current.value = current.next.value;
                current.next = current.next.next;
                ++count;
            } else {
                current = current.next;
            }
        }
        return count;
    }


    /* ========== Algorithms =========== */

    reverse() {
        let current = this.#head;
        let prev = null;
        let next = null;
        while(current) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.#head = prev;
    }

    #slice(start, end) {
        const list = new SinglyLinkedList();
        while(end) {
            list.pushBack(start.value);
            start = start.next;
            --end;
        }
        return list;
    }

    sort(cmp) {
        if(this.size() <= 1) {
            return this;
        }

        const mid = Math.floor(this.size() / 2);
        const left = this.#slice(this.#head, mid);
        const right = this.#slice(this.at(mid), this.size() - mid);
        const sortedLeft = left.sort(cmp);
        const sortedRight = right.sort(cmp);

        return sortedLeft.merge(sortedRight, cmp);
    }

    isSorted(cmp) {
        let current = this.#head;
        if(this.size() <= 1) {
            return true;
        }

        while(current.next) {
            const a = current.value;
            const b = current.next.value;

            if(cmp(a, b) > 0) {
                return false;
            }
            current = current.next;
        }
        return true;
    }

    merge(list, cmp) {
        if(typeof cmp !== 'function') {
            throw new Error('cmp must be a function');
        }
        if(!this.isSorted(cmp) || !list.isSorted(cmp)) {
            throw new Error('lists must be sorted according to compare function');
        }
        const newList = new SinglyLinkedList();
        let curr1 = this.#head;
        let curr2 = list.front();
        while(curr1 && curr2) {
            if(cmp(curr1.value, curr2.value) <= 0) {
                newList.pushBack(curr1.value);
                curr1 = curr1.next;
            }
            else {
                newList.pushBack(curr2.value);
                curr2 = curr2.next;
            }
        }
        while(curr1) {
            newList.pushBack(curr1.value);
            curr1 = curr1.next;
        }
        while(curr2) {
            newList.pushBack(curr2.value);
            curr2 = curr2.next;
        }
        return newList;
    }

    /* ========== Utilities =========== */

    toArray() {
        const res = new Array(this.size());
        let i = 0;
        for(const item of this) {
            res[i++] = item;
        }
        return res;
    }

    static fromArray(arr) {
        const size = arr.length;
        const list = new SinglyLinkedList();
        for(let i = 0; i < size; ++i) {
            list.pushBack(arr[i]);
        }
        return list;
    }

    /* ========== Iteration =========== */

    [Symbol.iterator] () {
        let current = this.#head;
        return {
            next () {
                if(!current) {
                    return {
                        value: current,
                        done: true,
                    }
                }
                const curr = current.value;
                current = current.next;
                return {
                    value: curr,
                    done: false,
                }
            }
        }
    }
}

const list = new SinglyLinkedList(10);
list.pushFront(5);
list.pushBack(25);
list.pushBack(25);
list.pushBack(25);
list.pushBack(25);
// list.popBack();
// list.popFront();
// list.clear();
// list.front();
// console.log(list.at(0));
// list.insert(0, 100);
// list.erase(3);
// console.log(list.size());
// list.remove(25);
// list.reverse();
// console.log(list.toArray());
// const list2 = SinglyLinkedList.fromArray([1, 7, 2, 6, 8]);

// const sorted = list2.sort((a, b) => a - b);
// for(const item of sorted) {
//     console.log(item);
// }
// mergedList = list.merge(list2, (a, b) => a - b);
// // console.log(list2);
// for(const item of mergedList) {
//     console.log(item);
// }

// for(item of list) {
//     console.log(item);
// }




