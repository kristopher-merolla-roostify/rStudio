// Make the DIV element draggable:
//dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
  console.log("insideDragElement");
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    console.log(e);
    e.preventDefault();

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if(((elmnt.offsetTop - pos2) > 0) && (elmnt.offsetTop - pos2) < 370) {
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }

    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function makeDivName() {
  return "mydiv"+String(Math.floor((Math.random() * 10000000) + 2));
}

function makeButton() {
  var btn = document.createElement("BUTTON");
  btn.innerHTML = "Button";
  btn.id = makeDivName();
  btn.className = "btn btn-primary moveElm";

  document.getElementById("mainFormArea").appendChild(btn);
  dragElement(document.getElementById(btn.id));
}

function makeInput() {
  var ipt = document.createElement("INPUT");
  ipt.id = makeDivName();
  ipt.className = "form moveElm";

  document.getElementById("mainFormArea").appendChild(ipt);
  dragElement(document.getElementById(ipt.id)); 
}

function makeText() {
  var txt = document.createElement("P");
  txt.id = makeDivName();
  txt.className = "left-nav-text moveElm";
  txt.innerText = "This is some text!";

  document.getElementById("mainFormArea").appendChild(txt);
  dragElement(document.getElementById(txt.id));
}

function setEditMode() {
  element = document.getElementById("editButton");
  arr = document.getElementById("mainFormArea").children;

  if (element.classList.length == 1) {
    // add the "active" flag
    console.log("setting edit mode!");
    element.classList.add("active")

    // disable the moving functions
    for(i = 0; i< arr.length; i++) {
      e = document.getElementById(arr[i].id).onmousedown = nothing;
    }

  } else {
    // remove the "active" flag
    console.log("disabling edit mode!");
    element.classList.remove("active")

    // enable moving functions

  }
}

function setBox(elemNameStr) {
  console.log("setting for "+elemNameStr);
  // set a box around an element

}

function nothing() {}