from gtts import gTTS


def makeSound(a, b, soundname):
    text = f"{a}가 {b} 되었습니다."
    tts = gTTS(text=text, lang='ko')
    filename = f"{soundname}.mp3"
    tts.save(filename)
