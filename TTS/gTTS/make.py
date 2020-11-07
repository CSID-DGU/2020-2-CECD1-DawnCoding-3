from gtts import gTTS
import datetime


def makeSound(textList):
    text = textList
    now = datetime.datetime.now()
    fileName = str(now)
    fileName = fileName[:-7]
    tts = gTTS(text=text, lang="ko")
    # filename = f"{fileName}.mp3"
    s = "dd"
    tts.save(f"{s}.mp3")
    return s