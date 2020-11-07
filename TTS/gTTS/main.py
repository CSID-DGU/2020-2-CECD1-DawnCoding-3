from make import makeSound
from play import playSound
import datetime
import sys
import re
import time
import os

# main.py --message
if __name__ == "__main__":
    start = time.time()

    message = sys.argv[1]
    now = datetime.datetime.now()
    fileName = str(now)
    fileName = fileName[:-7]
    fileName = re.sub(":", "-", fileName)

    makeSound(message, fileName)

    volume = 1
    playSound(f"{fileName}.mp3", volume)

    os.remove(f"./{fileName}.mp3")
    print("time :", time.time() - start)
    pass
