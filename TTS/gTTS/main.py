from make import makeSound
from play import playSound
import sys

if __name__ == "__main__":

    now = makeSound("새벽코딩 어서오고")
    # playSound("test2.mp3")
    # music_file = sys.argv[1]
    # optional volume 0 to 1.0
    volume = 1
    playSound(f"{now}.mp3", volume)
    pass
