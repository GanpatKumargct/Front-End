
function faultyCalculater(a,b, op){
    let random = Math.random()*10;
    console.log(random)

    let obj= {
            "+":"-",
            "-":"/",
            "*":"+",
            "/":"*"
    }

    if(random<10){
        op = obj[op]
        alert(`the result is ${eval(`${a} ${op} ${b}`)}`)
    }else{
        alert(`the result is ${eval(`${a} ${op} ${b}`)}`)

    }
}


let a = prompt("Enter your first number : ")
let op = prompt("Enter the operation : ")
let b = prompt("Enter your second number : ")
faultyCalculater(a,b,op)