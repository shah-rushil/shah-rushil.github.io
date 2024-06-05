const addElement = document.getElementsByClassName('add-element');
const stylesheet = document.getElementById('stylesheet');

// Add element for To Do List

for(let i = 0; i < addElement.length; i++){
    addElement[i].addEventListener('click', function(event){
  
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

      closeButton.addEventListener('click', () =>{
          parent.removeChild(container);
      });
    });
}
  