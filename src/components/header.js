import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {

	render() {
		return (
			<nav className="navbar navbar-expand-md navbar-dark bg-primary">
				<div className="container row col-sm-12">
					<Link className="navbar-brand col-12 col-sm-12 col-md-4 col-lg-4" to={"/"}>Block Explorer</Link>

					<form className="form-inline my-2 my-lg-0 col-lg-8" method="GET" action="/wallet">
						<input className="form-control mr-sm-2 mb-sm-2 mb-lg-0 col-lg-9 col-sm-12" type="search" placeholder="Search for bitcoin wallet..." aria-label="Search" name="addr"/>
						<button className="btn btn-success my-2 my-sm-0 col-lg-2" type="submit">Search</button>
					</form>
				</div>
			</nav>
		);
	}
}