let foodList = document.querySelector("#list_holder");
let foodName = document.querySelector("#item_name");
let foodDate = document.querySelector("#item_date");
let foodQuantity = document.querySelector("#item_quantiy");
let addBtn = document.querySelector("#add");
addBtn.addEventListener("click", ()=>{
    if(foodName.value != "" &&
    foodDate.value != "" &&
    foodQuantity.value != "" ){
    createItem(foodName.value,foodDate.value,foodQuantity.value)
}
else{
    alert("please Fill Missing Content");
}
}
);


let delBtns = document.querySelectorAll(".delete");
let crtBtn = document.querySelector("#create_csv");
crtBtn.addEventListener('click',()=>{ downloadCSV("ingridients-data","Name,Date,Quantity");})
let items = document.querySelectorAll(".item");
let firstDivs = document.querySelectorAll(".firstDiv");
let file = document.querySelector("#file");
let removeInstru = document.querySelector("#instructions-Holder");
removeInstru.addEventListener("click",()=>{removeInstru.remove();})

let saveBtn = document.querySelector('#save');
saveBtn.addEventListener('click',()=>{
    let saveData = [];
    for(let i = 0 ; i < items.length;i++){
        const n = parseName(items[i].textContent);
        const d = parseDate(items[i].textContent);
        const q = parseQuantity(items[i].textContent);
        let ingridient = {
            Name: n,
            Date: d,
            Quantity: q
        };
        saveData.push(ingridient);
    }
    console.log(saveData)
   downloadCSV(`ingridients-data_${monthsDict[(today.getMonth())]},${today.getDate()},${today.getFullYear()}`,
    json2csv.parse(saveData)
   );
})

let index = -1
let seletctedText = "";
let textArea = document.querySelector("#selectedText")
let today = new Date();


let monthsDict =  ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];


file.addEventListener("change",function(e){
    const reader = new FileReader();

    reader.onload = function(){
    let lines = reader.result.split('\n');
    usrData = lines;
    
    for(let i = 1 ; i <usrData.length; i++){
        usrData[i] = usrData[i].replaceAll('"','');
        createItem(parseName(usrData[i]),parseDate(usrData[i]),parseQuantity(usrData[i]));
    }
    }
    reader.readAsText(file.files[0]);
}
)

function linkDelBtn(){
for(let i = 0 ; i < delBtns.length;i++){
    delBtns[i].addEventListener("click", ()=>{
        firstDivs = document.querySelectorAll(".firstDiv");
        if(index != -1){
            firstDivs[index].remove();
        }
        index = -1;
        updateVariables();
        addEventToLinks();
    })
    }
}

function downloadCSV(fileName, csvData){
    const el = document.createElement("a");
    el.setAttribute("href",`data:text/csv;charset=utf-8,${csvData}`);
    el.setAttribute("download",fileName);
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
}

function parseName(text){
    return text.substring(0,text.indexOf(","));
}


function parseDate(text){
let comIndx = text.indexOf(",");
let valToReturn = text.substring(comIndx + 1);
valToReturn = valToReturn.substring(0,valToReturn.indexOf(","));
return valToReturn;
}


function addEventToLinks(){
    for(let i = 0 ; i < items.length;i++){
        items[i].addEventListener("click",()=>{
            seletctedText = items[i].textContent;
            textArea.value = "";
            updateTextArea();
            index = i;
        })
    }
}

function parseQuantity(text){
let comIndx = text.indexOf(",");
let tempText = text.substring(comIndx +1 , text.length);
comIndx = tempText.indexOf(",");
tempText = tempText.substring(comIndx + 1, tempText.length);
return Number(tempText);
}


function isExpired(){
    let date = parseDate(seletctedText);
    let year =Number(date.substring(0,date.indexOf("-")));
    date = date.substring(date.indexOf("-") + 1);
    let month = Number(date.substring(0,date.indexOf("-")));
    date = date.substring(date.indexOf("-") + 1);
    let day = Number(date.substring(date.indexOf("-") + 1));
    textArea.value = `We are checking the Date: ${monthsDict[month-1]},${day},${year}.`;
    
    if(year > today.getFullYear()) { 
        return false;
    }
    if(year == today.getFullYear() && month > (today.getMonth()+ 1)){
        return false;
    }
    if(year == today.getFullYear() && month == (today.getMonth() + 1) && day > today.getDate()){
        return false;
    }

    return true;
    
}


function updateTextArea(){
let flag = isExpired();
if(flag){
    textArea.value = textArea.value + "\n\nItem Has already experied dispose of it.";
}
else{
    textArea.value =textArea.value + "\n\nItem has not experied yet";
}
}



function createItem(nombre,dia,cantidad){
     //foodList is parent
     let divOne = document.createElement("div");
     divOne.classList.add("firstDiv");
     let li = document.createElement("li");
     li.classList.add("item");
     li.innerHTML =`${nombre},${dia},${cantidad}`;
     let divTwo = document.createElement('div');
     divTwo.classList.add("use_holder");
     let nInput = document.createElement("input");
     nInput.type = "number";
     nInput.min = "0";
     nInput.classList.add("amountToUse");
     nInput.classList.add("disabled");
 
     let use_button = document.createElement("button");
     use_button.classList.add("use")
     use_button.innerText ="Use";
     use_button.addEventListener('click',()=>{
         if(use_button.innerText.toLowerCase() == "use"){
         nInput.classList.remove("disabled");
         use_button.innerText = "OK";
         }
         else{
             let n = parseName(li.innerHTML);
             let d = parseDate(li.innerHTML);
             let q = parseQuantity(li.innerHTML);
             if(q - Number(nInput.value) < 0){
                 alert("Not Enough");
             }
             else if(q - Number(nInput.value) == 0 ){
                 divOne.remove();
             }
             else{
             li.innerHTML = `${n},${d},${q - Number(nInput.value)}` ;
             nInput.classList.add("disabled");
             use_button.innerText = "USE";
             }
         }
 
     })
 
 
     let del_button = document.createElement("button");
     del_button.classList.add("delete");
     del_button.innerText = "Delete";
     del_button.addEventListener('click',()=>{
         divOne.remove();
         items = document.querySelectorAll(".item")
     })
 
     foodList.appendChild(divOne);
     divOne.appendChild(li);
     divOne.appendChild(divTwo);
     divTwo.appendChild(nInput);
     divTwo.appendChild(use_button);
     divOne.appendChild(del_button);
 
     foodName.value = "";
     foodDate.value = "";
     foodQuantity.value = "";
 
     items = document.querySelectorAll(".item");
     delBtns = document.querySelectorAll(".delete");
     firstDivs = document.querySelectorAll(".firstDiv");
 
     addEventToLinks();
    
}


addEventToLinks();





document.querySelector(".use").addEventListener("click",
()=>{
    let useAmount = document.querySelector("#amount_use");
    let tempInt = Number(useAmount.value);
    if(tempInt  < 1 ){ alert("Insert an amount first");}
    if(index  == -1){alert("select an item first");}
    let currItemQuan = parseQuantity(seletctedText);
    if(index!= -1){
    let newText = seletctedText.substring(0,seletctedText.lastIndexOf(","));
    if(currItemQuan - tempInt > 0 ){
        newText = newText + "," + (currItemQuan - tempInt);
        items[index].textContent = newText;
    }
    else if(currItemQuan - tempInt <= -1){
        alert("Not enough amount");
    }
    else if(currItemQuan - tempInt == 0){
        items[index].remove();
    }
}
    index = -1;
    
})





