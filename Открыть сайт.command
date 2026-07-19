#!/bin/bash
# Lunchtime Dead — local launcher.
# Double-click this file: it starts a tiny local server and opens the site.
# (Running through a server makes the audio-reactive visuals work in every browser.)
cd "$(dirname "$0")"
PORT=8137
( sleep 1; open "http://localhost:$PORT" ) &
python3 -m http.server $PORT
