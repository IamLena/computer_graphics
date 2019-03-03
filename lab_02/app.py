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

def draw_rect(lu_corner, rd_corner):
    w.create_rectangle(scale(lu_corner), scale(rd_corner))

def get_b(x, y, angle):
    b = y - tan(radians(angle)) * x
    return b
def get_y(x_border, angle, b):
    y = tan(radians(angle)) * x_border + b
    return y
def get_x(y_border, angle, b):
    x = (y_border - b) / tan(radians(angle))
    return x

def hash_rect(left_up_corner, right_down_corner, angle, step):
    if (tan(radians(angle)) == 0):
        i = left_up_corner[1]
        while (i > right_down_corner[1]):
            x_from = left_up_corner[0]
            y_from = i
            x_to = right_down_corner[0]
            y_to = i
            w.create_line(scale([x_from, y_from]), scale([x_to, y_to]))
            i -= step
    elif (tan(radians(angle)) > 0):
        i = left_up_corner[0]
        height = left_up_corner[1] -  right_down_corner[1]
        add_width = height / tan(radians(angle))
        while (i < right_down_corner[0] + add_width):
            b = get_b(i, left_up_corner[1], angle)
            y = get_y(left_up_corner[0], angle, b)
            x_from = i
            y_from = left_up_corner[1]
            x_to = left_up_corner[0]
            y_to = y

            if (i > right_down_corner[0]):
                x_from = right_down_corner[0]
                y_from =  get_y(right_down_corner[0], angle, b)
                
            if (y_to < right_down_corner[1]):
                y_to = right_down_corner[1]
                x_to = get_x(y_to, angle, b)

            if (y_to > left_up_corner[1]):
                y_to = right_down_corner[1]
                x_to = get_x(y_to, angle, b)
    else:
        height = left_up_corner[1] -  right_down_corner[1]
        add_width = height / tan(radians(angle))
        i = left_up_corner[0]
        while (i < right_down_corner[0] + add_width):
            b = get_b(i, left_up_corner[1], angle)
            y = get_y(left_up_corner[0], angle, b)

            y_to = y
            x_to = left_up_corner[0]
            x_from = i
            y_from = right_down_corner[1]

            if (i > right_down_corner[0]):
                x_from = right_down_corner[0]
                y_from = get_y(x_from, angle, b)

            if (y_to > left_up_corner[1]):
                y_to = left_up_corner[1]
                x_to = get_x(y_to, angle, b)

    w.create_line(scale([x_from, y_from]), scale([x_to, y_to]))
    i += step

            


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

#draw_rect([-15, 8], [15, -8])
draw_rect([-4, 5], [5, -4])
hash_rect([-4, 5], [5, -4], -60, 1)
# fill_epic()
# draw_epic()

root.mainloop()