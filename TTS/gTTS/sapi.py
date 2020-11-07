import win32com.client
# import time

# start = time.time()
tts = win32com.client.Dispatch("SAPI.SpVoice")
tts.Speak("새벽코딩 어서오고")
# print("time :", time.time() - start)
