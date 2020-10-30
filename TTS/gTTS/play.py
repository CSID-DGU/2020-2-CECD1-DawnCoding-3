import pyglet


def playSound(soundname):
    song = pyglet.media.load(soundname)
    song.play()
    pyglet.app.run()
    pyglet.app.exit()
