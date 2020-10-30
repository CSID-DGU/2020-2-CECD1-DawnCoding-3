import pyttsx3

engine = pyttsx3.init()
engine.setProperty('rate', 170)

volume = engine.getProperty('volume')
voices = engine.getProperty('voices')


engine.setProperty('voice', voices[0].id)
# command = "첫번째 반복"
# command2 = "두번째 반복"
commandList = ["첫번째 반복, 두번째 반복"]
for command in commandList:
    engine.say(command)
    engine.runAndWait()

# save
# engine.save_to_file(command, 'pyttsx.mp3')
# engine.runAndWait()
