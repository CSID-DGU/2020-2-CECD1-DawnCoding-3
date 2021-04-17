import pyaudio
import wave
import threading
import time
import speech_recognition as sr

FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
CHUNK = 1024
WAVE_OUTPUT_FILENAME = "file.wav"

stop_ = False
audio = pyaudio.PyAudio()

stream = audio.open(format=FORMAT, channels=CHANNELS,
                    rate=RATE, input=True,
                    frames_per_buffer=CHUNK)

start_time = time.time()
print("말해주세요...")


def stop():
    global stop_
    while True:
        if time.time() - start_time >= 5:  # 5분 동안 녹음 진행
            stop_ = True
        # if not input('Press Enter >>>'):
        #     print('exit')
        #     stop_ = True


t = threading.Thread(target=stop, daemon=True).start()
frames = []

while True:
    data = stream.read(CHUNK)
    frames.append(data)
    if stop_:
        print("종료됩니다...")
        break

stream.stop_stream()
stream.close()
audio.terminate()
waveFile = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
waveFile.setnchannels(CHANNELS)
waveFile.setsampwidth(audio.get_sample_size(FORMAT))
waveFile.setframerate(RATE)
waveFile.writeframes(b''.join(frames))
waveFile.close()


AUDIO_FILE = "file.wav"

r = sr.Recognizer()
with sr.AudioFile(AUDIO_FILE) as source:
    audio = r.record(source)


try:
    print("Message : " +
          r.recognize_google(audio, language='ko'))
except sr.UnknownValueError:
    print("Google Speech Recognition could not understand audio")
except sr.RequestError as e:
    print(
        "Could not request results from Google Speech Recognition service; {0}".format(e))