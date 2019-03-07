from Tkinter import *
from math import *
root = Tk()

w = Canvas(root, width = 600, height = 600)
w.create_rectangle(2, 2, 600, 600, width=2, outline = 'green', fill = 'white')
w.grid(row = 1, rowspan = 20, column = 1, columnspan = 10, padx=20, pady=20)

def rotate_dot(center, dot, angle):
    x = dot[0]
    y = dot[1]
    x = center[0] + (x - center[0]) * cos(radians(angle)) + (y - center[1]) * sin(radians(angle))
    y = center[1] - (x - center[0]) * sin(radians(angle)) + (y - center[1]) * cos(radians(angle))
    return [x, y]

def scale(dot):
    x = dot[0]
    x = 20 * x + 300
    y = dot[1]
    y = 300 - 20 * y
    return [x, y]

i = 0
dot1 = [10, 10]
dot2 = [11, 11]

while (i < 361):
    dot1 = rotate_dot([0,0], dot1, i)
    dot2 = rotate_dot([0,0], dot2, i)
    print(dot1, dot2)
    w.create_oval(scale(dot1), scale(dot2))
    i += 2

root.mainloop()