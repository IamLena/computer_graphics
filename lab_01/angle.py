from Tkinter import *
from math import sqrt

root = Tk()

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
    w.create_line(M[0][0], M[0][1], M[1][0], M[1][1])
    w.create_line(M[1][0], M[1][1], M[2][0], M[2][1])
    w.create_line(M[2][0], M[2][1], M[3][0], M[3][1])
    w.create_line(M[3][0], M[3][1], M[0][0], M[0][1])

def error(message):
    rect_label.grid_forget()
    inputx.grid_forget()
    inputy.grid_forget()
    add_btn.grid_forget()

    error1.config(text= message)

    error1.grid(row = 2, column = 2, columnspan = 3)
    error2.grid(row = 3, column = 2, columnspan = 3)

def add_dot_rect(event):
    x = inputx.get()
    y = inputy.get()
    inputx.delete(0,END)
    inputy.delete(0,END)
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
            draw_rect(M)
            if (not isrect(M)):
                error('not a rectangle')
                print('not a rectangle')
                

#definition
def add_dot(event):
    x = inputx.get()
    y = inputy.get()
    print(x, y)
    inputx.delete(0,END)
    inputy.delete(0,END)
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
            w.create_oval(x, y, x+1, y + 1, fill='black')
        print(M)

def drawsys():
    w.create_rectangle(5, 5, 600, 600)
    w.create_line(5, 305, 600, 305)#x
    w.create_line(305, 5, 305, 600)#y

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

def createrect(event):
    error1.grid_forget()
    error2.grid_forget()

    rect_label.grid(row = 2, column = 2, columnspan = 3)
    inputx.grid(row = 3, column = 2)
    inputy.grid(row = 3, column = 3)
    add_btn.grid(row = 3, column = 4)
    

#buttons
input_rect = Button(root, text = 'create rectangle', width = 20, height = 1, bg = 'black', fg = 'white')
rect_label = Label(root, text = 'input the coordinats of four dots\n in the correct order:')

inputx = Entry(root, width = 10)
inputy = Entry(root, width = 10)

error1 = Label(root, text = '', fg='red', font='bold')
error2 = Label(root, text = 'try again', font='bold')

add_btn = Button(root, text = 'add a dot', width = 8, height = 1, bg = 'black', fg = 'white')
solve_btn = Button(root, text = 'solve', width = 20, height = 1, bg = 'black', fg = 'white')
delete_btn = Button(root, text = 'clear', width = 8, height = 1, bg = 'black', fg = 'white')
w = Canvas(root, width = 610, height = 610)

#packer
w.grid(row = 1, column = 1, rowspan = 20)

input_rect.grid(row = 1, column = 2, columnspan = 3)

# inputx.grid(row = 2, column = 6)
# inputy.grid(row = 2, column = 7)
# add_btn.grid(row = 2, column = 8)
#solve_btn.grid(row = 4,column = 6, columnspan = 3)
#delete_btn.grid(row = 2, column = 8)


#run
M =[]
drawsys()
input_rect.bind("<Button-1>", createrect)

add_btn.bind("<Button-1>", add_dot_rect)
#left click
#add_btn.bind("<Return>", add_dot)#fires by enter
# solve_btn.bind('<Button-1>', solve)
# solve_btn.bind('<Return>', solve)

root.mainloop()