from Tkinter import *
from math import *
root = Tk()

w = Canvas(root, width = 600, height = 600)
w.create_rectangle(2, 2, 600, 600, width=2, outline = 'green', fill = 'white')
w.grid(row = 1, rowspan = 20, column = 1, columnspan = 10, padx=20, pady=20)

def rotate_dot(center, dot, angle):
    x0 = dot[0]
    y0 = dot[1]
    cx = center[0]
    cy = center[1]
    x = cx + (x0 - cx) * cos(radians(angle)) + (y0 - cy) * sin(radians(angle))
    y = cy + (y0 - cy) * cos(radians(angle)) - (x0 - cx) * sin(radians(angle))
    return [x, y]

def rotx(cx, cy, x0, y0, angle):
    return cx + (x0 - cx) * cos(angle) + (y0 - cy) * sin(angle)

def roty(cx, cy, x0, y0, angle):
    return cy + (y0 - cy) * cos(angle) - (x0 - cx) * sin(angle)

def scale(dot):
    x = dot[0]
    x = 13 * x + 300
    y = dot[1]
    y = 300 - 13 * y
    return [x, y]

w.create_line([300, 0], [300, 600])
w.create_line([0, 300], [600, 300])

i = 0
dot1 = [10, 10]
dot2 = [11, 11]

while (i <= 360):
    rot1 = rotate_dot([0,0], dot1, i)
    scaled1 = scale(rot1)
    w.create_rectangle(scaled1, [scaled1[0] + 1, scaled1[1] + 1], fill = 'red')

    # rot1x = rotx(0, 0, dot1[0], dot1[1], i)
    # rot1y = roty(0, 0, dot1[0], dot1[1], i)

    # w.create_rectangle(scale([rot1x, rot1y]), scale([rot1x + 1, rot1y + 1]), fill = 'red')

    i += 1

root.mainloop()