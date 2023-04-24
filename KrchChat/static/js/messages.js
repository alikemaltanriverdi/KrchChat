
let input_message = $('#input-message')
let message_body = $('.msg_card_body')
let send_message_form = $('#send-message-form')

const USER_ID = $('#logged-in-user').val()


jQuery(document).ready(function($){
$('body').scrollTop($('ul li').last().position().top + $('ul li').last().height());

let loc = window.location
let wsStart = 'ws://';
if(loc.protocol === 'http:') {
    wsStart = 'ws://'
}
if(loc.protocol === 'https:') {
    wsStart = 'wss://'
}
let initialURL = wsStart + loc.host + "/ws/"

var chatSocket = new WebSocket(initialURL + "chat")
var speechSocket = new WebSocket(initialURL+'listen')

// $("#log-out").click(function() {
//
//   window.location = '/logout/'
// });

var is_typing = 0


chatSocket.onopen = async function(e){
    // console.log('open', e)
    send_message_form.on('submit', function (e){
        e.preventDefault()
        let message = input_message.val()
        console.log('message', message)
      
        let send_to = get_active_other_user_id()
      
        let conversation_id = get_active_conversation_id()

        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'conversation_id': conversation_id
        }
        data = JSON.stringify(data)
        chatSocket.send(data)
        $(this)[0].reset()
        is_typing = 0
    })
    send_message_form.on('input', function (e){
        if (is_typing === 0) {
            e.preventDefault()
            console.log('typing started')
            let send_to = get_active_other_user_id()
            let conversation_id = get_active_conversation_id()

            let data = {
                'typing': 1,
                'sent_by': USER_ID,
                'send_to': send_to,
                'conversation_id': conversation_id
            }
            data = JSON.stringify(data)
            chatSocket.send(data)
            is_typing = 1
        } else {
            if (input_message.val() == "") {
                e.preventDefault()
                console.log('typing stopped')
                let send_to = get_active_other_user_id()
                let conversation_id = get_active_conversation_id()

                let data = {
                    'typing': 0,
                    'sent_by': USER_ID,
                    'send_to': send_to,
                    'conversation_id': conversation_id
                }
                data = JSON.stringify(data)
                chatSocket.send(data)
                is_typing = 0
            }
        }

    })
}

chatSocket.onmessage = async function(e){

    console.log('message', e)
    let data = JSON.parse(e.data)
    console.log(data)

    let conv_idx = data['conversation_id']

    if (data.hasOwnProperty('typing') && data['typing'] == 1 && data['sent_by'] != USER_ID) {
        updateTypingStatus(data['sent_by'], conv_idx, 1)
    } else if (data.hasOwnProperty('typing') && data['typing'] == 0 && data['sent_by'] != USER_ID) {
        //document.querySelector('#typing_status').textContent = "No one is typing"
        updateTypingStatus(data['sent_by'], conv_idx, 0)
    } else if (!data.hasOwnProperty('typing')) {
        let message = data['message']
        let sent_by_id = data['sent_by']
        let conversation_id = data['conversation_id']
        if (data['sent_by'] != USER_ID) {
            updateTypingStatus(data['sent_by'], conv_idx, 0)
        }
        newMessage(message, sent_by_id, conversation_id)
    }
}

function updateTypingStatus(user, conversation_id, is_typing) {
    typing_status_span = $('.messages-wrapper[chat-id="chat_' + conversation_id + '"] .typing_status')
    friend_name_elem = $('.messages-wrapper[chat-id="chat_' + conversation_id + '"] .msg_head .bd-highlight .user_info')[0]
    friend_name_parts = friend_name_elem.innerText.split("\n")[0]
    friend_name = friend_name_parts.split(" ")[2]

    if (is_typing == 1) {
        typing_status_span[0].textContent = friend_name + " is typing..."
    } else {
        typing_status_span[0].textContent = ""
    }

}

chatSocket.onerror = async function(e){
    console.log('error', e)
}

chatSocket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, conversation_id) {

	if ($.trim(message) === '') {
		return false;
	}
	let message_element;
	let chat_id = 'chat_' + conversation_id
    var time = new Date();
    var strTime =time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

	if(sent_by_id == USER_ID){
	    // message_element = `
		// 	<div class="d-flex mb-4 replied">
		// 		<div class="msg_cotainer_send">
		// 			${message}
		// 			<span class="msg_time_send">${strTime}, Today</span>
		// 		</div>
               
		// 		<div class="img_cont_msg"> 
        //         <img src="https://thumb.ac-illust.com/52/52681e2491ae435cfd5af91226c3c3cd_t.jpeg" class="rounded-circle user_img_msg">
					
		// 		</div>
		// 	</div>
	    // `
        message_element = `
        <li class="me">
					<div class="entete">
						<h3>Me</h3>
						<h2>${strTime}, Today</h2>
						<span class="status blue"></span>
					</div>
					<div class="triangle"></div>
					<div class="message">
                    ${message}
					</div>
				</li>
    `
        
    }
	else{
	    // message_element = `
        //    <div class="d-flex mb-4 received">
        //       <div class="img_cont_msg">
        //          <img src="https://thumb.ac-illust.com/52/52681e2491ae435cfd5af91226c3c3cd_t.jpeg" class="rounded-circle user_img_msg">
        //       </div>
        //       <div class="msg_cotainer">
        //          ${message}
        //       <span class="msg_time">${strTime}, Today</span>
        //       </div>
        //    </div>
        // `
        message_element = `
        <li class="you">
        <div class="entete">
            <span class="status green"></span>
            <h2>{{ conversation.first_person.username }}</h2>
            <h3>${strTime}, Today</h3>
        </div>
        <div class="triangle"></div>
        <div class="message">
        ${message}
        </div>
        </li>
        `
        

    }

    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
	message_body.append($(message_element))
    message_body.animate({
        scrollToBottom: $(document).height()
    }, 50);
	input_message.val(null);
}

var input_form_map = new Map();
$('.contact-li').on('click', function (){
    // Handle saving of text field
    let old_chat_id = "chat_" + get_active_conversation_id()
    if (input_message.val() != "") {
        input_form_map.set(old_chat_id, input_message.val())
    }

    $('.contacts .active').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let chat_id = $(this).attr('chat-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')

    // Handle loading of text field
    if (input_form_map.get(chat_id) !== undefined) {
        document.querySelector('#input-message').value = input_form_map.get(chat_id)
    } else {
        document.querySelector('#input-message').value = "" // FIXME RK make this the type a message
    }
})

$('.friend-li').on('click', function (){

    $('.friends .active').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let friend_id = $(this).attr('friend-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[friend-id="' + friend_id +'"]').addClass('is_active')
})

function get_active_other_user_id(){
    let other_user_id = $('.messages-wrapper.is_active').attr('other-user-id')
    other_user_id = $.trim(other_user_id)
    return other_user_id
}

function get_active_conversation_id(){
    let chat_id = $('.messages-wrapper.is_active').attr('chat-id')
    let conversation_id = chat_id.replace('chat_', '')
    return conversation_id
}

/* Speech to text handling */
let recording = false;
var mediaRecorder;
function captureUserMedia(successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(successCallback).catch(errorCallback);
}
function onMediaSuccess(stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.addEventListener('dataavailable', async (event) => {
        if (event.data.size > 0 && speechSocket.readyState == 1) {
            speechSocket.send(event.data)
        }
    })
    mediaRecorder.start(250)
}
function onMediaError(e) {
    console.error('media error', e);
}
document.querySelector("#speech_to_text").onclick = function (e) {
    if (recording === false)
    {
        document.getElementById("speech_text_icon").className = 'fas fa-stop'
        document.querySelector('#input-message').value = ""
        captureUserMedia(onMediaSuccess, onMediaError);
        recording = true;
    } else {
    document.getElementById("speech_text_icon").className = 'fas fa-microphone'
        mediaRecorder.stop()
        mediaRecorder.stream.getAudioTracks().forEach(function(track) {
            track.stop();
        });
        recording = false;
    }
};

speechSocket.onmessage = (message) => {
    const received = message.data
    if (received) {
        console.log(received)
        document.querySelector('#input-message').value += received
    }

}


})