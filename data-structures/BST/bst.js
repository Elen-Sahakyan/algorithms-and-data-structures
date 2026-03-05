const Queue = require('../queue/queue.js');
const Stack = require('../stack/stack.js');

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null; 
    }
}

class BST {
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

    /* ========== Insert / Delete ========== */

    insert(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        const node = new Node(value);
        if(!this.#root) { 
            this.#root = node;
            ++this.#size;
            return;
        }
        let current = this.#root;
        while(current) {
            if(value < current.value) {
                if(!current.left) {
                    current.left = node;
                    break;
                }
                current = current.left;                
            }
            else if(value > current.value) {
                if(!current.right) {
                    current.right = node;
                    break;
                }
                current = current.right;
            }
            else {
                return;
            }
        }
        ++this.#size;
    }

    insert_rec(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        this.#root = this.#insert(this.#root, value);
    }

    delete(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        if(this.is_empty()) {
            throw new Error('tree is empty');
        }
        let parent = null;
        let current = this.#root;
        while(current && current.value !== value) {
            parent = current;
            current = value < current.value ? current.left : current.right; 
        }
        if(!current.left || !current.right) {
            const child = current.left || current.right;
            if(!parent) this.#root = child;
            else if(parent.left === current) {
                parent.left = child;
            }
            else parent.right = child;
            --this.#size;
            return true;
        }

        let successorParent = current;
        let successor = current.right;
        while(successor.left) {
            successorParent = successor;
            successor = successor.left;
        }

        current.value = successor.value;
        const child = successor.right;
        if(successorParent.left === successor) {
            successorParent.left = child;
        } else {
            successorParent.right = child;
        }
        --this.#size;
        return true;
    }

    delete_rec(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        if(this.is_empty()) {
            throw new Error('tree is empty');
        }
        this.#root = this.#delete(this.#root, value);
    } 

    contains(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        let current = this.#root;

        while(current) {
            if(value === current.value) {
                return true;
            }
            if(value < current.value) {
                current = current.left;
            }
            else current = current.right;
        }
        return false;
    }

    contains_rec(value) {
        const node = this.#find_node(this.#root, value);
        return node !== null;
    }

    /* ========== Height & Depth ========== */

    get_height() {
        if(this.#size === 0) return 0;
        const queue = new Queue(100);
        let height = 0;
        queue.enqueue(this.#root);
        while(!queue.is_empty()) {
            ++height;
            const level = queue.size();
            for(let i = 0; i < level; ++i) {
                const node = queue.dequeue();
                if(node.left) queue.enqueue(node.left);
                if(node.right) queue.enqueue(node.right);
            }
        }
        return height;
    }

    get_height_rec() {
        return this.#get_height(this.#root);
    }

    get_depth(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        let depth = 0;
        let current = this.#root;

        while(current) {
            if(value === current.value) {
                return depth;
            }
            else if(value < current.value) {
                ++depth;
                current = current.left;
            }
            else {
                ++depth;
                current = current.right;
            }
        }
        return -1;
    }

    /* ========== Min / Max ========== */

    find_min() {
        if(this.is_empty()) {
            throw new Error('tree is empty');
        }
        let current = this.#root;

        while(current.left) {
            current = current.left;
        }
        return current.value;
    }

    find_min_rec() {
        if(this.is_empty()) {
            throw new Error('tree is empty');
        }
        return this.#find_min(this.#root);
    }

    find_max() {
        if(this.is_empty()) {
            throw new Error('tree is empty');
        }
        let current = this.#root;

        while(current.right) {
            current = current.right;
        }
        return current.value;
    }

    find_max_rec() {
        if(this.is_empty()) {
            throw new Error('tree is empty');
        }
        return this.#find_max(this.#root);
    }

    /* ========== Traversals ========== */

    level_order() {
        const res = [];
        const queue = new Queue(100);
        queue.enqueue(this.#root);

        while(queue.size()) {
            const level = queue.size();
            for(let i = 0; i < level; ++i) {
                const node = queue.dequeue();
                res.push(node.value);
                if(node.left) queue.enqueue(node.left);
                if(node.right) queue.enqueue(node.right);
            }
        }

        return res;
    }

    inorder_itr() {
        if(this.is_empty()) return [];
        const stack = new Stack(100);
        const res = [];
        let current = this.#root;
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

    preorder_itr() {
        if(this.is_empty()) return [];
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

    /* ========== Advanced Operations ========== */

    find_successor(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        const node = this.#find_node(this.#root, value);
        if(!node || !node.right) return null;
        return this.#find_min(node.right);
        
    }

    find_predecesor(value) {
        if(value === undefined) {
            throw new Error('value is missing');
        }
        const node = this.#find_node(this.#root, value);
        if(!node || !node.left) return null;
        return this.#find_max(node.left);
    }

    is_balanced() {
        return this.#is_balanced(this.#root);
    }

    validate_BST() {
        const stack = [];
        let current = this.#root;
        let prev = -Infinity;

        while(current || stack.length) {
            while(current) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();

            if(current.value <= prev) {
                return false;
            }

            prev = current.value;

            current = current.right;
        }
        return true;
    }

    /* ========== Utilities ========== */

    toArray() {
        return this.inorder_itr();
    }

    clone() {
        const newTree = new BST();
        newTree.#root = this.#copy(this.#root);
        newTree.#size = this.#size;
        
        return newTree;
    }

    equals(other) {
        return this.#equals(this.#root, other.#root);
    }

    /* ========== Iteration ========== */    
    
    [Symbol.iterator]() {
        const arr = this.inorder_itr();
        let i = 0;
        return {
            next() {
                if(i >= arr.length) {
                    return { value: undefined, done: true }
                }
                    return {
                        value: arr[i++],
                        done: false,
                    }
            }
        }
    }

    values() {
        const arr = this.inorder_itr();
        let i = 0;
        return {
            next() {
                if(i >= arr.length) {
                    return { value: undefined, done: true }
                }
                    return {
                        value: arr[i++],
                        done: false,
                    }
            }
        }
    }

    entries() {
        const arr = this.inorder_itr();
        let i = 0;
        return {
            next() {
                if(i >= arr.length) {
                    return { value: undefined, done: true }
                }
                    return {
                        value: [i, arr[i++]],
                        done: false,
                    }
            }
        }
    }

    /* ========== Private Helpers ========== */

    #insert(node, value) {
        if(!node) {
            ++this.#size;
            return new Node(value);
        }
        
        if(value < node.value) {
            node.left = this.#insert(node.left, value);
        } else {
            node.right = this.#insert(node.right, value);
        }
        return node;
    }

    #delete(node, value) {
        if(!node) return null;

        if(value < node.value) {
            node.left = this.#delete(node.left, value);
        }
        else if(value > node.value) {
            node.right = this.#delete(node.right, value);
        } 
        else {
            if(!node.left || !node.right) {
                --this.#size;
                return node.left || node.right;
            }
            const successor = this.#find_min(node.right);
            node.value = successor;
            node.right = this.#delete(node.right, successor);
        }
        return node;
    }

    #find_min(node) {
        if(!node.left) return node.value;
        return this.#find_min(node.left);
    }

    #find_max(node) {
        if(!node.right) return node.value;
        return this.#find_max(node.right);
    }

    #inorder(node, res = []) {
        if(!node) return;

        this.#inorder(node.left, res);
        res.push(node.value);
        this.#inorder(node.right, res);
    }

    #preorder(node, res = []) {
        if(!node) return;

        res.push(node.value);
        this.#preorder(node.left, res);
        this.#preorder(node.right, res);
    }

    #postorder(node, res = []) {
        if(!node) return;

        this.#postorder(node.left, res);
        this.#postorder(node.right, res);
        res.push(node.value);
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

    #get_height(node) {
        if(!node) return 0;

        return (Math.max(this.#get_height(node.left), this.#get_height(node.right))) + 1;
    }

    #is_balanced(node) {
        if(!node) return true;
        const left = this.#get_height(node.left);
        const right = this.#get_height(node.right);
        if (Math.abs(left - right) > 1) {
            return false;
        }
        return this.#is_balanced(node.left) 
            && this.#is_balanced(node.right);
    }

    #equals(root1, root2) {
        if(!root1 && !root2) return true;
        if(!root1 || !root2) return false;

        return root1.value === root2.value 
            && this.#equals(root1.left, root2.left) 
            && this.#equals(root1.right, root2.right);
    }

    #copy(node) {
        if(!node) return null;

        const newNode = new Node(node.val);
        newNode.left = this.#copy(node.left);
        newNode.right = this.#copy(node.right);

        return newNode;
    }

}

const bst = new BST();
bst.insert(10);
bst.insert(30);
bst.insert(50);
bst.insert(500);
bst.insert(3);
bst.insert(25);
bst.insert(550);
bst.insert(100);
bst.insert(600);

const bst2 = new BST();
bst2.insert(10);
bst2.insert(30);
bst2.insert(50);
bst2.insert(500);
bst2.insert(3);
bst2.insert(25);
bst2.insert(550);
bst2.insert(100);
bst2.insert(600);

// console.log(bst.equals(bst2));


// console.log(bst.contains(500));
// console.log(bst.get_height(500));
// console.log(bst.get_depth(50));
// console.log('min ->', bst.find_min());
// console.log('max ->', bst.find_max());
// const level = bst.level_order();
// console.log(level);
// const inorder = bst.inorder_rec();
// console.log('inorder ->', inorder);
// const preorder = bst.preorder_rec();
// console.log(preorder);
// const postorder = bst.postorder_rec();
// console.log(postorder);

// console.log(bst.size());
// bst.delete_rec(30)
// const inorder2 = bst.inorder_rec();
// console.log('inorder ->', inorder2);

// console.log(bst.delete(10));
// console.log(bst.size());
// console.log(bst.is_empty());

// for(const item of bst) {
    //     console.log(item);
    // }
    
    // const value = bst.values();
    // console.log(value.next());
    // console.log(value.next());
    // console.log(value.next());
    
    // const entries = bst.entries();
    // console.log(entries.next());
    // console.log(entries.next());
    // console.log(entries.next());
    
    // console.log(bst.find_successor(50));
    // console.log(bst.find_predecesor(10));
    
    // console.log(bst.contains_rec(100));
    // console.log(bst.get_height_rec());
    // console.log(bst.is_balanced());
    
    console.log(bst.validate_BST());
    
    
    
    