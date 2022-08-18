import { useState } from "react";

function log(str: string){
    console.log(str)


const greeting = 'Hello World!';
log(greeting)

// Create a piece of state, and initialize it to `true`
  // `hidden` will hold the current value of the state,
  // and `setHidden` will let us change it
  const [hidden, setHidden] = useState(true);


  const [steps, setSteps] = useState(0);

  // useState with an array
  const [items, setItems] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
}