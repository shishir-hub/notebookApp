import React, { useContext } from 'react';
import NoteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { notes, updateNotes } = props;
    return (
        <div className='col-md-3 my-2'>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">{notes.title}</h5>
                        <div>
                            <i className="del fa-solid fa-trash-can mx-2" onClick={() => { deleteNote(notes._id); props.showAlert("Note deleted successfully", "danger"); }}></i>
                            <i className="update fa-solid fa-file-pen mx-2" onClick={() => { updateNotes(notes) }}></i>
                        </div>
                    </div>
                    <p className="card-text">{notes.description}</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
