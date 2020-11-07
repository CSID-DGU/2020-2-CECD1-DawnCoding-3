from gtts import gTTS


def makeSound(textList, fileName):
    text = textList
    tts = gTTS(text=text, lang="ko")
    # filename = f"{fileName}.mp3"
    tts.save(f"{fileName}.mp3")