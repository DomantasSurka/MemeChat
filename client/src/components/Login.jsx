import React from "react";
import { useState } from 'react';

function Login(){
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
    
      const handleSubmit = (event) => {
        event.preventDefault();
        alert(`${inputs.username} | age: ${inputs.age}`);
        console.log(inputs);
      }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <label>Enter your name:
            <input 
                type="text" 
                name="username" 
                value={inputs.username || ""} 
                onChange={handleChange}
            />
            </label>
            <label>Enter your age:
                <input 
                type="number" 
                name="age" 
                value={inputs.age || ""} 
                onChange={handleChange}
                />
                </label>
                <input type="submit" />
            </form>
        </div>
    );
}

export default Login;