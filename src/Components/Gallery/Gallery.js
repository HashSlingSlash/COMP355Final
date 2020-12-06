import React from "react";
import "./Gallery.css";
import {withRouter} from "react-router"
import Dog from "../Dog/Dog";
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

class Gallery extends React.Component{
    constructor(){
        super();
        this.breed = React.createRef();
        this.personality = React.createRef();
        this.children = React.createRef();
        this.otherAnimals = React.createRef();
        this._responseGoogle = this._responseGoogle.bind(this);
        this._onSignIn = this._onSignIn.bind(this);
        this._handleErrors = this._handleErrors.bind(this);
        this._onSignOut = this._onSignOut.bind(this);
        this._displayFavorites = this._displayFavorites.bind(this);
        this.state = {
            dogs: null,
            isLoggedIn: false,
            user: null
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
            user: profile.getName()
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

      _displayFavorites(){
        fetch(`http://localhost:5000/dogs?user=${this.state.user}`)
        .then(response => response.json())
        .then(result => {
            this.setState({
                dogs: result
            });
        });
      }

    componentDidMount(){
        fetch(`http://localhost:5000/dogs`)
        .then(response => response.json())
        .then(result => {
            this.setState({
                dogs: result
            });
        });
    }



    _clicked(){
        fetch(`http://localhost:5000/dogs?breed=${this.breed.current.value}&personality=${this.personality.current.value}&children=${this.children.current.value}&otheranimals=${this.otherAnimals.current.value}`)
        .then(response => response.json())
        .then(result => {
            this.setState({
                dogs: result
            });
        });
    }


    render(){

        return(
            <div className="gallery">
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
                <h1>Available Dogs</h1>
                <div className="searchSection">
                    <select ref={this.breed}>
                        <option value="none">Breed</option>
                        <option value="Chihuahua - Terrier blend">Chihuaha/Terrier Blend</option>
                        <option value="Shepherd - Border Collie blend">Shepherd/Border Collie Blend</option>
                        <option value="Catahoula Leopard Dog - Shepherd blend">Catahoula Leopard Dog/Shepherd Blend</option>
                        <option value="Shepherd blend">Shepherd Blend</option>
                        <option value="Terrier - Shepherd blend">Terrier/Shepherd Blend</option>
                        <option value="Terrier - Lab blend">Terrier/Lab Blend</option>
                        <option value="Labrador Retriever blend">Lab/Retriever Blend</option>
                        <option value="Catahoula Leopard Dog - Terrier blend">Catahoula Leopard Dog/Terrier Blend</option>
                    </select>
                    <select ref={this.personality}>
                        <option value="none">Personality</option>
                        <option value="curious">Curious</option>
                        <option value="laid-back">Laid-Back</option>
                        <option value="energetic">Energetic</option>
                        <option value="affectionate">Affectionate</option>
                        <option value="shy">Shy</option>
                    </select>
                    <select ref={this.children}>
                        <option value="none">Good With Children?</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <select ref={this.otherAnimals}>
                        <option value="none">Good With Other Animals?</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <button className="btn btn-primary mt-3" onClick={() => this._clicked()}>
                    Search
                </button>
                {(this.state.isLoggedIn) ?
                    <button className="btn btn-warning mt-3 ml-4" onClick={this._displayFavorites}>See Your Favorites</button>
                    :
                    ""
                }
                {this.state.dogs ? 
                <div className="displayDogs"> 
                    {this.state.dogs.map(dog => {
                    return <Dog key= {dog.name} dog = {dog} className="dog" value={dog._id}/>
                    })}
                </div>
                :
                <h1>No Dogs Available</h1>
                }
            </div>
        )
    }
}


export default withRouter(Gallery);