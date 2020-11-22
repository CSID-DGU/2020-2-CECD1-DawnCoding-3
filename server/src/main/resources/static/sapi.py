import win32com.client
import sys
# import time

# start = time.time()
message = sys.argv[1]
tts = win32com.client.Dispatch("SAPI.SpVoice")
tts.Rate = 5

tts.Speak(message)
# print("time :", time.time() - start)
