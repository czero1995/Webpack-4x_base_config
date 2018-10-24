const NUM = 45
interface Cat {
    name:  String,
    gender: String,
}

function touchCat(cat: Cat){
    console.log('miao',cat.name)
}
function stringFunction(string:string){
    console.log('string',string)
}
touchCat({
    name: 'tom',
    gender: 'male'
})
stringFunction('1111')

console.log('这是ts','webpack4 ejs')