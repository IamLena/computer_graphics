from Tkinter import *
from math import *

#initial image

def scale(dot):
    return [canvasWidth/2 + dot[0] * 12, canvasHeight/2 - dot[1] * 12]

def draw_epic():
    f = open("epicycloid.csv", "r")
    fileCtx = (f.read())
    lines = fileCtx.split('\n')
    epic = []
    for i in lines:
        dot = i.split(',')
        try:
            x = float(dot[0])
            y = float(dot[1])
        except:
            print('invalid file data')
            return
        else:
            epic.append([x, y])
    #print(epic)
    for i in range(len(epic) - 1):
        w.create_line(scale(epic[i]), scale(epic[i+1]))

def draw_rect():
    w.create_rectangle(scale([-15, 8]), scale([15, -8]))


root = Tk()

#widgets
canvasWidth = 610
canvasHeight = 610
w = Canvas(root, width = canvasWidth, height = canvasHeight)
w.create_rectangle(2, 2, canvasWidth, canvasHeight, width=2)
w.grid(row = 1, rowspan = 20, column = 1, columnspan = 10, padx=20, pady=20)

rotate_btn = Button(root, width = 10, height = 1, text = "rotate", bg = 'black', fg = 'white')
rotate_btn.grid(row = 1, column = 11, padx=20, pady=20)

scale_btn = Button(root, width = 10, height = 1, text = "scale", bg = 'black', fg = 'white')
scale_btn.grid(row = 2, column = 11, padx=20, pady=20)

move_btn = Button(root, width = 10, height = 1, text = "move", bg = 'black', fg = 'white')
move_btn.grid(row = 3, column = 11, padx=20, pady=20)

#run
draw_epic()
draw_rect()

root.mainloop()