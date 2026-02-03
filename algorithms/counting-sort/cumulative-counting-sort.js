function countingSort(arr) {
    const size = arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);

    for(let i = 0; i < size; ++i) {
        ++count[arr[i] - min];
    }

    for(let i = 1; i < range; ++i) {
        count[i] += count[i - 1];
    }
    
    const output = new Array(size);

    for(let i = size - 1; i >= 0; --i) {
        let value = arr[i];
        let index = value - min;
        let position = count[index] - 1;
        output[position] = value;
        --count[index];
    }
    return output;
}

const arr = [10, 2, 4, 6, 3, 6, 4, 5, 12];

console.log(countingSort(arr));
