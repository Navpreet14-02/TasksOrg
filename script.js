

var taskArr = [];

const addTask = document.querySelector('.addTask');
const TaskPopup = document.querySelector('.addTaskPopup');
const ItemPopup = document.querySelector('.addItemPopup');
const header = document.querySelector('header');
const wrapper = document.querySelector('.wrapper');
const taskList = document.querySelector('.tasks');
const emptyListMenu = document.querySelector('.emptyList');

var tasks=null;
var selectedTask=null;


window.addEventListener('load',()=>{
    const storedTasks = JSON.parse(localStorage.getItem('TasksList'));
    if(storedTasks!==null && storedTasks.length!==0){
        taskArr=storedTasks;
        showTaskMenu();
        updateTaskMenu();
        updateCheckboxes();
    }
    else{
        showEmptyList();  
    }
})

function showTaskMenu(){
    taskList.classList.add('active');
    emptyListMenu.classList.remove('active');
}

function showEmptyList(){
    emptyListMenu.classList.add('active');
    taskList.classList.remove('active');  
}




function updateLocalStorage(){
    localStorage.setItem('TasksList',JSON.stringify(taskArr));
}

addTask.addEventListener('click', () => {
    TaskPopup.classList.add('active');
    header.classList.add('blur');
    wrapper.classList.add('blur');
})

function closePopup() {
    TaskPopup.classList.remove('active');
    header.classList.remove('blur');
    wrapper.classList.remove('blur');
}

function addTaskFunc() {
    const taskTitle = document.querySelector('.taskName').value;
    const obj = {
        taskName: taskTitle[0].toUpperCase()+taskTitle.slice(1,taskTitle.length),
        itemsArr: [],
    }

    taskArr.push(obj);
    closePopup();
    updateTaskMenu();
    updateCheckboxes();
    document.querySelector('.taskName').value="";
    window.location.reload();
}

// console.log(taskArr.length);



function updateTaskMenu() {
    updateLocalStorage();

    taskList.innerHTML=taskArr.map((taskEle, index) => {
        return(
        `
        <div class="task" id=${index}>
        <div class="taskHeader">
            <h1 class="taskName">${taskEle.taskName}</h1>
        </div>
        <div class="taskBody">
            <ul class="task-items">
                ${
                    taskEle.itemsArr.map((item,index)=>{
                        return (`
                            <li data-itemKey=${index}>
                                <div class="item">
                                    <input type="checkbox" onclick="handleTaskBtnClick()" class="itemInput">
                                    <label>${item.itemname}</label>
                                </div>
                                <div>
                                    <span class="handleItems delete"  onclick="deleteItem()"><i class="bi bi-trash3-fill"></i></span>
                                </div
                            </li>
                        `)
                    }).join('')
                }
            </ul>
        </div>
        <div class="taskFooter">
            <button class="addItem" onclick="showItemPopup()"><i class="bi bi-plus"></i> Add Item</button>
            <button class="deleteTask" onclick="handleTaskBtnClick()"><i class="bi bi-trash3-fill"></i> Delete Task</button>
        </div>
    </div>
    `)
    }).join('');


    tasks=document.querySelectorAll('.task');
    // console.log(tasks);

}


function updateCheckboxes(){
    tasks.forEach((task)=>{
        const taskInd=task.id;
        const listItems = task.querySelectorAll('.task-items li');
        listItems.forEach(item=>{
            const itemInd = item.dataset.itemkey;
            const checkVal = taskArr[taskInd].itemsArr[itemInd].isChecked;
            const itemInput=item.querySelector('.itemInput');
            itemInput.checked=checkVal;
        })
    })
}

function handleTaskBtnClick(){
    tasks.forEach(task=>{
        task.addEventListener('click',(e)=>{
            const selEle = e.target;

            // Item is to be added
            if(selEle.classList.contains('addItem')){
                selectedTask = e.path[2];
                showItemPopup();
                // console.log(selEle);
                // console.log(selectedTask);
                
            }

            // To delete task
            else if(selEle.classList.contains('deleteTask')){
                // console.log(e.target);
                const ind = e.path[2].id;
                // console.log(ind);
                taskArr.splice(ind,1);
                updateTaskMenu();
                updateCheckboxes();

                window.location.reload();
            }


            // To delete an item
            else if(selEle.classList.contains('bi-trash3-fill')){
                const ind=e.path[6].id;
                // console.log(ind);
                const selItemInd = e.path[3].dataset.itemkey;
                // console.log(selItemInd);
                taskArr[ind].itemsArr.splice(selItemInd,1);
                updateTaskMenu();
                updateCheckboxes();

            }

            // If an item is checked
            else if(selEle.classList.contains('itemInput')){
                const ind = e.path[5].id;
                const selItemInd = e.path[2].dataset.itemkey;
                var ischecked = selEle.checked;
                taskArr[ind].itemsArr[selItemInd].isChecked=ischecked;
                updateLocalStorage();
                updateTaskMenu();
                updateCheckboxes();

            }
            else{
                return;
            }

        })
    })

    
}

function showItemPopup(){

    ItemPopup.classList.add('active');
    header.classList.add('blur');
    wrapper.classList.add('blur');
    window.scroll(0,0);

    handleTaskBtnClick();
}

function closeItemPopup() {
    ItemPopup.classList.remove('active');
    header.classList.remove('blur');
    wrapper.classList.remove('blur');
    selectedTask=null;
}


function addItemFunc(){
    const itemName = document.querySelector('.itemName').value;
    const len = itemName.length;
    const index = selectedTask.id;

    const itemObj={
        itemname:itemName[0].toUpperCase()+itemName.slice(1, len),
        isChecked:false,
    }
    taskArr[index].itemsArr.push(itemObj); 
    closeItemPopup();
    updateTaskMenu();
    updateCheckboxes();
    document.querySelector('.itemName').value="";
}

function deleteItem(){
    handleTaskBtnClick();

}