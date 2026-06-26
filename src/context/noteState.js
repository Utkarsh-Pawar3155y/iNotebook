import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {

    const initialNotes = [
        {
            "_id": "6a3980b292670d072b0cf7c9",
            "user": "6a2ecb5b54dbd99a97c539ee",
            "title": "Morning ",
            "description": "Get up early morning updated",
            "tag": "personal",
            "date": "2026-06-22T18:36:34.707Z",
            "__v": 0
        },
        {
            "_id": "6a3e631b8f59fc4a0d3dc40c",
            "user": "6a2ecb5b54dbd99a97c539ee",
            "title": "Evening",
            "description": "Do homework",
            "tag": "personal",
            "date": "2026-06-26T11:31:39.419Z",
            "__v": 0
        }
    ]

    const [notes, setNotes] = useState(initialNotes);

    return (
        <NoteContext.Provider value={{ notes, setNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;