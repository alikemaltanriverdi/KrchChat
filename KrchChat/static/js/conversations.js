friend_forms = $('form[name="friend-form"]');
// console.log(friend_forms); 

var i;
for (i = 0; i < friend_forms.length; ++i) {
	let friend_form = friend_forms[i];
	friend_form.onsubmit = (e) => {
		e.preventDefault();
		$('body').load("handleFriendClick/",
		{
			'friend': friend_form['friend'].value
		});
		return false;
	}
	friend_form.children.friendbox.onclick = () => {
		friend_form.requestSubmit();
	};
}