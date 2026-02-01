function countingSort (arr) {
    const size = arr.length;
    let min = arr[0];
    let max = arr[0];

    for(let i = 0; i < size; ++i) {
        if(arr[i] < min) {
            min = arr[i];
        }
        if(arr[i] > max) {
            max = arr[i];
        }
    }

    const count = Array(max - min + 1).fill(0);

    for(let i = 0; i < size; ++i) {
        ++count[arr[i] - min];
    }

    const sorted = [];
    const countSize = count.length;

    for(let i = 0; i < countSize; ++i) {
        while(count[i]) {
            sorted.push(i + min);
            --count[i];
        }
    }
    return sorted;
}

const arr = [560, 563, 561, 570, 563, 569, 566];

console.log(countingSort(arr));

