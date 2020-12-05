const name = "Bartek";
const surname = "Więckowski";
const age = "30";

console.log(`Hej jestem ${name} a nazwisko moje to ${surname} mam ${age} lat`);

console.log(name);
console.log(age);
console.log(surname);

const paragraph = document.querySelector('.paragraph-who-im--js');
console.log(paragraph.innerHTML);

paragraph.innerHTML = `No byl opis ale przez JS jest inny hehe`;

console.log(paragraph);
