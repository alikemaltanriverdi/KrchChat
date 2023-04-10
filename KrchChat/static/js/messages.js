let loc = window.location
// let wsStart = 'ws://'
if(loc.protocol === 'http:') {
    wsStart = 'ws://'
}
if(loc.protocol === 'https:') {
    wsStart = 'wss://'
}
let initialURL = wsStart + loc.host + "/ws/"

var chatSocket = new WebSocket(initialURL + "chat")
var speechSocket = new WebSocket(initialURL+'listen')
jQuery(document).ready(function($){
let input_message = $('#input-message')
let message_body = $('.msg_card_body')
let send_message_form = $('#send-message-form')
const USER_ID = $('#logged-in-user').val()


$("#log-out").click(function() {
  window.location = '/accounts/logout/'
});

chatSocket.onopen = async function(e){
    // console.log('open', e)
    send_message_form.on('submit', function (e){
        e.preventDefault()
        let message = input_message.val()
        console.log('message', message)
      
        let send_to = get_active_other_user_id()
      
        let conversation_id = get_active_conversation_id()
    
        if (!conversation_id){
         
        }

        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'conversation_id': conversation_id
        }
        data = JSON.stringify(data)

        chatSocket.send(data)
        
        $(this)[0].reset()

    })
}

chatSocket.onmessage = async function(e){
    // console.log('message', e)
    debugger
    let data = JSON.parse(e.data)
    let message = data['message']
    let sent_by_id = data['sent_by']
    let conversation_id = data['conversation_id']
    debugger
    newMessage(message, sent_by_id, conversation_id)
}

chatSocket.onerror = async function(e){
    console.log('error', e)
}

chatSocket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, conversation_id) {
    debugger;
	if ($.trim(message) === '') {
		return false;
	}
	let message_element;
	let chat_id = 'chat_' + conversation_id
	if(sent_by_id == USER_ID){
	    message_element = `
			<div class="d-flex mb-4 replied">
				<div class="msg_cotainer_send">
					${message}
					<span class="msg_time_send">8:55 AM, Today</span>
				</div>
               
				<div class="img_cont_msg"> <i class="bi-person-fill-add"></i>
					
				</div>
			</div>
	    `
    }
	else{
	    message_element = `
           <div class="d-flex mb-4 received">
              <div class="img_cont_msg">
                 <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                 ${message}
              <span class="msg_time">8:40 AM, Today</span>
              </div>
           </div>
        `

    }

    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
	message_body.append($(message_element))
    message_body.animate({
        scrollToBottom: $(document).height()
    }, 50);
	input_message.val(null);
}


$('.contact-li').on('click', function (){
    $('.contacts .active').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let chat_id = $(this).attr('chat-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')
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
}});