function mergeSort(arr) {
    if(arr.length <= 1) {
        return arr;
    }
    const mid = Math.floor(arr.length/ 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);

    return merge(sortedLeft, sortedRight);
}

function merge(arr1, arr2) {
    const size1 = arr1.length;
    const size2 = arr2.length;
    const res = [];
    let i = 0;
    let j = 0;

    while(i < size1 && j < size2) {
        if(arr1[i] <= arr2[j]) {
            res.push(arr1[i]);
            ++i;
        } else {
            res.push(arr2[j]);
            ++j;
        }
    }

    while(i < size1) {
        res.push(arr1[i]);
        ++i;
    }

    while(j < size2) {
        res.push(arr2[j]);
        ++j;
    }
    return res;
}

const arr = [6, 7, 1, 9, 12, 3, 5];

console.log(mergeSort(arr));


