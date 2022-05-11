
// https://www.digitalocean.com/community/tutorials/how-to-modify-attributes-classes-and-styles-in-the-dom
//https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/

function clickOn(event) {
  console.log("clicked");
  event.target.textContent = "It WORKED!!";
 }


document.querySelectorAll('.grid-item').forEach(item => {
  item.addEventListener('click', clickOn);
  console.log("added");
});
