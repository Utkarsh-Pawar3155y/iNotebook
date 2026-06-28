import React from 'react'
import { useContext } from 'react';
import noteContext from '../context/noteContext';
import Noteitem from './Noteitem';

const Notes = () => {
    const context = useContext(noteContext);
    const { notes, setNotes } = context;
    return (
        <>
        <h1>Your Notes</h1>
        <div className="row my-3">
            
            {
                notes.map((note) => {
                    return <Noteitem key={note._id} note={note}/>;
                })
            }
        </div>
        </>
    )
}

export default Notes
