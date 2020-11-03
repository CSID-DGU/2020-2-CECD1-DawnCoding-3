from make import makeSound
from play import playSound
import sys

if __name__ == "__main__":
    
    makeSound("새벽코딩", "김현준 배진우 유성근,","test")
    # playSound("1.mp3")

    music_file = sys.argv[1]
    # optional volume 0 to 1.0
    volume = 1
    playSound(music_file, volume)
    pass
