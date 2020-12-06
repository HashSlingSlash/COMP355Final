import React from "react";
import "./Result.css";
import {withRouter} from "react-router";
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

class Result extends React.Component{

    constructor(){
        super();
        this.state ={
            dog:undefined,
            isLoggedIn: false,
            user: null,
            email: null
        }
        this._goBack = this._goBack.bind(this);
        this._saveFavorite = this._saveFavorite.bind(this);
        this._handleErrors = this._handleErrors.bind(this);
        this._onSignIn = this._onSignIn.bind(this);
        this._onSignOut = this._onSignOut.bind(this);
        this._sendMail = this._sendMail.bind(this);
    }

    componentDidMount(){
        let dogName = this.props.match.params.dog;
        fetch(`http://localhost:5000/result/${dogName}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            this.setState({
                dog: result
            });
        });
    }

    _goBack(){
        window.location.href = `/gallery`;
    }

    _handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    _saveFavorite(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                dog: this.state.dog[0].name
            })
        };
        fetch(`http://localhost:5000/save-favorite/${this.state.user}`, requestOptions)
            .then(this._handleErrors)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

    _onSignIn(googleUser){
        const profile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().id_token;

        this.setState({
            isLoggedIn: true,
            user: profile.getName(),
            email: profile.getEmail()
        })

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: profile.getName(),
                email: profile.getEmail(),
                idToken: token
            })
        };
        fetch('http://localhost:5000/new-user', requestOptions)
            .then(this._handleErrors)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
        console.log("Signed In");
    }

    _onSignOut(){
        this.setState({
            isLoggedIn: false,
            user: null,
            email: null
        })
    }

    _sendMail(){
        let dogName = this.props.match.params.dog;
        fetch(`http://localhost:5000/send-mail/${dogName}/${this.state.user}`)
        .then(response => response.json())
        .then(result => {
            console.log(result)
        });    }

    render(){
        return(
            <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Top Dog</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                        {!this.state.isLoggedIn ? 
                            <GoogleLogin
                                clientId="132856132617-80h09i5tn9p97pasqr47qoa690pijug8.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={this._onSignIn}
                                onFailure={this._responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                className="nav-link"
                            />
                            :
                            <GoogleLogout
                                    clientId="132856132617-80h09i5tn9p97pasqr47qoa690pijug8.apps.googleusercontent.com"
                                    buttonText="Logout"
                                    onLogoutSuccess={this._onSignOut}
                            >
                            </GoogleLogout>
                        }
                    </div>
                </nav>
                {(this.state.dog !== undefined) ? 
                    (this.state.dog.length !== 0) ?
                        <div className="row">
                            <div className="pet col-lg-4">
                                <h1>{this.state.dog[0].name}</h1>
                                <img src={this.state.dog[0].image} alt={this.state.dog[0].name}/>
                                <p>{this.state.dog[0].description}</p>
                                {(this.state.user) ? 
                                <button className="btn btn-success favorite" onClick={this._saveFavorite}>Save as a Favorite</button>
                                :
                                <h4 className="lts">Login to save as a favorite</h4>
                            }
                            </div>
                            <div className="col-lg-4">
                                <div className="more">
                                    <h3>More Information:</h3>
                                    <ul className="list">
                                        <li>Gender: {this.state.dog[0].gender}</li>
                                        <li>Personality: {this.state.dog[0].personality}</li>
                                        <li>Breed: {this.state.dog[0].breed}</li>
                                        <li>Age: {this.state.dog[0].age}</li>
                                        <li>Weight: {this.state.dog[0].weight} lbs</li>
                                        <li>Price: ${this.state.dog[0].price}</li>
                                        {(this.state.dog[0].children) ?
                                            <li>Good with children</li>
                                            :
                                            <li>Not good with children</li>}
                                        {(this.state.dog[0].otherAnimals) ?
                                            <li>Good with other animals</li>
                                            :
                                            <li>Not good with other animals</li>}
                                    </ul>
                                    {(this.state.user) ?
                                        <button className="btn btn-success email" onClick={this._sendMail}>Express Interest By Emailing</button>
                                        :
                                        <h4>Login to inquire about this dog.</h4>
                                    }
                                </div>
                                <button onClick={() => this._goBack()} className="btn btn-primary" id="back">Go Back</button>
                            </div>
                        </div> 

                    :
                    "Dog not found"
                : 
                <button onClick={() => this._goBack()}>Go Back</button>
                }
            </div>
        )
    }
}

export default withRouter(Result);