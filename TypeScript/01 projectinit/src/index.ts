
export function sayHelloWorld(world: string) {
  return `Hello ${world}`;
}


sayHelloWorld("ganpat")

// type notation 
let name:string = "ganpat"



// type referncing
let ref = "kumar"
ref = "yadav"


// Union - yeah tino me se koi bhi valida hai
let sub : number | String | boolean = true

// actul use : - production
let apirequest : 'Pending'| 'Success' | 'Draft' = "Draft"

// apirequest = "sddf" - throws error kyuki isme se koi lega jo defined hai 

// any
let value;