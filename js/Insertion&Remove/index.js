
/**
 * document.querySelector(".container").innerHTML
'\n        <div class="box">Hyy hello kaise ho?</div>\n  
  '
document.querySelector(".container").outerHTML
'<div class="container">\n        <div class="box">Hyy hello kaise ho?</div>\n    </div>'



document.querySelector(".container").tagName
'DIV'


document.querySelector(".container").nodeName
'DIV'
 */

//dynamcally div creation by js
let div = document.createElement("div")

div.innerHTML = "Inserted by jS"
div.setAttribute("class", "created")
document.querySelector(".container").append(div)

//add data inside existing container 
let cont = document.querySelector(".container")
cont.insertAdjacentHTML("beforebegin", "this is by the js query tools")