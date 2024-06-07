// Create Database to store tasks using indexedDB

let db = null;

const request = indexedDB.open("tasks");

let notStartedCount = 0; // Counters for each section
let startedCount = 0;
let completedCount = 0;

request.onupgradeneeded = e => {
  db = e.target.result;
  const notStartedTasks = db.createObjectStore("notStartedTasks", {keyPath: "ID"});
  const startedTasks = db.createObjectStore("startedTasks", {keyPath: "ID"});
  const completedTasks = db.createObjectStore("completedTasks", {keyPath: "ID"});
}
  
request.onsuccess = e => {

  // Counters for each section
startedCount = 0;
completedCount = 0;

db = e.target.result;

function getAllRecordsWithCursor(storeName) {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const data = [];
      const cursorRequest = objectStore.openCursor();

      cursorRequest.onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
              data.push(cursor.value);
              cursor.continue();
          } else {
            objectStore.clear();  
            resolve(data);  // Resolve the promise with the collected data when the cursor is done
          }
      };

      cursorRequest.onerror = function(event) {
          console.error(`Error opening cursor on ${storeName}:`, event.target.error);
          reject(event.target.error);
      };
    });
  }

  // Use the function to get all records from each object store and run something when done
  Promise.all([
    getAllRecordsWithCursor("notStartedTasks"),
    getAllRecordsWithCursor("startedTasks"),
    getAllRecordsWithCursor("completedTasks")
  ]).then(([notStartedTasksData, startedTasksData, completedTasksData]) => {
    console.log('Data retrieved from object stores using cursors');
    console.log('notStartedTasksData:', notStartedTasksData);
    console.log('startedTasksData:', startedTasksData);
    console.log('completedTasksData:', completedTasksData);

    // Do something with the data after the cursor operations are done
    const allTasks = [...notStartedTasksData, ...startedTasksData, ...completedTasksData];
    console.log('All tasks:', allTasks);
    const notStartedTrans = db.transaction("notStartedTasks", "readwrite");
    const notStartedStore = notStartedTrans.objectStore("notStartedTasks");
    for(let i = 0; i < notStartedTasksData.length; i++){
      console.log(notStartedTasksData.length);
      console.log(notStartedTasksData[i]);
      notStartedStore.put({ID: notStartedCount, text: notStartedTasksData[i].text});
      initializeTasks(notStartedTasksData[i].text, "notStarted");
    }
    const startedTrans = db.transaction("startedTasks", "readwrite");
    const startedStore = startedTrans.objectStore("startedTasks");
    for(let i = 0; i < startedTasksData.length; i++){
      console.log(startedTasksData.length);
      console.log(startedTasksData[i]);
      startedStore.put({ID: startedCount, text: startedTasksData[i].text});
      initializeTasks(startedTasksData[i].text, "started");
    }
    const completedTrans = db.transaction("completedTasks", "readwrite");
    const completedStore = completedTrans.objectStore("completedTasks");
    for(let i = 0; i < completedTasksData.length; i++){
      console.log(completedTasksData.length);
      console.log(completedTasksData[i]);
      completedStore.put({ID: completedCount, text: completedTasksData[i].text});
      initializeTasks(completedTasksData[i].text, "completed");
    }

    // For example, perform some action with allTasks array
  }).catch(error => {
      console.error('Error retrieving data from object stores using cursors:', error);
  });
}

request.onerror = e => {
  alert("error found");
}

// Initializes the Tasks

function initializeTasks(textmsg, type){
  let taskName = type+"Task";
  
  var container = document.createElement("div");
  container.classList.add("list-element");

  var listElement = document.createElement("textarea");
  listElement.classList.add("textarea-element");
  listElement.textContent = textmsg;

  var closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.textContent = "X";

  container.appendChild(listElement);
  container.appendChild(closeButton);
  container.draggable = true;

  var elemID;
  if(type == "notStarted"){
    container.id = taskName+"s-"+notStartedCount;
    notStartedCount += 1;
    elemID = "not-started";
  }
  else if(type == "started"){
    container.id = taskName+"s-"+startedCount;
    startedCount += 1;
    elemID = "started";
  }
  else{
    container.id = taskName+"s-"+completedCount;
    completedCount += 1;
    elemID = "completed";
  }

  var parent = document.getElementById(elemID + "-task");
  parent.insertBefore(container, document.getElementById(elemID));

  // Store the text in the task element in the data base
  createEventListeners(listElement, container, closeButton, parent, elemID);
  
}

function createEventListeners(listElement, container, closeButton, parent, elemID){
  let txt = null;
  let tasksDB = null;
  
  listElement.addEventListener('blur', () => { // When user leaves the textarea, the value of the database is updated
    if(elemID == "not-started"){
      txt = db.transaction("notStartedTasks", "readwrite");
      tasksDB = txt.objectStore("notStartedTasks");
      tasksDB.put({ID: parseInt(container.id.split("-")[1]), text: listElement.value});
    }
    else if(elemID == "started"){
      txt = db.transaction("startedTasks", "readwrite");
      tasksDB = txt.objectStore("startedTasks");
      tasksDB.put({ID: parseInt(container.id.split("-")[1]), text: listElement.value});
    }
    else{
      txt = db.transaction("completedTasks", "readwrite");
      tasksDB = txt.objectStore("completedTasks");
      tasksDB.put({ID: parseInt(container.id.split("-")[1]), text: listElement.value});
    }
  });

  closeButton.addEventListener('click', () =>{ // Delete value of database when task is deleted
      parent.removeChild(container);
      let containerID = container.id.split('-');
      console.log(containerID[0]);
      txt = db.transaction(containerID[0], "readwrite");
      tasksDB = txt.objectStore(containerID[0]);
      tasksDB.delete(parseInt(containerID[1]));
  });
}

// Add element for To Do List

for(let i = 0; i < addElement.length; i++){
    addElement[i].addEventListener('click', function(event){
      
      // Create the Task Element and add it to the webpage
      var container = document.createElement("div");
      container.classList.add("list-element");
  
      var listElement = document.createElement("textarea");
      listElement.classList.add("textarea-element");
  
      var closeButton = document.createElement("button");
      closeButton.classList.add("close-button");
      closeButton.textContent = "X";
  
      container.appendChild(listElement);
      container.appendChild(closeButton);
      container.draggable = true;
  
      var elemID = event.target.id;
      var parent = document.getElementById(elemID + "-task");
      parent.insertBefore(container, event.target);
      listElement.focus();

      // Store the text in the task element in the data base

      let txt = null;
      let tasksDB = null;
      
      listElement.addEventListener('blur', () => { // When user leaves the textarea, the value of the database is updated
        if(elemID == "not-started"){
          txt = db.transaction("notStartedTasks", "readwrite");
          tasksDB = txt.objectStore("notStartedTasks");
          if(container.id === ""){ // being defined for the first time
            tasksDB.add({ID: notStartedCount, text: listElement.value});
            container.id = "notStartedTasks-"+notStartedCount;
            notStartedCount += 1;
          }
          else{ // redefining text
            tasksDB.put({ID: parseInt(container.id.split("-")[1]), text: listElement.value});
          }
        }
        else if(elemID == "started"){
          txt = db.transaction("startedTasks", "readwrite");
          tasksDB = txt.objectStore("startedTasks");
          if(container.id === ""){
            tasksDB.add({ID: startedCount, text: listElement.value});
            container.id = "startedTasks-"+startedCount;
            startedCount += 1;
          }
          else{
            tasksDB.put({ID: parseInt(container.id.split("-")[1]), text: listElement.value});
          }
        }
        else{
          txt = db.transaction("completedTasks", "readwrite");
          tasksDB = txt.objectStore("completedTasks");
          if(container.id === ""){
            tasksDB.add({ID: completedCount, text: listElement.value});
            container.id = "completedTasks-"+completedCount;
            completedCount += 1;
          }
          else{
            tasksDB.put({ID: parseInt(container.id.split("-")[1]), text: listElement.value});
          }
        }
      });

      closeButton.addEventListener('click', () =>{ // Delete value of database when task is deleted
          parent.removeChild(container);
          let containerID = container.id.split('-');
          txt = db.transaction(containerID[0], "readwrite");
          tasksDB = txt.objectStore(containerID[0]);
          tasksDB.delete(parseInt(containerID[1]));
      });
    });
}
