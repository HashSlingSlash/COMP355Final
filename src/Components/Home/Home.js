import React from "react";
import "./Home.css";
import {withRouter} from "react-router";
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';


class Home extends React.Component{
    constructor(){
        super();
        this._responseGoogle = this._responseGoogle.bind(this);
        this._onSignIn = this._onSignIn.bind(this);
        this._handleErrors = this._handleErrors.bind(this);
        this._onSignOut = this._onSignOut.bind(this);
        this.state = {
            isLoggedIn: false
        }
    }

    _responseGoogle = (response) => {
        console.log(response);
      }
    
    _handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    _onSignIn(googleUser) {
        const profile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().id_token;

        this.setState({
            isLoggedIn: true,
            idToken: token
        });

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
          console.log("Signed out");
          this.setState({
              isLoggedIn: false
          })
      }

    render(){

        return(
            <div className="home">
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
                <div className="main-content">
                    <h1>Top Dog Animal Shelter</h1>
                    <a className="btn btn-primary" id="galleryButton" href="/gallery">Find Your Next Best Friend</a>  
                </div>
            </div>
        )
    }
}


export default withRouter(Home);