

let selectedWords = [];
let sWLimit = false

//Read out the list, and put into boxes innerHTML.
function confirmfinalwords() {
  let finalContent = "<span class='blinking'>";
  for (let word of selectedWords) {
    finalContent += ( word + " , ");
  }
  finalContent+="</span>";
  $( "#selectedwords" ).html(finalContent);
  $("#consolebox").attr("class","console");
}

//Once limit hits, we can no longer add words unless we press reset button.
function modifyselwords(word) {
  selectedWords.push(word);
  if (selectedWords.length == 4) {
    sWLimit = true;
    confirmfinalwords();
  }
}

//Does the css change, and calls modifyselwords() if not chosen yet.
function addword(event) {
  let classes = event.target.getAttribute("class").split(" ");
  if (!classes.includes("clicked")) {
    event.target.setAttribute("class", "grid-item-clicked " + classes[1]);
    modifyselwords(event.target.innerHTML);
  }
}

//State dependent block on addword() function.
function wordpicked(event) {
 (!sWLimit)?addword(event):null;
}

function resetwords(event) {
  selectedWords = [];
  sWLimit = false;
  $(".grid-item-clicked").each( function(){
    let classes = $(this).attr("class").split(" ");
    console.log(classes);
    $(this).attr("class","grid-item " + classes[1]);
  });
  $( "#selectedwords" ).html("");
}

function sendmessage(event) {
  if (selectedWords.length != 4) {
    let content = $( "#consolebox" ).html();
    $( "#consolebox" ).html(content + "<br /> <div id='warning' class='warningtext'> Warning:: 16 words not selected. Check your selections. </div>");
  }
  let seedPhrase = selectedWords.reduce((concat, word) => {return concat+=word;},"");
  var post = $.post( "http://localhost:8081", { seedPhrase: seedPhrase, mode: "query" })
  .done((data) => {console.log("Data Loaded:" + data)});

}


$(".grid-item").on( "click", wordpicked);
$("#reset-button").on( "click", resetwords);
$("#sendmessage").on("click", sendmessage);
$("#confirm-words").on( "click", resetwords);





// https://www.digitalocean.com/community/tutorials/how-to-modify-attributes-classes-and-styles-in-the-dom
// https://api.jquery.com/on/
// Blinking Text CSS3: https://html-online.com/articles/blinking-text-css-animation/
