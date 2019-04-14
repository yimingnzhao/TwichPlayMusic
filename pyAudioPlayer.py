import pyaudio
import numpy as np
import math
import sys

def playNote(frequency, length):
    p = pyaudio.PyAudio()

    volume = 1.0     # range [0.0, 1.0]
    fs = 44100       # sampling rate, Hz, must be integer
    duration = length   # in seconds, may be float
    f = frequency        # sine frequency, Hz, may be float

    # generate samples, note conversion to float32 array
    samples = (np.sin(2*np.pi*np.arange(fs*duration)*f/fs)).astype(np.float32)
    #samples = (np.power(np.sin((np.pi)*np.arange(fs*duration)),3) + np.sin(np.pi*(np.arange(fs*duration) + 2.0/3.0)))
    #samples = -1*(np.sin(3*np.pi*np.arange(fs,duration))*0.25) + (np.sin(np.pi*np.arange(fs,duration))*0.25) + (np.sqrt(3)*0.5*np.cos(np.pi*np.arange(fs,duration)))
    # for paFloat32 sample values must be in range [-1.0, 1.0]
    stream = p.open(format=pyaudio.paFloat32,
                    channels=1,
                    rate=fs,
                    output=True)

    # play. May repeat with different volume values (if done interactively) 
    stream.write(volume*samples)

    stream.stop_stream()
    stream.close()

    p.terminate()

#440 freq default
playNote(frequency = float(sys.argv[1]),length = float(sys.argv[2]))