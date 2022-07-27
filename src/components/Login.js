import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let history = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // eslint-disable-next-line
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }) // body data type must match "Content-Type" header 
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //Save authtoken and Redirect
            localStorage.setItem("token", json.authToken);
            props.showAlert("Logged in successfully", "success");
            console.log(localStorage.getItem('token'));
            history("/");
        }
        else {
            props.showAlert("Invalid Details", "danger");
        }
    };
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    return (
        <div className='m-2'>
            <h2>Login to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id='email' name='email' aria-describedby="emailHelp" onChange={onChange} value={credentials.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id='password' name='password' onChange={onChange} value={credentials.password} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
