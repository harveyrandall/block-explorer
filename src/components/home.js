import React, { Component } from 'react';
//import Websocket from 'react-websocket';

export default class Home extends Component {

	constructor() {
		super();
		this.state = {
			connection: new WebSocket('wss://ws.blockchain.info/inv'),
			transactions: []
		}
		this.handleNewTransactions = this.handleNewTransactions.bind(this);
	}

	componentDidMount() {
		const connection = this.state.connection;
		connection.onopen = () => {
			let message = {
				"op": "unconfirmed_sub"
			}
			connection.send(JSON.stringify(message));
		}
		connection.onmessage = this.handleNewTransactions;
	}

	handleNewTransactions(transaction) {
		transaction = JSON.parse(transaction.data);
		console.log(transaction);
		let transactions = this.state.transactions;
		transactions.push(transaction.data);
		this.setState({
			transactions: transactions
		});
	}





	render() {
		return (
			<div>
				Hello World
			</div>
		);
	}
}