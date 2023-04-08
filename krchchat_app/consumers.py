import json
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from deepgram import Deepgram
from typing import Dict
from channels.generic.websocket import AsyncWebsocketConsumer
import environ
from krchchat_app.models import Conversation, ChatMessage

User = get_user_model()


class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print('connected', event)
        user = self.scope['user']
        chat_room = f'user_chatroom_{user.id}'
        self.chat_room = chat_room
        await self.channel_layer.group_add(
            chat_room,
            self.channel_name
        )
        await self.send({
            'type': 'websocket.accept'
        })

    async def websocket_receive(self, event):
        print('receive', event)
        received_data = json.loads(event['text'])
        msg = received_data.get('message')
        sent_by_id = received_data.get('sent_by')
        send_to_id = received_data.get('send_to')
        conversation_id = received_data.get('conversation_id')

        if not msg:
            print('Error:: empty message')
            return False

        sent_by_user = await self.get_user_object(sent_by_id)
        send_to_user = await self.get_user_object(send_to_id)
        conversation_obj = await self.get_conversation(conversation_id)
        if not sent_by_user:
            print('Error:: sent by user is incorrect')
        if not send_to_user:
            print('Error:: send to user is incorrect')
        if not conversation_obj:
            print('Error:: conversation id is incorrect')

        await self.create_chat_message(conversation_obj, sent_by_user, msg)

        other_user_chat_room = f'user_chatroom_{send_to_id}'
        self_user = self.scope['user']
        response = {
            'message': msg,
            'sent_by': self_user.id,
            'conversation_id': conversation_id
        }

        await self.channel_layer.group_send(
            other_user_chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(response)
            }
        )

        await self.channel_layer.group_send(
            self.chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(response)
            }
        )



    async def websocket_disconnect(self, event):
        print('disconnect', event)

    async def chat_message(self, event):
        print('chat_message', event)
        await self.send({
            'type': 'websocket.send',
            'text': event['text']
        })

    @database_sync_to_async
    def get_user_object(self, user_id):
        qs = User.objects.filter(id=user_id)
        if qs.exists():
            obj = qs.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def get_conversation(self, conversation_id):
        qs = Conversation.objects.filter(id=conversation_id)
        if qs.exists():
            obj = qs.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def create_chat_message(self, conversation, user, msg):
        ChatMessage.objects.create(conversation=conversation, user=user, message=msg)

    @database_sync_to_async
    def create_conversation(self, sender_id, receiver_id):
        Conversation.objects.create(first_person_id=sender_id, second_person_id=receiver_id)
        

class TranscriptConsumer(AsyncWebsocketConsumer):
    envs = environ.Env()
    envs.read_env()
    api_key = envs("DEEPGRAM_API_KEY")
    dg_client = Deepgram(api_key)
    num_xfer_debug = 0

    async def get_transcript(self, data: Dict) -> None:
        if 'channel' in data:
            transcript = data['channel']['alternatives'][0]['transcript']
            if transcript:
                await self.send(transcript)

    async def connect_to_deepgram(self):
        try:
            self.socket = await self.dg_client.transcription.live({'punctuate': True, 'interim_results': False})
            self.socket.registerHandler(self.socket.event.CLOSE, lambda c: print(f'Connection closed with code {c}.'))
            self.socket.registerHandler(self.socket.event.TRANSCRIPT_RECEIVED, self.get_transcript)

        except Exception as e:
            raise Exception(f'Could not open socket: {e}')

    async def connect(self):
        await self.connect_to_deepgram()
        await self.accept()
        self.room_group_name = "group_chat_gfg"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
           self.room_group_name,
           self.channel_name
        )

    async def receive(self, bytes_data):
        #print(f"Got media data: {self.num_xfer_debug}")
        self.num_xfer_debug += 1
        self.socket.send(bytes_data)