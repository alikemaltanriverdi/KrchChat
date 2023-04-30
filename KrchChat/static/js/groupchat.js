let groupchat_form = $('#groupchat-form')

function submitForm(event) {
    event.preventDefault();
    var selectedFriends = [];
    var checkboxes = document.getElementsByName("friend");
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selectedFriends.push(checkboxes[i].value);
      }
    }
    if (selectedFriends.length < 2) {
      alert("Please select at least two friends.");
      return;
    }
    // Do something with the selected friends, e.g. send an AJAX request
    console.log(selectedFriends);
}