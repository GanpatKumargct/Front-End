console.log("This is for fetch the api.")


/**async function getData() {
    return new Promise((resovle, reject) => {
        setTimeout(() => {
            resovle(455)
        }, 15000)
    })
}
*/
//via fetch api
async function getData() {
    let x = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    let data = await x.json()
    console.log(data)
}

async function main() {
    console.log("Loading Module")
    console.log("Do Something else")
    console.log("Load Data")

    let Data = await getData()
    console.log(Data)

    console.log("proceess data")

    console.log("Data - Task 2")

}

main()


/** 
 * - this is the normal way to hold the other execution task until the particular function complete thier execution
console.log(Data)
Data.then(() => {
    console.log("proceess data")

    console.log("Data - Task 2")
})

- same thing can do with Async/Await thats more powerful


*/


