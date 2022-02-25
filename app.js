let add = document.querySelector("form button");
let section =document.querySelector("section");

// 當按Add into List按鈕會發生的事件
add.addEventListener("click", e => {
    // 避免表單交出去
    e.preventDefault();

    // 獲得輸入值
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;


    if(todoText ===""){
        alert("不能空白");
        return;
    }

    // 新增項目
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText=todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText=todoMonth+"/"+todoDate;
    //將<p></p>新增至<div class="todo"></div>裡
    todo.appendChild(text);
    todo.appendChild(time);

    // 勾勾
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener("click" , e=>{
        let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
    })
    // 垃圾桶
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.addEventListener("click", e=>{
        let todoItem = e.target.parentElement;
        // 移除todo 有動畫
        todo.style.animation = "scaleDown 0.5s forwards";
        // 當動畫完成後會發生的事件
        todoItem.addEventListener("animationend", ()=>{
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            //刪除localStorage的資料
            myListArray.forEach((item,index) => {
                if(item.todoText==text){
                    myListArray.splice(index,1);//array只能用splice去做移除
                    localStorage.setItem("list",JSON.stringify(myListArray));//更新array
                }
            })
            todoItem.remove();//刪除網頁的資料
        })
    })
    //將<button></button>新增至<div class="todo"></div>裡
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    // 新增todo 有動畫
    todo.style.animation = "scaleUp 0.5s forwards";

    // 新增完畢後清空格子內容
    form.children[0].value="";

    // 將<div class="todo"></div>新增至<section></section>裡
    section.appendChild(todo);

    // 將資料轉成物件方便儲存
    let myTodo ={
        todoText:todoText,
        todoMonth:todoMonth,
        todoDate:todoDate,
    };
    // 將物件變成array儲存在localStorage
    let myList = localStorage.getItem("list");
    if(myList == null){
        localStorage.setItem("list",JSON.stringify([myTodo]));
    }else{
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }
    console.log(JSON.parse(localStorage.getItem("list")));
})

// 當重新打開網頁時會重新load data
loadDate();


function loadDate(){
    let myList = localStorage.getItem("list");
    // 當localStorage有資料時
    if(myList !== null){
        let myListArray = JSON.parse(myList);//轉檔
        myListArray.forEach(item=>{
            // 把資料庫的內容新增至網頁上
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText=item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText=item.todoMonth+"/"+item.todoDate;
            //將<p></p>新增至<div class="todo"></div>裡
            todo.appendChild(text);
            todo.appendChild(time);

            // 勾勾
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
            completeButton.addEventListener("click" , e=>{
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");

            })
            // 垃圾桶
            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            trashButton.addEventListener("click", e=>{
                let todoItem = e.target.parentElement;
                // 移除todo 有動畫
                todo.style.animation = "scaleDown 0.5s forwards";
                // 當動畫完成後會發生的事件
                todoItem.addEventListener("animationend", ()=>{
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    //刪除localStorage的資料
                    myListArray.forEach((item,index) => {
                        if(item.todoText==text){
                            myListArray.splice(index,1);//array只能用splice去做移除
                            localStorage.setItem("list",JSON.stringify(myListArray));//更新array
                        }
                    })
                    todoItem.remove();//刪除網頁的資料
                })
            })
            //將<button></button>新增至<div class="todo"></div>裡
            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            // 將<div class="todo"></div>新增至<section></section>裡
            section.appendChild(todo);

        })
    }
}

// 資料排序的funtion
function mergeTime(arr1, arr2){
    let result=[];
    let i=0;
    let j=0;

    while(i<arr1.length && j<arr2.length){
        if(Number(arr1[i].todoMonth)>Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if(Number(arr1[i].todoMonth)<Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if(Number(arr1[i].todoMonth)==Number(arr2[j].todoMonth)){
            if(arr1[i].todoDate>arr2[j].todoDate){
                result.push(arr2[j]);
                j++;
            }else{
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while(i < arr1.length){
        result.push(arr1[i]);
        i++;
    }
    while(j < arr2.length){
        result.push(arr2[j]);
        j++;
    }
    return result;
}

function mergeSort(arr){
    if(arr.length == 1){
        return arr;
    }else{
        let middle=Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

let sortButton = document.querySelector("div.sort button");
// 當按Sort By Time時
sortButton.addEventListener("click",() => {
    // 把localStorage的資料由上方的funtion進行排序，並重新儲存至localStorage
    let sortArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list",JSON.stringify(sortArray));

    // 網頁的資料要刪除
    let len = section.children.length;
    for(let i=0 ;i< len; i++){
        section.children[0].remove();
    }
    
    // 重新load data把儲存的資料叫出來
    loadDate();
})