let arr = [1, 4, 5, 10, 7, 81, 13];

function sort(arr) {
    for(let i = 0; i < arr.length - 1; i++) {
        let sorted = true;
        for(let j = 0; j < arr.length - i - 1; j++) {
            if(arr[j] > arr[j + 1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                // let tmp = arr[j];
                // arr[j] = arr[j + 1];
                // arr[j + 1] = tmp;
                sorted = false;
            }
        }
        if(sorted) {
            break;
        }
    }
}

sort(arr);
console.log(arr);