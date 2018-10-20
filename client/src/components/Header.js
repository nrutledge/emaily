import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Payments from './Payments';

class Header extends Component {
    renderContent(auth) {
        switch(auth) {
            case null:
                return;
            case false:
                return <li><a href="/auth/google">Log In With Google</a></li>
            default:
                return [
                    <li key="1"><Payments /></li>,
                    <li key="2" style={{ margin: '0 10px' }}>Credits: {auth.credits}</li>,
                    <li key="3"><a href="/api/logout">Log Out</a></li>
                ];            
        }
    }

    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper">
                        <div className="container">
                            <Link 
                                to={this.props.auth ? '/surveys' : '/'}
                                className="brand-logo left"
                            >
                                Emaily
                            </Link>
                            <ul className="right">
                                { this.renderContent(this.props.auth) }
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default connect(({ auth }) => ({ auth }), null)(Header);