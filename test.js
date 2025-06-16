let str = "Hello aryan how are you today";
let splitStr = str.trim().split(/\s+/);
let result = splitStr[splitStr.length - 1].length;
console.log("Last Word Count", result);

