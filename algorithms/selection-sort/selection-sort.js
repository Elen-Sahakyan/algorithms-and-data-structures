function selectionSort (arr) {
    let n = arr.length;
    for(let i = 0; i < n; ++i) {
        let minIndex = i;
        for(let j = i + 1; j < n; ++j) {
            if(arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        if(minIndex !== i) {
            [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]; 
        }
    }
}

const arr = [4, 5, 2, 6, 12, 3, 45];
selectionSort(arr);
console.log(arr);