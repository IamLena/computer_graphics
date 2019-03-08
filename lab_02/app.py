from Tkinter import *
from math import *

#params for drawing:
#rect - 4 dots
#epic_a
#epic_b
#hash_step
#hash_angle
#scale
#angle

initial_rect = [[-15, 8], [15, 8],[15, -8], [-15, -8]]
hash_angle = -45
hash_step = 2
initial_scale = 12
initial_angle = 0
epic_a = 2
epic_b = 3

canvasWidth = 610
canvasHeight = 610

def scale_dot(dot, scale):
    return [canvasWidth/2 + dot[0] * scale, canvasHeight/2 - dot[1] * scale]


def get_b(x, y, angle):
    b = y - tan(radians(angle)) * x
    return b
def get_y(x_border, angle, b):
    y = tan(radians(angle)) * x_border + b
    return y
def get_x(y_border, angle, b):
    x = (y_border - b) / tan(radians(angle))
    return x
def getLength(dot1, dot2):
    return sqrt((dot1[0] - dot2[0])**2 + (dot1[1] - dot2[1])**2)

def hash_rect(rect, hash_angle, step):
    hash_dots = []
    left_up_corner = rect[0]
    right_down_corner = rect[2]
    if(hash_angle % 90 == 0 and hash_angle // 90 % 2 == 1): #pi * n, n = 2k + 1, vertikal lines
        i = left_up_corner[0]
        while (i < right_down_corner[0]):
            y_from = left_up_corner[1]
            x_from = i
            y_to = right_down_corner[1]
            x_to = i
            hash_dots.append([x_from, y_from, x_to, y_to])
            i += step
    elif (abs(tan(radians(hash_angle)) - 0) < 0.000001 ): # tan == 0, horizontal lines
        i = left_up_corner[1]
        while (i > right_down_corner[1]):
            x_from = left_up_corner[0]
            y_from = i
            x_to = right_down_corner[0]
            y_to = i
            hash_dots.append([x_from, y_from, x_to, y_to])
            i -= step
    elif (tan(radians(hash_angle)) > 0): #tan > 0, m > 0
        i = left_up_corner[0]
        height = left_up_corner[1] -  right_down_corner[1]
        add_width = height / tan(radians(hash_angle))
        while (i < right_down_corner[0] + add_width):
            b = get_b(i, left_up_corner[1], hash_angle)
            x_from = i
            y_from = left_up_corner[1]
            x_to = left_up_corner[0]
            y_to = get_y(x_to, hash_angle, b)

            if (i > right_down_corner[0]):
                x_from = right_down_corner[0]
                y_from =  get_y(right_down_corner[0], hash_angle, b)
                
            if (y_to < right_down_corner[1]):
                y_to = right_down_corner[1]
                x_to = get_x(y_to, hash_angle, b)

            if (y_to > left_up_corner[1]):
                y_to = right_down_corner[1]
                x_to = get_x(y_to, hash_angle, b)
            
            hash_dots.append([x_from, y_from, x_to, y_to])
            i += step
    else:
        height = left_up_corner[1] -  right_down_corner[1]
        add_width = - height / tan(radians(hash_angle))
        i = left_up_corner[0]
        while (i < right_down_corner[0] + add_width):
            b = get_b(i, right_down_corner[1], hash_angle)
            y = get_y(left_up_corner[0], hash_angle, b)

            y_to = y
            x_to = left_up_corner[0]
            x_from = i
            y_from = right_down_corner[1]

            if (i > right_down_corner[0]):
                x_from = right_down_corner[0]
                y_from = get_y(x_from, hash_angle, b)

            if (y_to > left_up_corner[1]):
                y_to = left_up_corner[1]
                x_to = get_x(y_to, hash_angle, b)

            hash_dots.append([x_from, y_from, x_to, y_to])
            i += step
        return hash_dots

initial_hash_lines = hash_rect(initial_rect, hash_angle, hash_step) #[x_from, y_from, x_to, y_to]

operations = []
operations.append([initial_rect, initial_scale, initial_angle, initial_hash_lines])

def clearCanvas():
    w.delete('all')
    w.create_rectangle(2, 2, canvasWidth, canvasHeight, width=2, outline = 'green', fill = 'white')

def rotate_dot(center, dot, angle):
    x0 = dot[0]
    y0 = dot[1]
    cx = center[0]
    cy = center[1]
    x = cx + (x0 - cx) * cos(radians(angle)) + (y0 - cy) * sin(radians(angle))
    y = cy + (y0 - cy) * cos(radians(angle)) - (x0 - cx) * sin(radians(angle))
    return [x, y]

def get_center(M):
    cx = (M[0][0] + M[1][0] + M[2][0] + M[3][0])/4
    cy = (M[0][1] + M[1][1] + M[2][1] + M[3][1])/4
    return [cx, cy]

def get_epic_dots(a, b, center):
    t = 0
    dots =[]
    while (t < 2 * a * pi):
        x = (a + b)* cos(t) - a * cos ((a+b) * t / a) + center[0]
        y = (a + b) * sin(t) - a * sin((a + b) * t / a) + center[1]
        dots.append([x, y])
        t += 0.1
    return dots

def fill_epic(dots, center, scale_koef, angle):
    for i in range(len(dots) - 1):
        dot1 = dots[i]
        dot2 = dots[i+1]
        dot1 = rotate_dot(center, dot1, angle)
        dot2 = rotate_dot(center, dot2, angle)
        w.create_polygon(scale_dot(dot1, scale_koef), scale_dot(dot2, scale_koef), scale_dot(center, scale_koef), fill = 'pink')

def draw_epic(center, scale_koef):
    dots = get_epic_dots(epic_a, epic_b, center)
    operation = operations[-1]
    angle = operation[2]
    fill_epic(dots, center, scale_koef, angle)
    for i in range(len(dots) - 1):
        dot1 = dots[i]
        dot2 = dots[i+1]
        dot1 = rotate_dot(center, dot1, angle)
        dot2 = rotate_dot(center, dot2, angle)
        w.create_line(scale_dot(dot1, scale_koef), scale_dot(dot2, scale_koef))

def draw_rect():
    rect = operations[-1][0]
    scale_koef = operations[-1][1]
    w.create_polygon(scale_dot(rect[0], scale_koef), scale_dot(rect[1], scale_koef), scale_dot(rect[2], scale_koef), scale_dot(rect[3], scale_koef), outline='black', fill = '')
def draw_hash_lines(hash_dots, scale_koef):
    for i in hash_dots:
        from_dot = [i[0], i[1]]
        to_dot = [i[2], i[3]]
        w.create_line(scale_dot(from_dot, scale_koef), scale_dot(to_dot, scale_koef))

def draw():
    clearCanvas()
    operation = operations[-1]
    epic_center = get_center(operation[0])
    scale_koef = operation[1]
    hash_lines = operation[3]
    draw_rect()
    draw_hash_lines(hash_lines, scale_koef)
    draw_epic(epic_center, scale_koef)

def draw_initial(event):
    error_lab.config(text = '')
    operations.append([initial_rect, initial_scale, initial_angle, initial_hash_lines])
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

def move_nodraw(dx, dy):
    operation = operations[-1]

    dot1 = operation[0][0][:]
    dot2 = operation[0][1][:]
    dot3 = operation[0][2][:]
    dot4 = operation[0][3][:]
    hash_lines = operation[3][:]
    print(hash_lines)
    dot1[0] += dx
    dot1[1] += dy
    dot2[0] += dx
    dot2[1] += dy
    dot3[0] += dx
    dot3[1] += dy
    dot4[0] += dx
    dot4[1] += dy

    for i in hash_lines:
            i[0] += dx
            i[1] += dy
            i[2] += dx
            i[3] += dy
    rect = [dot1, dot2, dot3, dot4]
    operations.append([rect, operation[1], operation[2], hash_lines])

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
        move_nodraw(dx, dy)
        operation_list.insert(END, 'move, x:{:.2f}, y:{:.2f}'.format(dx, dy))
        draw()
    except:
        error_lab.config(text = 'input error')
    dx_lab.grid_forget()
    dx_input.grid_forget()
    dy_lab.grid_forget()
    dy_input.grid_forget()
    move_submit.grid_forget()

def scale_image(event):
    error_lab.config(text = '')

    xm = xm_input.get()
    ym = ym_input.get()
    xm_input.delete(0,END)
    ym_input.delete(0, END)
    k = kx_input.get()
    kx_input.delete(0, END)
    
    try:
        xm = float(xm)
        ym = float(ym)
        k = float(k)

        operation = operations[-1]
        center = get_center(operation[0])
        shift_x = xm - center[0]
        shift_y = ym - center[1]
        move_nodraw(shift_x, shift_y)

        operation = operations[-1]
        rect = operation[0]
        hash_lines = operation[3]
        angle = operation[2]
        cur_scale = operation[1]
        cur_scale *= k
        operations.pop()
        operation_list.insert(END, 'scale, x{:.2f}'.format(k))
        operations.append([rect, cur_scale, angle, hash_lines])
        draw()
    except:
        error_lab.config(text = 'invalid input')

    xm_lab.grid_forget()
    xm_input.grid_forget()
    ym_lab.grid_forget()
    ym_input.grid_forget()
    kx_lab.grid_forget()
    kx_input.grid_forget()
    scale_submit.grid_forget()

def rotate_image(event):
    error_lab.config(text = '')

    xm = xm_input_r.get()
    xm_input_r.delete(0, END)
    ym = ym_input_r.get()
    ym_input_r.delete(0, END)
    angle = angle_input.get()
    angle_input.delete(0, END)

    try:
        xm = float(xm)
        ym = float(ym)
        angle = float(angle)

        operation = operations[-1]
        rect = operation[0]
        hash_lines = operation[3][:]
        angle_prev = operation[2]
        new_angle = angle + angle_prev

        new_rect = []
        for i in rect:
            new_rect.append(rotate_dot([xm, ym], i, angle))
        for i in hash_lines:
            rot1 = rotate_dot([xm, ym], [i[0], i[1]], angle)
            rot2 = rotate_dot([xm, ym], [i[2], i[3]], angle)
            i[0] = rot1[0]
            i[1] = rot1[1]
            i[2] = rot2[0]
            i[3] = rot2[1]

        operation_list.insert(END, 'rotate, {:.2f}'.format(angle))
        operations.append([new_rect, operation[1], new_angle, hash_lines])
        draw()
    except:
        error_lab.config(text = 'invalid input')

    xm_lab_r.grid_forget()
    xm_input_r.grid_forget()
    ym_lab_r.grid_forget()
    ym_input_r.grid_forget()

    angle_lab.grid_forget()
    angle_input.grid_forget()

    rotate_submit.grid_forget()

def draw_prev(event):
    error_lab.config(text = '')
    if (len(operations) > 1):
        operations.pop()
        operation_list.delete(len(operations) - 2, END)
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

kx_lab = Label(root, text='k:')
kx_input = Entry(root, width = 5)

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

#operation list
operation_list = Listbox(root, width = 25, height = 15)
operation_list.grid(row = 15, column = 11, columnspan = 4)


#run
draw_initial(1)

root.mainloop()