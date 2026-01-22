let arr = [5, 4, 3, 2, 10, 1, 8];
let size = arr.length;

function sort(arr) {
    for(let j = 1; j < size; j++) {
        let key = arr[j];
        let i = j - 1;

        while(i >= 0 && arr[i] > key) {
            arr[i + 1] = arr[i];
            i--;
        }

        arr[i + 1] = key;
    }
}

sort(arr);

console.log(arr);
