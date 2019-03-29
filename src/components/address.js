import React, { Component } from 'react';
import '../css/address.css';

export default class Address extends Component {

	constructor() {
		super();
		this.state = {
			connection: new WebSocket('wss://ws.blockchain.info/inv'),
			isValid: true,
			address: "",
			wallet: {}
		};
		this.updateTransactions = this.updateTransactions.bind(this);
		this.connectToValidAddress = this.connectToValidAddress.bind(this);
	}


	componentDidMount() {
		let walletAddress = new URLSearchParams(this.props.location.search).get('addr');
		let page = new URLSearchParams(this.props.location.search).get('page') ? "&offset=" + new URLSearchParams(this.props.location.search).get('page')*50 : "";

		this.connectToValidAddress(walletAddress);

		fetch(`https://blockchain.info/rawaddr/${walletAddress}?cors=true&format=json${page}`)
			.then(res => {
				if(res.status === 500) {
					return false;
				} else {
					return res.json();
				}
			})
			.then(data => {
				if(data) {
					console.log(data.txs[0]);
					this.setState({
						address: walletAddress,
						wallet: data
					});
				} else {
					this.setState({
						isValid: false,
						address: walletAddress
					});
				}
			});
	}

	componentWillUnmount() {
		const connection = this.state.connection;
		const message = {
			"op": "addr_unsub",
			"addr": this.state.address
		};
		connection.send(JSON.stringify(message));
	}

	connectToValidAddress(addr) {
		const connection = this.state.connection;
		connection.onopen = () => {
			let message = {
				"op": "addr_sub",
				"addr": addr
			};
			connection.send(JSON.stringify(message));
		};
		connection.onmessage = this.updateTransactions;
	}

	updateTransactions(transaction) {
		console.log(JSON.parse(transaction.data).x);
		this.setState(state => {
			let wallet = Object.assign({}, this.state.wallet);    //creating copy of object
			wallet.txs = [JSON.parse(transaction.data).x, ...wallet.txs];                        //updating value

			if(wallet.txs.length >= 75) {
				wallet.txs.splice(-1,1);
			}
			return {
				wallet
			};
		});
	};

	render() {
		let content = this.state.isValid ? <Wallet data={this.state.wallet} /> : <InvalidAddress address={this.state.address} />;
		return (
			<div className="container my-5">
				{content}
			</div>
		);
	}
}

const InvalidAddress = (props) => {
	return (
		<div className="alert alert-danger d-flex justify-content-start" role="alert">
			<strong>Error:</strong> &nbsp; <i>{props.address}</i> &nbsp; is not a valid bitcoin address.
		</div>
	);
};

const Wallet = (props) => {
	let summary, transactions;
	if(Object.keys(props.data).length > 0) {
		summary = (
			<ul className="list-group list-group-flush">
				<li className="list-group-item summary-item">
					<span className="item-key">Address</span>
					<span>{props.data.address}</span>
				</li>

				<li className="list-group-item summary-item">
					<span className="item-key">Hash160</span>
					<span>{props.data.hash160}</span>
				</li>

				<li className="list-group-item summary-item">
					<span className="item-key">Number of Transactions</span>
					<span>{props.data.n_tx}</span>
				</li>

				<li className="list-group-item summary-item">
					<span className="item-key">Bitcoin received</span>
					<span className="btc-value">{props.data.total_received / 100000000}</span>
				</li>

				<li className="list-group-item summary-item">
					<span className="item-key">Bitcoin sent</span>
					<span className="btc-value">{props.data.total_sent / 100000000}</span>
				</li>

				<li className="list-group-item summary-item">
					<span className="item-key">Current balance</span>
					<span className="btc-value">{props.data.final_balance / 100000000}</span>
				</li>
			</ul>
		);

		if(props.data.txs.length > 0) {
			transactions = props.data.txs.map((val, ind) => {
				return <Transaction currentWallet={props.data.address} data={val} key={ind} />;
			});
		} else {
			transactions = <li className="list-group-item">No transactions so far</li>;
		}
	} else {
		summary = <li className="list-group-item">Loading address details...</li>;
		transactions = <li className="list-group-item">Loading transaction details...</li>;
	}

	return (
		<div className="row">
			<div className="summary col-lg-9 col-12 px-2">
				<div className="card">
					<div className="card-header">
						Summary
					</div>
					{summary}
				</div>
			</div>
			<div className="transactions my-4 col-lg-12 col-12 px-2">
				<div className="card">
					<div className="card-header">
						Transactions
					</div>

					<ul className="list-group list-group-flush">
						{transactions}
					</ul>
				</div>
			</div>
		</div>
	);
};

const Transaction = (props) => {
	/*
	* If lock time is equal to 0 then the transaction is unconfirmed
	* Use this to determine status and background colour of list item
	 */
	const confirmed = props.data.lock_time > 0 ? true : false;

	/*
	* Determine the button shown depending on whether the transaction is confirmed or not
	 */
	const status = confirmed ?
						<button type="button" className="btn btn-primary">Confirmed!</button> :
						<button type="button" className="btn btn-warning">Unconfirmed!</button>;

	const txtime = new Date(props.data.time * 1000).toLocaleString();

	const transaction_index = props.data.tx_index;

	/*
	* Determine whether the transaction was sent or received by this address
	 */

	const transactionType = props.data.inputs.find((val) => { return val.prev_out.addr === props.currentWallet }) ?
								"list-group-item transaction list-group-item-danger" :
								"list-group-item transaction list-group-item-success";

	/*
	* Filter inputs by transaction index

	const senders = props.data.inputs.filter((val) => {
		return val.prev_out.spending_outpoints.filter((tx) => {
			return tx.tx_index === transaction_index;
		});
	});
	*/
	const senders = props.data.inputs;

	/*
	* If current searched for wallet is one of the receivers then filter out all other addresses
	*/
	const receivers = props.data.out.find((val) => { return val.addr === props.currentWallet }) ?
						props.data.out.filter((val) => { return val.addr === props.currentWallet }) :
						props.data.out.filter((val) => { return val.addr !== undefined && val.value > 0; });


	return (
		<li className={transactionType}>
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
							<div>{val.addr}</div>
							<div className="amount btc-value">{val.value / 1000000}</div>
						</div>
					);
				})}
				<div className="status">
					<button type="button" className="btn btn-primary mr-2">{txtime}</button>
					{status}
				</div>
			</div>
		</li>
	);
}