const name = "Bartek";
const surname = "Więckowski";
const age = "30";

console.log(`Hej jestem ${name} a nazwisko moje to ${surname} mam ${age} lat`);

console.log(name);
console.log(age);
console.log(surname);

const article = document.querySelector(".exercise-DOM--js");
console.log(article.innerHTML);

article.innerHTML = `Za pomocą JavaScriptu ten tekst własnie ukazuje sie w Waszym oczom. 
W kodzie HTML w tej cześci strony zupełnie nie ma tu nic wartościowego :). 
Jak rownież ten artykuł w HTML i CSS jest inaczej wystylizowany, ale JavaScript robi po swojemu :D`;

console.log(article);


function calculated(myNumber) {
    console.log(`Dostałem ${myNumber}`);
    return myNumber*7;
  }
  const myResult = calculated(1);
  console.log(myResult);