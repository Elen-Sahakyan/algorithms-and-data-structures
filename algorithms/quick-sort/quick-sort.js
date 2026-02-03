function partition (arr, low, high) {
    const pivot = arr[low];
    let i = low + 1;
    let j = high;

    while(i <= j) {
        while(arr[i] <= pivot) {
            ++i;
        }
        while(arr[j] > pivot) {
            --j;
        }
        if(i < j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            ++i;
            --j;
        }
    }
    [arr[low], arr[j]] = [arr[j], arr[low]];    
    return j;
}

function quickSort (arr, low = 0, high = arr.length - 1) {
    if(low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

const arr = [1, 8, 2, 7, 15, 4, 10, 6];

quickSort(arr);

console.log(arr);
