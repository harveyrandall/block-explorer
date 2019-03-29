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

	componentWillUnmount() {
		const connection = this.state.connection;
		connection.send(JSON.stringify({"op":"unconfirmed_unsub"}));
	}

	handleNewTransactions(transaction) {
		const connection = this.state.connection;
		this.setState(state => {
			const transactions = state.transactions.concat(transaction.data);

			return {
				transactions
			};
		});
		connection.send(JSON.stringify({"op": "unconfirmed_unsub"}));
	}

	render() {
		return (
			<div className="container my-5">
				<div className="row unconfirmed_txs">
					{this.state.transactions.map((val, index) => {
						return <Transaction key={index} data={val} />;
					})}
				</div>
			</div>
		);
	}
}

const Transaction = (props) => {
	const data = JSON.parse(props.data);
	console.log(data);
	return (
		<div className="transaction">
			{data.op}
		</div>
	);
}