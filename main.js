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


let guestName = "Bartek";
const guestAge = "18";


function welcome(guestName, guestAge){
console.log(`Witaj ${guestName} masz ${guestAge} lat?`);
  
}
welcome("Bartek", 18);

function hello(querySelectorHello, helloBlock) {
const rectangle = document.querySelector(querySelectorHello);
rectangle.innerHTML = helloBlock;

}
hello(`.welcome__guest--js`, 'Witaj Witaj drogi odwiedzający');


const date = (date, text) => {
  console.log(`Twoja randka odbędzie się ${date} ${text}`);

}
date(11.03,  'Czy jestes gotowy?');


const calculate = (myNumber) => myNumber+10;
const result = calculate(10);
console.log(result);

const greet = {
    nickname: "Kelt",
    number: 30,
    leader: {
      description: "TheBesciak",
      level: 100,
      weapon: "railgun",
    }


}
console.log(greet);
console.log(greet.leader.weapon);
console.log(greet.nickname);
console.log(greet.number);

console.log(`Witaj ${greet.nickname} czy masz ${greet.number} lat?`);