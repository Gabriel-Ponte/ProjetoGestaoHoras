import React from 'react'
import { createBoard } from '@wixc3/react-board';

export default createBoard({
    name: 'New Board',
    Board: () => <div>
        <h1>Login</h1>
        <div />
        <form><label>Email:</label><input type="text" placeholder="email@email.com" /><br /><label>Password:</label><input type="password" /><br /><br /></form>
        <input type="submit" value="Submit" /></div>,
    environmentProps: {
        windowWidth: 886,
        canvasWidth: 529,
        canvasHeight: 391
    }
});
