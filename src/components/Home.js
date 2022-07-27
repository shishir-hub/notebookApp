import React from 'react';
import Notes from './Notes';

const Home = (props) => {
    return (
        <div>
            <div className="container my-3">
                <Notes showAlert={props.showAlert}></Notes>
            </div>
        </div>
    )
}

export default Home
