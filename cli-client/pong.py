import curses

def draw_paddle(stdscr, paddle):
	for i in range(len(paddle['y'])):
		stdscr.addstr(paddle['y'][i], paddle['x'], '|')

def update_left_paddle(stdscr, paddle, move):
	old_y = paddle['y'][:]
	if (move == ord('w')):
		for i in range(len(paddle['y'])):
			paddle['y'][i] -= 1
	elif (move == ord('s')):
		for i in range(len(paddle['y'])):
			paddle['y'][i] += 1
	for i in range(len(old_y)):
		stdscr.addstr(old_y[i], paddle['x'], " ")
	draw_paddle(stdscr, paddle)

def update_right_paddle(stdscr, paddle, move):
	old_y = paddle['y'][:]
	if (move == curses.KEY_UP):
		for i in range(len(paddle['y'])):
			paddle['y'][i] -= 1
	elif (move == curses.KEY_DOWN):
		for i in range(len(paddle['y'])):
			paddle['y'][i] += 1
	for i in range(len(old_y)):
		stdscr.addstr(old_y[i], paddle['x'], " ")
	draw_paddle(stdscr, paddle)

def main(stdscr):
	curses.halfdelay(1) # wait for 1/10 of a second for input, if no input continue
	curses.curs_set(False) # Turn off the cursor, we won't be needing it.
	stdscr.keypad(True) # enable keypad mode, which allows for special keys to be read, such as the arrow keys

	left_paddle = {
		'x': 5,
		'y': [
			curses.LINES // 2 - 2,
			curses.LINES // 2 - 1,
			curses.LINES // 2,
			curses.LINES // 2 + 1,
			curses.LINES // 2 + 2
		]
	}

	right_paddle = {
		'x': curses.COLS - 5,
		'y': [
			curses.LINES // 2 - 2,
			curses.LINES // 2 - 1,
			curses.LINES // 2,
			curses.LINES // 2 + 1,
			curses.LINES // 2 + 2
		]
	}

	while True:
		key = stdscr.getch()
		if key == curses.KEY_EXIT or key == ord('q'):
			break
		update_left_paddle(stdscr, left_paddle, key)
		update_right_paddle(stdscr, right_paddle, key)
		stdscr.refresh()

if __name__ == "__main__":
	curses.wrapper(main) # initialize curses environment, which configures terminal, then calls main and passes the window object