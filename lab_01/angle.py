from Tkinter import *
from math import sqrt

root = Tk()

#total
def drawsys():
    w.create_rectangle(5, 5, 600, 600)
    w.create_line(5, 305, 600, 305)#x
    w.create_line(305, 5, 305, 600)#y

def error(message):
    rect_label.grid_forget()
    inputx_rect.grid_forget()
    inputy_rect.grid_forget()
    add_btn_rect.grid_forget()

    error1.config(text= message)

    error1.grid(row = 2, column = 2, columnspan = 3)
    error2.grid(row = 3, column = 2, columnspan = 3)

def clearcanvas(event):
    w.delete('all')
    drawsys()

#rectangle
def isrect(M):
    cx = (M[0][0] + M[1][0] + M[2][0] + M[3][0])/4
    cy = (M[0][1] + M[1][1] + M[2][1] + M[3][1])/4
    print(cx, cy)

    dd1=sqrt(abs(cx-M[0][0]))+sqrt(abs(cy-M[0][1]))
    dd2=sqrt(abs(cx-M[1][0]))+sqrt(abs(cy-M[1][1]))
    dd3=sqrt(abs(cx-M[2][0]))+sqrt(abs(cy-M[2][1]))
    dd4=sqrt(abs(cx-M[3][0]))+sqrt(abs(cy-M[3][1]))
    return dd1==dd2 and dd1==dd3 and dd1==dd4

def draw_rect(M):
    # w.create_line(M[0][0], M[0][1], M[1][0], M[1][1])
    # w.create_line(M[1][0], M[1][1], M[2][0], M[2][1])
    # w.create_line(M[2][0], M[2][1], M[3][0], M[3][1])
    # w.create_line(M[3][0], M[3][1], M[0][0], M[0][1])

    myrect = w.create_polygon(M, outline = 'black', fill = '')
    return myrect

def add_dot_rect(event):
    x = inputx_rect.get()
    y = inputy_rect.get()
    inputx_rect.delete(0,END)
    inputy_rect.delete(0,END)
    try:
        x = float(x)
        y = float(y)
    except ValueError:
        print('That is not a float')
    else:
        exist = 0
        for i in range(len(M)):
            if M[i]==[x,y]:
                print('It has been already added')
                exist = 1
        if exist == 0:
            M.append([x,y])
            #w.create_line(x, y, x+1, y, fill='black')
            w.create_oval(x, y, x+1, y + 1, fill='black')
        print(M)
        if (len(M) == 4):
            myrect = draw_rect(M)
            rect_label.grid_forget()
            inputx_rect.grid_forget()
            inputy_rect.grid_forget()
            add_btn_rect.grid_forget()

            if (not isrect(M)):
                error('not a rectangle')
                print('not a rectangle')     

def createrect(event):
    #w.delete(myrect) - not working
    drawsys()

    input_dots.grid_forget()
    delete_btn.grid_forget()

    error1.grid_forget()
    error2.grid_forget()

    rect_label.grid(row = 2, column = 2, columnspan = 3)
    inputx_rect.grid(row = 3, column = 2)
    inputy_rect.grid(row = 3, column = 3)
    add_btn_rect.grid(row = 3, column = 4)
    input_dots.grid(row = 4, column = 2, columnspan = 3)

    if (not (dots_label.grid_info() == {})):
        dots_label.grid_forget()
        inputx_dots.grid_forget()
        inputy_dots.grid_forget()
        add_btn_dots.grid_forget()
        dots_label.grid(row=5, column=2, columnspan = 3)
        inputx_dots.grid(row = 6, column = 2)
        inputy_dots.grid(row = 6, column = 3)
        add_btn_dots.grid(row = 6, column = 4)
        delete_btn.grid(row = 7, column = 2, columnspan = 3)
    else:
        delete_btn.grid(row = 5, column = 2, columnspan = 3)

#dots
def add_dot_dots(event):
    x = inputx_dots.get()
    y = inputy_dots.get()
    print(x, y)
    inputx_dots.delete(0,END)
    inputy_dots.delete(0,END)
    try:
        x = float(x)
        y = float(y)
    except ValueError:
        print('That is not a float')
    else:
        exist = 0
        for i in range(len(M)):
            if Dots[i]==[x,y]:
                print('It has been already added')
                exist = 1
        if exist == 0:
            Dots.append([x,y])
            w.create_oval(x, y, x+1, y + 1, fill='black')
        print(Dots)

def inputdots(event):
    row = input_dots.grid_info()['row']
    delete_btn.grid_forget()
    dots_label.grid(row = row + 1, column = 2, columnspan = 3)
    inputx_dots.grid(row = row + 2, column = 2)
    inputy_dots.grid(row = row + 2, column = 3)
    add_btn_dots.grid(row = row + 2, column = 4)
    delete_btn.grid(row = row + 3, column = 2, columnspan = 3)

def solve(event):
    drawsys()
    print('solving')
    if len(M)<3:
        print('not enough dots')
    else:
        for i in range(len(M)):
            dot1 = M[i]
            for j in range(i+1, len(M)):
                dot2 = M[j]
                for k in range(j+1, len(M)):
                    dot3 = M[k]
                    print('looking at this triangle:')
                    print(dot1,dot2,dot3)

#buttons
input_rect = Button(root, text = 'create new rectangle', width = 20, height = 1, bg = 'black', fg = 'white')
rect_label = Label(root, text = 'input the coordinats of four dots\n in the correct order:')

inputx_rect = Entry(root, width = 10)
inputy_rect = Entry(root, width = 10)
add_btn_rect = Button(root, text = 'add a dot', width = 8, height = 1, bg = 'black', fg = 'white')

input_dots = Button(root, text = 'input dots', width = 20, height = 1, bg = 'black', fg = 'white')
dots_label = Label(root, text = 'input the coordinats of dots:')

inputx_dots = Entry(root, width = 10)
inputy_dots = Entry(root, width = 10)
add_btn_dots = Button(root, text = 'add a dot', width = 8, height = 1, bg = 'black', fg = 'white')

error1 = Label(root, text = '', fg='red', font='bold')
error2 = Label(root, text = 'try again', font='bold')

solve_btn = Button(root, text = 'solve', width = 20, height = 1, bg = 'black', fg = 'white')
delete_btn = Button(root, text = 'clear', width = 8, height = 1, bg = 'black', fg = 'white')

w = Canvas(root, width = 610, height = 610)

#packer
w.grid(row = 1, column = 1, rowspan = 20)
input_rect.grid(row = 1, column = 2, columnspan = 3)
input_dots.grid(row = 2, column = 2, columnspan = 3)
delete_btn.grid(row = 3, column = 2, columnspan = 3)

#run
M =[]
Dots = []
drawsys()
input_rect.bind("<Button-1>", createrect)
input_dots.bind("<Button-1>", inputdots)

add_btn_rect.bind("<Button-1>", add_dot_rect)
add_btn_dots.bind("<Button-1>", add_dot_dots)
delete_btn.bind("<Button-1>", clearcanvas)

#left click
#add_btn.bind("<Return>", add_dot)#fires by enter
# solve_btn.bind('<Button-1>', solve)
# solve_btn.bind('<Return>', solve)

root.mainloop()