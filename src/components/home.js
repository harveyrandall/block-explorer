import React, { Component } from 'react';
import '../css/home.css';
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
		this.setState(state => {
			const transactions = [transaction, ...this.state.transactions];
			if(transactions.length >= 25) {
				transactions.splice(-1,1);
			}
			return {
				transactions
			};
		});
	}

	render() {
		const transactions = this.state.transactions.length > 0 ?
								this.state.transactions.map((val, index) => {
									return <Transaction key={index} data={val} />;
								}) :
								"Awaiting new transactions.";

		return (
			<div className="container my-5">
				<div className="row unconfirmed_txs">
					<div className="card col-12 col-sm-12 col-lg-12 px-0">
						<div className="card-header">
							Unconfirmed Transactions
						</div>

						<ul className="list-group list-group-flush">
							{transactions}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

const Transaction = (props) => {
	const data = JSON.parse(props.data.data);

	console.log(data);

	/*
	* Get all the senders of the transaction
	 */
	const senders = data.x.inputs;

	/*
	* Get all receivers of transaction
	*/
	const receivers = data.x.out.filter((val) => {
		return val.addr !== undefined && val.value > 0;
	});

	return (
		<li className="list-group-item transaction">
			<div className="senders">
				{senders.map((val, index) => {
					return <div key={index}>{val.prev_out.addr}</div>;
				})}
			</div>
			<div>&rarr;</div>
			<div className="receivers">
				{receivers.map((val, index) => {
					return (
						<div className="receiver" key={index}>
							<div className="raddress">{val.addr}</div>
							<div className="amount btc-value">{val.value / 100000000}</div>
						</div>
					);
				})}
			</div>
		</li>
	);
}