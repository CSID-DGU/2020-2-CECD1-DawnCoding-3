import sys
import pygame as pg


def play_music(music_file, volume=0.8):
    # set up the mixer
    freq = 16000    # audio CD quality
    bitsize = -16    # unsigned 16 bit
    channels = 1     # 1 is mono, 2 is stereo
    buffer = 1024 * 2  # number of samples (experiment to get best sound)
    # pg.mixer.quit()
    pg.mixer.init(freq, bitsize, channels, buffer)
    # pg.mixer.init()
    # volume value 0.0 to 1.0
    pg.mixer.music.set_volume(volume)
    clock = pg.time.Clock()
    try:
        pg.mixer.music.load(music_file)
        print("Music file {} loaded!".format(music_file))
    except pg.error:
        print("File {} not found! ({})".format(music_file, pg.get_error()))
        return
    pg.mixer.music.play()
    while pg.mixer.music.get_busy():
        # check if playback has finished
        clock.tick(10)
    pg.quit()
# pick music file you have in the working folder
# otherwise give the full file path
# (try other sound file formats too)


# if __name__ == '__main__':
#     music_file = sys.argv[1]
#     # optional volume 0 to 1.0
#     volume = 0.8
#     play_music(music_file, volume)
