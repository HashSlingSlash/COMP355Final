import React, { Component } from 'react';
import "./Dog.css";

class Dog extends Component{

    constructor(){
        super();

        this._clickedDog = this._clickedDog.bind(this);

        this.state = {
            isLoggedIn: false
        }
    }

    _clickedDog(e){
        console.log(e);
        const dogName = e.target.value;
        console.log(dogName);
        window.location.href = `/result/${dogName}`;
    }
    
      
    render(){
        return(
            <div className="dog">
                <h4>{this.props.dog.name}</h4>
                <img src={this.props.dog.image} alt = {this.props.dog.name}/>
                <p>Weight: {this.props.dog.weight} lbs</p>
                <p>Price: ${this.props.dog.price}</p>
                <button className="moreInfo btn btn-primary mb-2" onClick={this._clickedDog} value={this.props.dog._id}>More Info</button>
            </div>
        );
    }
}

export default Dog;