import React, { Component } from 'react';

export default class Address extends Component {

	constructor() {
		super();
		this.state = {
			isValid: true,
			wallet: {
				address: null,
				balance: null
			}
		};
	}


	componentDidMount() {
		let walletAddress = new URLSearchParams(this.props.location.search).get('addr');
		fetch(`https://blockchain.info/rawaddr/${walletAddress}?cors=true&format=json`)
			.then(res => {
				if(res.status === 500) {
					return false;
				} else {
					return res.json();
				}
			})
			.then(data => {
				if(data) {
					this.setState({
						wallet: {
							address: data.address,
							balance: data.final_balance
						}
					});
				} else {
					this.setState({
						isValid: false,
						wallet: {
							address: walletAddress
						}
					});
				}
			});
	}

	render() {
		let content = this.state.isValid ? <Wallet data={this.state.wallet} /> : <InvalidAddress address={this.state.wallet.address} />;
		return (
			<div className="container my-5">
				{content}
			</div>
		);
	}
}

const InvalidAddress = (props) => {
	console.log(props);
	return (
		<div className="alert alert-danger d-flex justify-content-start" role="alert">
			<strong>Error:</strong> &nbsp; <i>{props.address}</i> &nbsp; is not a valid bitcoin address.
		</div>
	);
};

const Wallet = (props) => {
	return (
		<div>
			<div>{props.data.address}</div>
			<div>{props.data.balance}</div>
		</div>
	);
}