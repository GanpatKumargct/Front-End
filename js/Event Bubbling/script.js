
document.querySelector(".child").addEventListener("click", (k) => {
    k.stopPropagation();  //to stop bubbling
    alert("child is cliked");

})

document.querySelector(".childContainer").addEventListener("click", (e) => {
    e.stopPropagation()
    alert("Child container is clicked")
}
)

document.querySelector(".container").addEventListener("click", () =>
    alert("Container is clicked")
)


const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

setInterval(() => {
    document.querySelector(".childContainer").style.background=getRandomColor()
}, 3000
);  