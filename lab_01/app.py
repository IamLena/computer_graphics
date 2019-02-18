from Tkinter import *
from math import *

#variables
canvasWidth = 610
canvasHeight = 610

Dots = []
RectVer = []
rectCenter = []
triangleCenter = []
scaleKoef = 5

#functions
def getLine(x1, y1, x2, y2):#get koefs by two dots
    m = (y1 - y2)/(x1 - x2)
    b = y1 - m * x1
    return m, b

def findIntersection(m1, b1, m2, b2):#get the intersection of two lines by their koefs
    x = (b2 - b1)/(m1 - m2)
    y = m1 * x + b1
    return x, y

def drawsys():#draws the system and the frame
    w.create_rectangle(5, 5, canvasWidth - 10, canvasHeight - 10)
    w.create_line(5, canvasHeight/2 + 5, canvasWidth - 10, canvasHeight/2 + 5)#x
    w.create_line(canvasWidth/2 + 5, 5, canvasWidth/2 + 5, canvasHeight - 10)#y

def clearDots():
    global Dots
    global RectVer
    w.delete('all')
    Dots = []
    drawsys()
    draw_rect(RectVer)

def clearRect():
    global Dots
    global RectVer
    w.delete('all')
    RectVer = []
    drawsys()
    draw_dots(Dots)

def clearcanvas(event):
    global Dots
    global RectVer
    w.delete('all')
    Dots = []
    RectVer = []
    drawsys()

def scale(dot):
    global scaleKoef
    x = canvasWidth/2 + 5 + dot[0] * scaleKoef
    y = canvasHeight/2 + 5 - dot[1] * scaleKoef
    return [x, y]

def draw_rect(M):
    #supposed to be in order
    if (len(M) == 2):
        myrect = w.create_polygon(scale(M[0]), scale(M[1]), scale(M[2]), scale(M[3]), outline = 'black', fill = '')
        return myrect

def draw_dots(M):
    for i in M:
        scaled = scale(i)
        w.create_oval(scaled[0], scaled[1], scaled[0]+1, scaled[1] + 1, fill='black')

def errorMes(message):
    print('error!', message)
    error.config(text= message)
    error.grid(row = 10, column = 2, columnspan = 3)

def isrect(M):
    global rect_center
    cx = (M[0][0] + M[1][0] + M[2][0] + M[3][0])/4
    cy = (M[0][1] + M[1][1] + M[2][1] + M[3][1])/4
    rect_center = [cx, cy]

    dd1=sqrt(abs(cx-M[0][0]))+sqrt(abs(cy-M[0][1]))
    dd2=sqrt(abs(cx-M[1][0]))+sqrt(abs(cy-M[1][1]))
    dd3=sqrt(abs(cx-M[2][0]))+sqrt(abs(cy-M[2][1]))
    dd4=sqrt(abs(cx-M[3][0]))+sqrt(abs(cy-M[3][1]))
    return dd1==dd2 and dd1==dd3 and dd1==dd4

def add_dot_rect(event):
    error.grid_forget()
    rect_label.config(text = 'input the coordinats of four dots\n in the correct order:')

    x = inputx_rect.get()
    y = inputy_rect.get()
    inputx_rect.delete(0,END)
    inputy_rect.delete(0,END)
    try:
        x = float(x)
        y = float(y)
    except ValueError:
        errorMes('Input a float value')
    else:
        exist = 0
        for i in range(len(RectVer)):
            if RectVer[i]==[x,y]:
                print('It has been already added')
                exist = 1
                break
        if exist == 0:
            RectVer.append([x,y])
        print(RectVer)
        if (len(RectVer) == 4):
            draw_rect(RectVer)

            rect_label.config(text = 'four dots are provided')

            inputx_rect.grid_forget()
            inputy_rect.grid_forget()
            add_btn_rect.grid_forget()

            if (not isrect(RectVer)):
                errorMes('not a rectangle')

def createrect(event):
    clearRect()
    rect_label.grid(row = 3, column = 2, columnspan = 8)
    x_rect_lab.grid(row = 4, column = 2)
    inputx_rect.grid(row = 4, column = 3, columnspan = 2)
    y_rect_lab.grid(row = 4, column = 5)
    inputy_rect.grid(row = 4, column = 6, columnspan = 2)
    add_btn_rect.grid(row = 4, column = 8, columnspan = 2)

def createdots(event):
    clearDots()
    dots_label.grid(row = 6, column = 2, columnspan = 8)

    x_dot_lab.grid(row = 7, column = 2)
    inputx_dots.grid(row = 7, column = 3, columnspan = 2)
    y_dot_lab.grid(row = 7, column = 5)
    inputy_dots.grid(row = 7, column = 6, columnspan = 2)
    add_btn_dots.grid(row = 7, column = 8, columnspan = 2)

#interface
root = Tk()

input_rect = Button(root, text = 'create new rectangle', width = 20, height = 1, bg = 'black', fg = 'white')
rect_label = Label(root, text = 'input the coordinats of four dots\n in the correct order:')

x_rect_lab = Label(root, text = 'x:')
inputx_rect = Entry(root, width = 10)
y_rect_lab = Label(root, text = 'y:')
inputy_rect = Entry(root, width = 10)
add_btn_rect = Button(root, text = 'add a dot', width = 8, height = 1, bg = 'black', fg = 'white')

input_dots = Button(root, text = 'input new set of dots', width = 20, height = 1, bg = 'black', fg = 'white')
dots_label = Label(root, text = 'input the coordinats of dots:')

x_dot_lab = Label(root, text = 'x:')
inputx_dots = Entry(root, width = 10)
y_dot_lab = Label(root, text = 'y:')
inputy_dots = Entry(root, width = 10)
add_btn_dots = Button(root, text = 'add a dot', width = 8, height = 1, bg = 'black', fg = 'white')

error = Label(root, text = '', fg='red', font='bold')

solve_btn = Button(root, text = 'solve', width = 20, height = 1, bg = 'black', fg = 'white')
delete_btn = Button(root, text = 'clear', width = 8, height = 1, bg = 'black', fg = 'white')

w = Canvas(root, width = canvasWidth, height = canvasHeight)

taskMessage = 'On the plane, a rectangle is defined\n\
    by the coordinates of the vertices \n\
    (in the order of the traversal) and a set of points. \n\
    Find such a triangle with vertices at points of a set\n\
    for which the straight line connecting \n\
    the center of the rectangle and the center \n\
    of gravity of the triangle forms \n\
    the minimum angle with the axis of ordinates.'
task = Label(root, text = taskMessage)

work = Label(root, text = 'Lab #1', font = '14')

#initial packer
w.grid(row = 1, rowspan = 20, column = 1)

work.grid(row = 1, column = 2, columnspan = 8)

input_rect.grid(row = 2, column = 2, columnspan = 8)
input_dots.grid(row = 5, column = 2, columnspan = 8)

solve_btn.grid(row = 8, column = 2, columnspan = 6)
delete_btn.grid(row = 8, column = 8, columnspan = 2)

error.grid(row = 10, column = 2, columnspan = 8)
task.grid(row = 13, rowspan = 7, column = 2, columnspan = 8)

#event handlers
drawsys()

input_rect.bind("<Button-1>", createrect)
input_dots.bind("<Button-1>", createdots)
# delete_btn.bind("<Button-1>", clearcanvas)
# solve_btn.bind('<Button-1>', solve)

add_btn_rect.bind("<Button-1>", add_dot_rect)
# add_btn_dots.bind("<Button-1>", add_dot_dots)

root.mainloop()