friend_forms = $('form[name="friend-form"]');
// console.log(friend_forms); 

var i;
for (i = 0; i < friend_forms.length; ++i) {
	let friend_form = friend_forms[i];
	friend_form.onsubmit = (e) => {
		console.log("Submitted")
	}
	friend_form.children.friendbox.onclick = () => {
		friend_form.requestSubmit();
	};
}