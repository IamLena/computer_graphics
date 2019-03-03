from Tkinter import *
from math import *

# operations = []
# operations.append(['move', dx, dy])
# operations.append(['scale', xm, ym, kx, ky])
# operations.append(['rotate', xm, ym, angle])

#initial image
def scale(dot):
    return [canvasWidth/2 + dot[0] * 12, canvasHeight/2 - dot[1] * 12]

def fill_epic():
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
        w.create_polygon(scale(epic[i]), scale(epic[i+1]), scale([0, 0]), fill = 'white')
        f.close()

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
    f.close()

def draw_rect():
    w.create_rectangle(scale([-15, 8]), scale([15, -8]))

def hash_rect(left_up_corner, right_down_corner, step, angle):
    i = left_up_corner[0]
    print(i)
    print(right_down_corner[0])
    while (i < right_down_corner[0]):
    #while (i < 200):
        w.create_line(scale([i, left_up_corner[1]]), scale([i,  right_down_corner[1]]))
        i += 1

        # print(i)
        # print(scale([i, left_up_corner[1]]))
        # print(scale([i, right_down_corner[1]]))
        # w.create_line(scale([i, left_up_corner[1]]), scale([i, right_down_corner[1]]))
        # i += step

    # i = left_up_corner
    # print('hey')
    # print(i[0], right_down_corner[0], i[1], right_down_corner[1])
    # while (i[0] < right_down_corner[0] and i[1] < right_down_corner[1]):
    #     print(i[0], right_down_corner[1], i[1], right_down_corner[0])
    #     w.create_line(scale([i[0], right_down_corner[1]]), scale([i[1], right_down_corner[0]]))
    #     i[0] += step
    #     i[1] -= step

    # height = abs(right_down_corner[0] - left_up_corner[0])
    # width = abs(right_down_corner[1] - left_up_corner[1])
    # step_d = sqrt(step**2 + step**2)
    # diagonal = sqrt(height**2 + width**2)
    # # diagonal = floor(diagonal)
    # width_run = left_up_corner[0]
    # height_run = left_up_corner[1]
    # i = 0
    # while (i < diagonal):
    #     w.create_line(scale([width_run, left_up_corner[1]]), scale([height_run, left_up_corner[0]]))
    #     width_run += step
    #     height_run -= step
    #     i += step_d


def move(event):
    dx_lab.grid(row = 2, column = 11)
    dx_input.grid(row = 2, column = 12)
    dy_lab.grid(row = 2, column = 13)
    dy_input.grid(row = 2, column = 14)
    move_submit.grid(row = 3, column = 11, columnspan = 4)

def scale_handler(event):
    xm_lab.grid(row = 5, column = 11)
    xm_input.grid(row = 5, column = 12)
    ym_lab.grid(row = 5, column = 13)
    ym_input.grid(row = 5, column = 14)

    kx_lab.grid(row = 6, column = 11)
    kx_input.grid(row = 6, column = 12)
    ky_lab.grid(row = 6, column = 13)
    ky_input.grid(row = 6, column = 14)

    scale_submit.grid(row = 7,  column = 11, columnspan = 4)

def rotate(event):
    xm_lab_r.grid(row = 9, column = 11)
    xm_input_r.grid(row = 9, column = 12)
    ym_lab_r.grid(row = 9, column = 13)
    ym_input_r.grid(row = 9, column = 14)

    angle_lab.grid(row = 10, column = 11)
    angle_input.grid(row = 10, column = 12)

    rotate_submit.grid(row = 11, column = 11, columnspan = 4)

def move_image(event):
    dx_lab.grid_forget()
    dx_input.grid_forget()
    dy_lab.grid_forget()
    dy_input.grid_forget()
    move_submit.grid_forget()

def scale_image(event):
    xm_lab.grid_forget()
    xm_input.grid_forget()
    ym_lab.grid_forget()
    ym_input.grid_forget()

    kx_lab.grid_forget()
    kx_input.grid_forget()
    ky_lab.grid_forget()
    ky_input.grid_forget()

    scale_submit.grid_forget()

def rotate_image(event):
    xm_lab_r.grid_forget()
    xm_input_r.grid_forget()
    ym_lab_r.grid_forget()
    ym_input_r.grid_forget()

    angle_lab.grid_forget()
    angle_input.grid_forget()

    rotate_submit.grid_forget()

root = Tk()

#widgets
canvasWidth = 610
canvasHeight = 610
w = Canvas(root, width = canvasWidth, height = canvasHeight)
w.create_rectangle(2, 2, canvasWidth, canvasHeight, width=2, outline = 'green')
w.grid(row = 1, rowspan = 20, column = 1, columnspan = 10, padx=20, pady=20)

#move
move_btn = Button(root, width = 20, height = 1, text = "move", bg = 'green', fg = 'white', font = '30')
move_btn.grid(row = 1, column = 11, columnspan = 4, padx=5, pady=5)

dx_lab = Label(root, text='dx:')
dx_input = Entry(root, width = 5)
dy_lab = Label(root, text='dy:')
dy_input = Entry(root, width = 5)
move_submit = Button(root, text = 'sumbit', bg = 'black', fg = 'white', width = 12)

move_btn.bind("<Button-1>", move)
move_submit.bind('<Button-1>', move_image)

#scale
scale_btn = Button(root, width = 20, height = 1, text = "scale", bg = 'green', fg = 'white', font = '30')
scale_btn.grid(row = 4, column = 11, columnspan = 4, padx=5, pady=5)

xm_lab = Label(root, text='xm:')
xm_input = Entry(root, width = 5)

ym_lab = Label(root, text='ym:')
ym_input = Entry(root, width = 5)

kx_lab = Label(root, text='kx:')
kx_input = Entry(root, width = 5)

ky_lab = Label(root, text='ky:')
ky_input = Entry(root, width = 5)

scale_submit = Button(root, text = 'sumbit', bg = 'black', fg = 'white', width = 12)

scale_btn.bind('<Button-1>', scale_handler)
scale_submit.bind('<Button-1>', scale_image)

#rotate
rotate_btn = Button(root, width = 20, height = 1, text = "rotate", bg = 'green', fg = 'white', font = '30')
rotate_btn.grid(row = 8, column = 11, columnspan = 4, padx=5, pady=5)

xm_lab_r = Label(root, text='xm:')
xm_input_r = Entry(root, width = 5)

ym_lab_r = Label(root, text='ym:')
ym_input_r = Entry(root, width = 5)

angle_lab = Label(root, text='angle:')
angle_input = Entry(root, width = 5)

rotate_btn.bind('<Button-1>', rotate)

rotate_submit = Button(root, text = 'sumbit', bg = 'black', fg = 'white', width = 12)
rotate_submit.bind('<Button-1>', rotate_image)

#back
back = Button(root, width = 20, height = 1, text = "previous", font = '30', bg = 'green', fg = 'white')
back.grid(row = 12, column = 11, columnspan = 4)

#run

draw_rect()
hash_rect([-15, 8], [15, -8], 45, 4)
fill_epic()
draw_epic()

root.mainloop()