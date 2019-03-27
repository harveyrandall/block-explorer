import React, { Component } from 'react';

export default class Header extends Component {

	render() {
		return (
			<nav class="navbar navbar-expand-md navbar-dark bg-primary">
				<div class="container row col-sm-12">
					<a class="navbar-brand col-12 col-sm-12 col-md-4 col-lg-4" href="/">Block Explorer</a>

					<form class="form-inline my-2 my-lg-0 col-lg-8" method="GET" action="/wallet">
						<input class="form-control mr-sm-2 mb-sm-2 mb-lg-0 col-lg-9 col-sm-12" type="search" placeholder="Search for bitcoin wallet..." aria-label="Search" name="addr"/>
						<button class="btn btn-success my-2 my-sm-0 col-lg-2" type="submit">Search</button>
					</form>
				</div>
			</nav>
		);
	}
}