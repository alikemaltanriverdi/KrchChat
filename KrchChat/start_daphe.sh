#!/usr/bin/env bash
source /opt/python/run/venv/bin/activate && source /opt/python/current/env
/opt/python/run/venv/bin/daphne -b 0.0.0.0 -p 5000 KrchChat.asgi:channel_layer