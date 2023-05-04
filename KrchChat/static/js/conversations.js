friend_forms = $('form[name="friend-form"]');
// console.log(friend_forms); 

var i;
for (i = 0; i < friend_forms.length; ++i) {
	let friend_form = friend_forms[i];
	friend_form.onsubmit = (e) => {
		console.log("Submitted")
	}
	// friend_form.children.friendbox.onclick = () => {
	// 	debugger;
		
	// 	friend_form.submit();
	// };
}
// function submitForm() {
//     var http = new XMLHttpRequest();
//     http.open("POST", "<<whereverTheFormIsGoing>>", true);
//     http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     var params = "search=" + <<get search value>>; // probably use document.getElementById(...).value
//     http.send(params);
//     http.onload = function() {
//         alert(http.responseText);
//     }
// }