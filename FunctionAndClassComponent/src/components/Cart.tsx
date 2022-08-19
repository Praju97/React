import React from "react";
import {FiShoppingCart} from "react-icons/fi"

interface Props{}

interface State{
    isOpen: boolean;
}

class Cart extends React.Component<Props, State> {
    constructor(props: Props){
        super(props)
        this.state = {
            isOpen: false
        }
    }

    render() {
        return(
            <div>
                <button  onClick={() => {
                    this.setState((prevState) => ({ isOpen: !prevState.isOpen }))
                }}>
                    <FiShoppingCart />2 Pizzas
                    </button>
                <div style={{display: this.state.isOpen? 'block' : 'none'}}>
                    <ul>
                        <li>Chicken Sausage</li>
                        <li>Farmhouse</li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Cart;