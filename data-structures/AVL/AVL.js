const Queue = require('../queue/queue.js');
const Stack = require('../stack/stack.js');

class Node {
    constructor(value = null) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVL {
    #root;
    #size;

    constructor() {
        this.#root = null;
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
        this.#root = null;
        this.#size = 0;
    }

    /* ========== Core AVL Operations ========== */

    insert(value) {
        this.#root = this.#insert(this.#root, value);
    }

    delete(value) {
        this.#root = this.#delete(this.#root, value);
    }

    search(value) {
        return this.#search(this.#root, value);
    }

    /* ========== Height / Min / Max ========== */

    getHeight() {
        return this.#height(this.#root);
    }

    getMin() {
        return this.#getMin(this.#root);
    }

    getMax() {
        return this.#getMax(this.#root);
    }

    /* ========== Traversals ========== */

    levelOrder() {
        if(this.is_empty()) return [];

        const queue = new Queue(100);
        queue.enqueue(this.#root);
        const res = [];

        while(queue.size()) {
            const size = queue.size();
            const level = [];
            for(let i = 0; i < size; ++i) {
                const node = queue.dequeue();
                level.push(node.value);
                if(node.left) queue.enqueue(node.left);
                if(node.right) queue.enqueue(node.right);
            }
            res.push(level);
        }
        return res;
    }

    preorder_itr() {
        if(!this.#root) return [];

        const stack = new Stack(100);
        stack.push(this.#root);
        const res = [];
        
        while(stack.size()) {
            const node = stack.pop();
            res.push(node.value);
            if(node.right) stack.push(node.right);
            if(node.left) stack.push(node.left);
        }
        return res;
    }

    preorder_rec() {
        const res = [];
        this.#preorder(this.#root, res);
        return res;
    }

    inorder_itr() {
        if(this.is_empty()) return [];

        const stack = new Stack(100);
        const res = [];
        let current = this.#root
        while(current || stack.size()) {
            while(current) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            res.push(current.value);
            current = current.right;
        }
        return res;
    }

    inorder_rec() {
        const res = [];
        this.#inorder(this.#root, res);
        return res;
    }

    postorder_itr() {
        if(this.is_empty()) return [];

        const stack = new Stack(100);
        stack.push(this.#root);
        const res = [];

        while(stack.size()) {
            const node = stack.pop();
            res.push(node.value);
            if(node.left) stack.push(node.left);
            if(node.right) stack.push(node.right);
        }

        let i = 0;
        let j = res.length - 1;

        while(i < j) {
            [res[i], res[j]] = [res[j], res[i]];
            ++i;
            --j;
        }
        return res;
    }

    postorder_rec() {
        const res = [];
        this.#postorder(this.#root, res);
        return res;
    }

    /* ========== Advanced AVL Utilities ========== */

    isBalanced() {
        return this.#isBalanced(this.#root);
    }

    validateBST() {
        if(this.is_empty()) return true;

        const stack = new Stack(100);
        const res = [];
        let prev = -Infinity;
        let current = this.#root;

        while(current || stack.size()) {
            while(current) {
                stack.push(current);
                current = current.left
            }
            
            current = stack.pop();

            if(current.value <= prev) return false;
            prev = current.value;
            current = current.right;
        }
        return true;
    }

    findSuccessor(value) {
        if(this.is_empty()) return null;
        const node = this.#find_node(this.#root, value);
        return this.#getMin(node.right);
    }

    findPredecessor(value) {
        if(this.is_empty()) return null;
        const node = this.#find_node(this.#root, value);
        return this.#getMax(node.left);
    }

    toArray() {
        return this.inorder_rec();
    }

    clone() {
        const newTree = new AVL();
        newTree.#root = this.#copy(this.#root);
        newTree.#size = this.#size;
        return newTree;
    }

    equals(other) {
        return this.#equals(this.#root, other.#root);
    }

    /* ========== Iteration ========== */

    [Symbol.iterator]() {
        const arr = this.inorder_rec();
        let i = 0;
        return {
            next() {
                if(i >= arr.length) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                return {
                    value: arr[i++],
                    done: false
                }
            }
        }
    }

    values() {
        const arr = this.inorder_rec();
        let i = 0;
        return {
            next() {
                if(i >= arr.length) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                return {
                    value: arr[i++],
                    done: false
                }
            }
        }
    }

    entries() {
        const arr = this.inorder_rec();
        let i = 0;
        return {
            next() {
                if(i >= arr.length) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                return {
                    value: [i, arr[i++]],
                    done: false
                }
            }
        }
    }

    /* ========== AVL Balancing ========== */
    
    #insert(node, value) {
        if(!node) {
            ++this.#size;
            return new Node(value);
        }

        if(value < node.value) {
            node.left = this.#insert(node.left, value);
        } else if(value > node.value) {
            node.right = this.#insert(node.right, value);
        } else { return node; } 

        node.height = this.#update(node);

        return this.#reBalance_insert(node, value);
    }

    #delete(node, value) {
        if(!node) return null;

        if(value < node.value) {
            node.left = this.#delete(node.left, value);
        } else if(value > node.value) {
            node.right = this.#delete(node.right, value);
        } else {
            if(!node.left || !node.right) {
                node = node.left ? node.left : node.right;
                --this.#size;
                return node;
            }

            const successor = this.#getMin(node.right);
            node.value = successor;
            node.right = this.#delete(node.right, successor);
        }
            node.height = this.#update(node);
            
            return this.#reBalance_delete(node);
        
    }

    #reBalance_insert(node, value) {
        const bf = this.#balanceFactor(node);
        if(bf > 1 && value < node.left.value)  {
            return this.#rotate_right(node);
        } 
        else if(bf > 1 && value > node.left.value) {
            node.left = this.#rotate_left(node.left);
            return this.#rotate_right(node);
        } 
        else if(bf < -1 && value > node.right.value) {
            return this.#rotate_left(node);
        } 
        else if(bf < -1 && value < node.right.value) {
            node.right = this.#rotate_right(node.right);
            return this.#rotate_left(node);
        }
        return node;
    }

    #reBalance_delete(node) {
        const bf = this.#balanceFactor(node);
        if(bf > 1) {
            if(this.#balanceFactor(node.left) < 0) {
                node.left = this.#rotate_left(node.left);
            }
            return this.#rotate_right(node);
        }
        else if(bf < -1) {
            if(this.#balanceFactor(node.right) > 0) {
                node.right = this.#rotate_right(node.right);
            }
            return this.#rotate_left(node);
        }
        return node;
    }

    #balanceFactor(node) {
        if(!node) return 0;

        return this.#height(node.left) - this.#height(node.right);
    }

    #rotate_left(node) {
        const x = node.right;
        const y = x.left;
        x.left = node;
        node.right = y;

        node.height = this.#update(node);
        x.height = this.#update(x);
        return x;
    }

    #rotate_right(node) {
        const x = node.left;
        const y = x.right;
        x.right = node;
        node.left = y;

        node.height = this.#update(node);
        x.height = this.#update(x);
        return x;
    }

    #update(node) {
        return 1 + Math.max(this.#height(node.left), this.#height(node.right));
    }

    #height(node) {
        return node ? node.height : 0;
    }

    #isBalanced(node) {
        if(!node) return true;
        const bf = this.#balanceFactor(node);
        if(bf < -1 || bf > 1) return false;

        return this.#isBalanced(node.left) && this.#isBalanced(node.right);
    }

    /* ========== BST Helpers ========== */

    #getMin(node) {
        if(!node) return node;
        if(!node.left) return node.value;

        return this.#getMin(node.left);
    }

    #getMax(node) {
        if(!node) return node;
        if(!node.right) return node.value;

        return this.#getMax(node.right);
    }

    #search(node, value) {
        if(!node) return false;
        if(value === node.value) return true;

        if(value < node.value) {
            return this.#search(node.left, value);
        } else {
            return this.#search(node.right, value);
        }
    }

    #find_node(node, value) {
        if(!node) return null;

        if(value < node.value) {
            return this.#find_node(node.left, value);
        } else if (value > node.value) {
            return this.#find_node(node.right, value);
        } else {
            return node;
        }
    }

    #copy(node) {
        if(!node) return null;

        const newNode = new Node(node.value);
        newNode.height = node.height;

        newNode.left = this.#copy(node.left);
        newNode.right = this.#copy(node.right);

        return newNode;
    }


    #equals(node1, node2) {
        if(!node1 && !node2) return true;
        if(!node1 || !node2) return false;
        if(node1.value !== node2.value) return false;

        return this.#equals(node1.left, node2.left) && this.#equals(node1.right, node2.right);
    }

    /* ========== DFS Helpers ========== */

    #preorder(node, res = []) {
        if(!node) return;
        
        res.push(node.value);
        this.#preorder(node.left, res);
        this.#preorder(node.right, res);
    }

    #inorder(node, res = []) {
        if(!node) return;

        this.#inorder(node.left, res);
        res.push(node.value);
        this.#inorder(node.right, res);
    }

    #postorder(node, res = []) {
        if(!node) return;

        this.#postorder(node.left, res);
        this.#postorder(node.right, res);
        res.push(node.value);
    }

}

// const avl = new AVL();

// avl.insert(10);
// avl.insert(5);
// avl.insert(7);
// avl.insert(11);
// avl.insert(15);
// avl.insert(3);
// console.log(avl.size());
// console.log(avl.is_empty());
// // avl.clear();
// console.log(avl.getHeight());
// console.log(avl.search(10));
// console.log(avl.getMin());
// console.log(avl.getMax());
// console.log(avl.levelOrder());
// console.log(avl.preorder_itr());
// console.log(avl.preorder_rec());
// console.log(avl.inorder_itr());
// console.log(avl.inorder_rec());
// console.log(avl.postorder_itr());
// console.log(avl.postorder_rec());
// console.log(avl.isBalanced());
// console.log(avl.validateBST());
// console.log(avl.findSuccessor());
// console.log(avl.findPredecessor());
// console.log(avl.toArray());

// const avl2 = new AVL();
// avl2.insert(10);

// console.log(avl.equals(avl2));

// for(const item of avl) {
//     console.log(item);
// }

// const values = avl.values();
// console.log(values.next());
// const entries = avl.entries();
// console.log(entries.next());

// avl.delete(7);

// console.log(avl.inorder_rec());

// console.log(avl.size());


           