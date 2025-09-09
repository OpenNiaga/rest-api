import { Email } from "./domain/value-object/Email.js";
import { greeting } from "./greeting.js";

console.log(greeting("Rizal"));
const result = Email.create("rizal.fadlullah@gmail.com");
if(result.isSuccess){
	console.log(result.value.toString())
}
