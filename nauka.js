

const humanOne = {
    name: 'Maciek',
    age: 32,
    dupa: 'twoja dupa',
}

const humanTwo = {
    name: 'Stefan',
    age: humanOne.age,
    dupa: 'twoja dupa',
}


console.log(humanTwo);
console.log(humanOne);

humanOne.age = 44;

console.log(humanTwo);
console.log(humanOne);