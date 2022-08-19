import React from 'react';
import pizzas from '../data/pizzas.json';
import Pizza from './Pizza';
import AppCSS from './App.css';
import PizzaSVG from '../svg/pizza.svg';
import Cart from './Cart';

const App = () => {
  return (
    <div>
      <div>
        <PizzaSVG width={120} height={120} />
        <Cart />
      </div>
      <ul>
        {pizzas.map((pizza) => {
          return <Pizza key={pizza.id} pizza={pizza} />;
        })}
      </ul>
    </div>
  );
};

export default App;
