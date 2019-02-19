from Tkinter import *
from math import *

#variables
canvasWidth = 610
canvasHeight = 610

Dots = []
RectVer = []
rectCenter = []
triangleCenter = []
scaleKoef = 1

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
    w.create_rectangle(5, 5, canvasWidth - 5, canvasHeight - 5, width=3)
    w.create_line(5, canvasHeight/2, canvasWidth - 5, canvasHeight/2)#x
    w.create_line(canvasWidth/2, 5, canvasWidth/2, canvasHeight - 5)#y

def clearDots():#clear set of dots, redraw the rectangle
    error.config(text = '')

    global Dots
    global RectVer
    w.delete('all')
    Dots = []
    dotslist.delete(0, END)

    drawsys()
    draw_rect(RectVer)

def clearRect():#clear the rectangle, redraw the dots
    error.config(text = '')

    global Dots
    global RectVer
    w.delete('all')
    RectVer = []
    rectList.delete(0, END)
    drawsys()
    draw_dots(Dots)

def clearcanvas(event):#clear everything, dots sets = to zero
    error.config(text = '')

    global Dots
    global RectVer
    w.delete('all')
    dotslist.delete(0, END)
    Dots = []
    RectVer = []
    drawsys()

def getScaleKoef(RectVer, Dots):
    maxx = 0
    maxy = 0
    for i in RectVer:
        if (abs(i[0]) > maxx):
            maxx = abs(i[0])
    for i in Dots:
        if (abs(i[0]) > maxx):
            maxx = abs(i[0])

    for i in RectVer:
        if (abs(i[1]) > maxy):
            maxy = abs(i[1])
    for i in Dots:
        if (abs(i[1]) > maxy):
            maxy = abs(i[1])

    if (maxx == 0 and maxy != 0):
        return ((canvasHeight - 10)/2 - 10)/maxy
    if (maxy == 0 and maxx != 0):
        return ((canvasWidth - 10)/2 - 10)/maxx
    if (maxx == 0 and maxy == 0):
        return 5
    ky = ((canvasHeight - 10)/2 - 10)/maxy
    kx = ((canvasWidth - 10)/2 - 10)/maxx

    if (ky > kx):
        return kx
    else:
        return ky

def scale(dot, koef):
    global RectVer
    global Dots

    x = canvasWidth/2 + dot[0] * koef
    y = canvasHeight/2 - dot[1] * koef
    return [x, y]

def draw_rect(M):#draws the rectangle
    #supposed to be in order
    global scaleKoef
    global Dots
    if (len(M) == 4):
        newScaleKoef = getScaleKoef(M, Dots)
        if (newScaleKoef != scaleKoef):
            scaleKoef = newScaleKoef
            w.delete('all')
            drawsys()
            for i in Dots:
                scaled = scale(i, newScaleKoef)
                w.create_oval(scaled[0], scaled[1], scaled[0]+1, scaled[1] + 1, fill='black')
                w.create_text(scaled[0] + 7, scaled[1], text = '{0}'.format(i + 1))


        w.create_polygon(scale(M[0], newScaleKoef), scale(M[1], newScaleKoef), scale(M[2], newScaleKoef), scale(M[3], newScaleKoef), outline = 'black', fill = '')

def draw_dots(M):#draws all the dots
    global scaleKoef
    global RectVer
    newScaleKoef = getScaleKoef(RectVer, Dots)
    if (newScaleKoef != scaleKoef):
        scaleKoef = newScaleKoef
        w.delete('all')
        drawsys()
        if (len(RectVer) == 4):
            w.create_polygon(scale(RectVer[0], newScaleKoef), scale(RectVer[1], newScaleKoef), scale(RectVer[2], newScaleKoef), scale(RectVer[3], newScaleKoef), outline = 'black', fill = '')

    for i in range (len(M)):
        scaled = scale(M[i], newScaleKoef)
        w.create_oval(scaled[0], scaled[1], scaled[0]+1, scaled[1] + 1, fill='black')
        w.create_text(scaled[0] + 7, scaled[1], text = '{0}'.format(i + 1))

def errorMes(message):#shows the error messages
    print('error!', message)
    error.config(text= message)

def isrect(M):#return the boolean if the polygon is a rectangle, gets the center coords
    global rect_center
    cx = (M[0][0] + M[1][0] + M[2][0] + M[3][0])/4
    cy = (M[0][1] + M[1][1] + M[2][1] + M[3][1])/4
    rect_center = [cx, cy]

    dd1=sqrt(abs(cx-M[0][0]))+sqrt(abs(cy-M[0][1]))
    dd2=sqrt(abs(cx-M[1][0]))+sqrt(abs(cy-M[1][1]))
    dd3=sqrt(abs(cx-M[2][0]))+sqrt(abs(cy-M[2][1]))
    dd4=sqrt(abs(cx-M[3][0]))+sqrt(abs(cy-M[3][1]))
    return dd1==dd2 and dd1==dd3 and dd1==dd4


def getLength(dot1, dot2):
    return sqrt((dot1[0]-dot2[0])**2 + (dot1[1]-dot2[1])**2)

def isTryangle(dot1, dot2, dot3):
    len1 = getLength(dot1, dot2)
    len2 = getLength(dot2, dot3)
    len3 = getLength(dot3, dot1)
    return len1 + len2 > len3 and len2 + len3 > len1 and len3 + len1 > len2
    

def add_dot_rect(event):#add the dot to rectVertexs, if 4 of them - do actions
    error.config(text = '')
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
            strDot = '{0}, {1}'.format(x, y)
            rectList.insert(END, strDot)
        print(RectVer)
        if (len(RectVer) == 4):
            draw_rect(RectVer)
            
            x_rect_lab.grid_forget()
            inputx_rect.grid_forget()
            y_rect_lab.grid_forget()
            inputy_rect.grid_forget()
            add_btn_rect.grid_forget()
            rect_label.config(text = 'four dots are provided')

            if (not isrect(RectVer)):
                errorMes('not a rectangle')

            print(rect_center)

def add_dot_dots(event):#add the dot of the set
    error.config(text = '')
    rect_label.config(text = 'input the coordinats of the dot:')

    x = inputx_dots.get()
    y = inputy_dots.get()
    inputx_dots.delete(0,END)
    inputy_dots.delete(0,END)
    try:
        x = float(x)
        y = float(y)
    except ValueError:
        errorMes('Input a float value')
    else:
        exist = 0
        for i in range(len(Dots)):
            if Dots[i]==[x,y]:
                print('It has been already added')
                exist = 1
                break
        if exist == 0:
            Dots.append([x,y])
            dotsrt = '{2}) {0}, {1}'.format(x, y, len(Dots))
            dotslist.insert(END, dotsrt)
        print(Dots)
        draw_dots(Dots)

def solve(event):#solves the task
    global RectVer
    global Dots
    global rect_center
    global scaleKoef

    if (len(RectVer) != 4 or not len(rect_center) == 2):
        errorMes('input the rectangle first')
    elif (len(Dots) < 3):
        errorMes('not enough dots for a triangle')
    else:
        maxm = 0
        xres = 0
        yres = 0
        triangle = []
        for i in range(len(Dots)):
            dot1 = Dots[i]
            for j in range(i+1, len(Dots)):
                dot2 = Dots[j]
                for k in range(j+1, len(Dots)):
                    dot3 = Dots[k]
                    print('looking at this triangle:')
                    print(dot1,dot2,dot3)
                    if (isTryangle(dot1,dot2,dot3)):
                        if (dot1[0] == ((dot2[0] + dot3[0]) / 2)):
                            xi = dot1[0]
                            m2, b2 = getLine(dot2[0], dot2[1], (dot1[0] + dot3[0]) / 2, (dot1[1] + dot3[1]) / 2)
                            yi = m2 * xi + b2
                            print('one')
                        elif (dot2[0] == ((dot1[0] + dot3[0]) / 2)):
                            xi = dot2[0]
                            m1, b1 = getLine(dot1[0], dot1[1], (dot2[0] + dot3[0]) / 2, (dot2[1] + dot3[1]) / 2)
                            yi = m1 * xi + b1
                            print('two')
                        else:
                            m1, b1 = getLine(dot1[0], dot1[1], (dot2[0] + dot3[0]) / 2, (dot2[1] + dot3[1]) / 2)
                            m2, b2 = getLine(dot2[0], dot2[1], (dot1[0] + dot3[0]) / 2, (dot1[1] + dot3[1]) / 2)
                            xi, yi = findIntersection(m1, b1, m2, b2)
                            print('three')
                        
                        print(xi, yi)

                        if (xi == rect_center[0]):
                            xres = xi
                            yres = yi
                            triangle = [dot1, dot2, dot3]
                            scaled1 = scale([xres, yres], scaleKoef)
                            scaled2 = scale(rect_center, scaleKoef)
                            print(scaled2)
                            scaledTri = [scale(triangle[0], scaleKoef), scale(triangle[1], scaleKoef), scale(triangle[2], scaleKoef)]
                            w.create_polygon(scaledTri, outline = 'black', fill = '')
                            w.create_line(scaled1[0], scaled1[1], scaled2[0], scaled2[1], fill = 'blue')
                            for i in triangle:
                                w.create_text(scale(i, scaleKoef)[0]+ 7, scale(i, scaleKoef)[1] - 7, text = '{:.3f},{:.3f}'.format(i[0], i[1]), fill = 'blue')
                            return

                        mres, bres = getLine(xi, yi, rect_center[0], rect_center[1])
                        
                        if (maxm < abs(mres)):
                            maxm = abs(mres)
                            xres = xi
                            yres = yi
                            triangle = [dot1, dot2, dot3]
        if (len(triangle)==0):
            errorMes('There is no such triangle')
        else:
            scaled1 = scale([xres, yres], scaleKoef)
            scaled2 = scale(rect_center, scaleKoef)
            print(scaled2)
            scaledTri = [scale(triangle[0], scaleKoef), scale(triangle[1], scaleKoef), scale(triangle[2], scaleKoef)]
            w.create_polygon(scaledTri, outline = 'black', fill = '')
            w.create_line(scaled1[0], scaled1[1], scaled2[0], scaled2[1])
            for i in triangle:
                w.create_text(scale(i, scaleKoef)[0]+ 7, scale(i, scaleKoef)[1] - 7, text = '{:.3f},{:.3f}'.format(i[0], i[1]), fill = 'blue')

def createrect(event):#show the inputs, clears the rect
    clearRect()

    rect_label.grid(row = 3, column = 2, columnspan = 8)
    x_rect_lab.grid(row = 4, column = 2)
    inputx_rect.grid(row = 4, column = 3, columnspan = 2)
    y_rect_lab.grid(row = 4, column = 5)
    inputy_rect.grid(row = 4, column = 6, columnspan = 2)
    add_btn_rect.grid(row = 4, column = 8, columnspan = 2)
    rectList.grid(row = 3, rowspan = 2, column = 11)

def createdots(event):#shows the inputs, clear the set of dots
    clearDots()
    dots_label.grid(row = 6, column = 2, columnspan = 8)

    x_dot_lab.grid(row = 7, column = 2)
    inputx_dots.grid(row = 7, column = 3, columnspan = 2)
    y_dot_lab.grid(row = 7, column = 5)
    inputy_dots.grid(row = 7, column = 6, columnspan = 2)
    add_btn_dots.grid(row = 7, column = 8, columnspan = 2)
    dotslist.grid(row = 6, rowspan = 2, column = 11)

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

rectList = Listbox(root)
dotslist = Listbox(root)

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

delete_btn.bind("<Button-1>", clearcanvas)
solve_btn.bind('<Button-1>', solve)

add_btn_rect.bind("<Button-1>", add_dot_rect)
add_btn_dots.bind("<Button-1>", add_dot_dots)

input_rect.bind("<Return>", createrect)
input_dots.bind("<Return>", createdots)

delete_btn.bind("<Return>", clearcanvas)
solve_btn.bind('<Return>', solve)

add_btn_rect.bind("<Return>", add_dot_rect)
add_btn_dots.bind("<Return>", add_dot_dots)

root.mainloop()