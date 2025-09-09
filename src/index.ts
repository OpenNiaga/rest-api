import { Email } from "./domain/value-object/Email";
import { greeting } from "./greeting";

console.log(greeting("Rizal"));
const result = Email.create("rizal.fadlullah@gmail.com");
if(result.isSuccess){
	console.log(result.value.toString())
}
