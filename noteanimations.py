import cv2 as cv
import numpy as np
import time
import random
import math
import sys
import os

width = 1500
height = 900
noterad = 10
secperframe = .05
decay_rate = 5
buffer = 60

class Note:
    def __init__(self, frequency, duration):
        self.frequency = frequency
        self.duration = duration
        self.color = (random.random() * 150, random.random() * 150, random.random() * 150)
        self.opacity = 1.0
        self.y = height - math.log(frequency, 2) * 70 + 180
        self.x = (width - buffer) * random.random() + buffer

toDraw = []

def add_note(frequency, duration):
    toDraw.append(Note(frequency, duration))

def update_notes (img):
    i = 0
    while i < len(toDraw):
        note = toDraw[i]
        overlay = img.copy()
        cv.circle(overlay, (int(note.x), int(note.y)), noterad, note.color, thickness = int(noterad * 2.5))
        cv.addWeighted(overlay, note.opacity, img, 1-note.opacity, 0, img)
        note.opacity -= decay_rate * secperframe / note.duration
        if note.opacity < 0:
            toDraw.remove(note)
        else:
            i += 1

cv.namedWindow("Twitch Plays Music!", cv.WND_PROP_FULLSCREEN)
cv.setWindowProperty("Twitch Plays Music!",cv.WND_PROP_FULLSCREEN,cv.WINDOW_FULLSCREEN)

while(1):
    blank_image = np.ones((height, width,3), np.uint8) * 255

    update_notes(blank_image)
    cv.imshow('Twitch Plays Music!', blank_image)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

    if not os.stat("tmp").st_size == 0:
        f = open("tmp", "r")
        line = f.readline()
        sep = line.split()
        f.close()
        open('tmp', 'w').close()
        i = 0
        while i < len(sep):
            add_note(float(sep[i]), float(sep[i+1]))
            i += 2
