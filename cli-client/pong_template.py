#! /usr/bin/env python3
import curses
import random
from time import sleep

def updateBall(stdscr, ball, paddle):
    stdscr.addstr(ball['y'], ball['x'], ' ')
    ball['x'] += ball['dx']
    ball['y'] += ball['dy']

    if (ball['y'] == 0 or ball['y'] == curses.LINES - 1):
        ball['dy'] = -ball['dy']
    if (ball['x'] == curses.COLS - 1):
        ball['dx'] = -ball['dx']
    if (ball['x'] == 0):
        if (ball['y'] in paddle['y']):
            ball['dx'] = -ball['dx']
            ball['score'] += 1
        else:
            ball['inPlay'] = 0
    if (ball['inPlay'] != 0):
        stdscr.addstr(ball['y'], ball['x'], 'O')
    
    return ball


def updatePaddle(stdscr, paddle):
    oldPaddleY = paddle['y'][:]
    
    try:
        move = stdscr.getch()
        if (move == ord('j') and paddle['y'][0] < curses.LINES - 1):
            for i in range(len(paddle['y'])):
                paddle['y'][i] += 1
        elif (move == ord('k') and paddle['y'][2] > 0):
            for i in range(len(paddle['y'])):
                paddle['y'][i] -= 1
        elif (move == ord('q')):
            quit()
        else:
            pass
    except curses.error:
        pass
    
    for i in range(len(oldPaddleY)):
        stdscr.addstr(oldPaddleY[i], paddle['x'], " ")
    
    for i in range(len(paddle['y'])):
        stdscr.addstr(paddle['y'][i], paddle['x'], '#')


def main(stdscr):
    stdscr.clear()
    curses.halfdelay(2)
    curses.curs_set(False) # Turn off the cursor, we won't be needing it.

    ball = {'x':0, 'y':0,                # A dict of attributes about the ball
            'dx':0, 'dy':0,
            'inPlay':0, 'score':0}
    ball['x'] = curses.COLS // 2         # Ball's initial X position.
    ball['y'] = curses.LINES // 2        # Starts at screen center.
    ball['dx'] = random.choice([-1, 1])  # The ball's slope components
    ball['dy'] = random.choice([-1, 1])
    ball['inPlay'] = 1                   # Status of game
    
    paddle = {'x':0, 'y':[0, 0, 0]}      # a dict of attributes about paddle
    paddle['x'] = 0                      # Starting x and y of the paddle
    paddle['y'] = [curses.LINES // 2 + i for i in (1, 0, -1)]
                                         # lowest to highest, visually
    stdscr.addch(ball['y'], ball['x'], 'O')
    updatePaddle(stdscr, paddle)
    stdscr.refresh()

    while ball['inPlay']:
        ball = updateBall(stdscr, ball, paddle)
        updatePaddle(stdscr, paddle)
        stdscr.refresh() 
    
    stdscr.clear()
    stdscr.addstr(curses.LINES // 2, curses.COLS // 2 - 4, "Game Over")
    stdscr.refresh()
    sleep(2)
    stdscr.addstr(curses.LINES // 2 + 1, curses.COLS // 2 - 7,
                  "Your Score Was: " + str(ball['score']))
    stdscr.refresh()
    sleep(1)
    stdscr.addstr(curses.LINES // 2 + 2, curses.COLS // 2 - 20,
                  "Press q to quit or any other key to play again")
    stdscr.refresh()
    sleep(1)   
    curses.cbreak(True) 
    curses.flushinp()
    choice = stdscr.getch()
    if choice == ord('q'):
        quit()
    else:
        return curses.wrapper(main)


if __name__ == "__main__":
    curses.wrapper(main)