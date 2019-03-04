from Tkinter import *
from math import *

#params for drawing:
#rect - 4 dots
#epic - center
#scale
#angle

operations = []
rect = [[-15, 8], [15, 8],[15, -8], [-15, -8]]
operations.append([rect, [0,0], 12, 0])

canvasWidth = 610
canvasHeight = 610

lu_rect = [-15, 8]
rd_rect = [15, -8]
ru_rect = [15, 8]
ld_rect = [-15, -8]

hash_angle = -45
hash_step = 2
initial_scaling = 12

cur_lu = [-15, 8]
cur_rd = [15, -8]
cur_ru = [15, 8]
cur_ld = [-15, -8]

epic_center = [0,0]

def get_epic_dots(a, b, center):
    t = 0
    dots =[]
    while (t < 2 * a * pi):
        x = (a + b)* cos(t) - a * cos ((a+b) * t / a) + center[0]
        y = (a + b) * sin(t) - a * sin((a + b) * t / a) + center[1]
        dots.append([x, y])
        t += 0.2
    return dots

def clearCanvas():
    w.delete('all')
    w.create_rectangle(2, 2, canvasWidth, canvasHeight, width=2, outline = 'green', fill = 'white')

#initial image
def scale(dot):
    return [canvasWidth/2 + dot[0] * initial_scaling, canvasHeight/2 - dot[1] * initial_scaling]

def fill_epic(dots, center):
    for i in range(len(dots) - 1):
        w.create_line(scale(dots[i]), scale(dots[i+1]))
        w.create_polygon(scale(dots[i]), scale(dots[i+1]), scale(center), fill = 'white')

def draw_epic(center):
    dots = get_epic_dots(2, 3, center)
    fill_epic(dots, center)
    for i in range(len(dots) - 1):
        w.create_line(scale(dots[i]), scale(dots[i+1]))

def draw_rect(lu_corner, ru_corner, rd_corner, ld_corner):
    w.create_polygon(scale(lu_corner), scale(ru_corner), scale(rd_corner), scale(ld_corner), outline='black', fill = '')
    #w.create_rectangle(scale(lu_corner), scale(rd_corner))

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
    if(angle % 90 == 0 and angle // 90 % 2 == 1):
        i = left_up_corner[0]
        while (i < right_down_corner[0]):
            y_from = left_up_corner[1]
            x_from = i
            y_to = right_down_corner[1]
            x_to = i
            w.create_line(scale([x_from, y_from]), scale([x_to, y_to]))
            i += step
    elif (abs(tan(radians(angle)) - 0) < 0.000001 ):
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
            
            w.create_line(scale([x_from, y_from]), scale([x_to, y_to]))
            i += step
    else:
        height = left_up_corner[1] -  right_down_corner[1]
        add_width = - height / tan(radians(angle))
        i = left_up_corner[0]
        while (i < right_down_corner[0] + add_width):
            b = get_b(i, right_down_corner[1], angle)
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
            i+= step

def draw():
    clearCanvas()
    operation = operations[-1]
    draw_rect(operation[0][0], operation[0][1], operation[0][2], operation[0][3])
    hash_rect(operation[0][0], operation[0][2], -45, 2)
    draw_epic(operation[1])

def draw_initial(event):
    error_lab.config(text = '')
    # clearCanvas()
    # draw_rect(lu_rect, ru_rect, rd_rect, ld_rect)
    # hash_rect(lu_rect, rd_rect, hash_angle, hash_step)
    # draw_epic([0,0])
    # epic_center = [0,0]
    draw()

def move(event):
    error_lab.config(text = '')
    dx_lab.grid(row = 2, column = 11)
    dx_input.grid(row = 2, column = 12)
    dy_lab.grid(row = 2, column = 13)
    dy_input.grid(row = 2, column = 14)
    move_submit.grid(row = 3, column = 11, columnspan = 4)

def scale_handler(event):
    error_lab.config(text = '')
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
    error_lab.config(text = '')
    xm_lab_r.grid(row = 9, column = 11)
    xm_input_r.grid(row = 9, column = 12)
    ym_lab_r.grid(row = 9, column = 13)
    ym_input_r.grid(row = 9, column = 14)

    angle_lab.grid(row = 10, column = 11)
    angle_input.grid(row = 10, column = 12)

    rotate_submit.grid(row = 11, column = 11, columnspan = 4)

def move_image(event):
    error_lab.config(text = '')
    dx = dx_input.get()
    dy = dy_input.get()
    dx_input.delete(0,END)
    dy_input.delete(0, END)
    
    try:
        dx = float(dx)
        dy = float(dy)
        clearCanvas()
        cur_lu[0] += dx
        cur_lu[1] += dy
        cur_rd[0] += dx
        cur_rd[1] += dy
        cur_ru[0] += dx
        cur_ru[1] += dy
        cur_ld[0] += dx
        cur_ld[1] += dy

        epic_center[0] += dx
        epic_center[1] += dy
        dot1 = [cur_lu[0], cur_lu[1]]
        dot2 = [cur_rd[0], cur_rd[1]]
        dot3 = [cur_ru[0], cur_ru[1]]
        dot4 = [cur_ld[0], cur_ld[1]]
        # draw_rect(dot1, dot3, dot2, dot4)
        # hash_rect(dot1, dot2, hash_angle, hash_step)
        # draw_epic(epic_center)

        operations.append([[dot1, dot3, dot2, dot4], epic_center, 12, 0]) #error! rewriting epic_center
        draw()
    except:
        print('input error')
        error_lab.config(text = 'input error')
    dx_lab.grid_forget()
    dx_input.grid_forget()
    dy_lab.grid_forget()
    dy_input.grid_forget()
    move_submit.grid_forget()
    print(operations)

def scale_image(event):
    error_lab.config(text = '')

    xm = xm_input.get()
    ym = ym_input.get()
    xm_input.delete(0,END)
    ym_input.delete(0, END)
    kx = kx_input.get()
    kx_input.delete(0, END)

    try:
        xm = float(xm)
        ym = float(ym)
        kx = float(kx)
        clearCanvas()



    except:
        error_lab.config(text = 'invalid input')

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
    error_lab.config(text = '')
    xm_lab_r.grid_forget()
    xm_input_r.grid_forget()
    ym_lab_r.grid_forget()
    ym_input_r.grid_forget()

    angle_lab.grid_forget()
    angle_input.grid_forget()

    rotate_submit.grid_forget()


def draw_prev(event):
    if (len(operations) > 1):
        operations.pop()
        draw()

root = Tk()

#widgets
w = Canvas(root, width = canvasWidth, height = canvasHeight)
w.create_rectangle(2, 2, canvasWidth, canvasHeight, width=2, outline = 'green', fill = 'white')
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
back.bind('<Button-1>', draw_prev)

#initial
initial_btn = Button(root, width = 20, height = 1, text = "initial image", bg = 'green', fg = 'white', font = '30')
initial_btn.grid(row = 13, column = 11, columnspan = 4)
initial_btn.bind('<Button-1>', draw_initial)

#error
error_lab = Label(root, font = '12', text = '', fg = 'blue')
error_lab.grid(row = 14, column = 11, columnspan = 4)

#run

draw_initial(1)
# draw_rect([-15, 8], [15, -8])
# hash_rect([-15, 8], [15, -8], -45, 2)
# draw_epic([0,0])


root.mainloop()