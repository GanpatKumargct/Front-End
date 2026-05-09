
let boxss = document.getElementsByClassName("box")
console.log(boxss)

//Manually by the array nodes 
boxss[3].style.backgroundColor = "green"

//selector by id 
document.getElementById("redbox").style.backgroundColor = "red"


//selector by class - only it will take first class
document.querySelector(".box").style.backgroundColor="blue"

//selector by class - for hole one how many it may be
// document.querySelectorAll(".dabba").forEach(e => 
//     e.style.backgroundColor = "violet"
// )

// document by tag name 
console.log(document.getElementsByTagName("div"))


//method to get random color 
const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

//assign random color to among the all 5 box
document.querySelectorAll(".dabba").forEach(e => 
    e.style.backgroundColor = getRandomColor()
)