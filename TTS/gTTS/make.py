from gtts import gTTS


def makeSound(textList, soundname):
    text = textList
    tts = gTTS(text=text, lang='ko')
    filename = f"{soundname}.mp3"
    tts.save(filename)
