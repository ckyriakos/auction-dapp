import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {contractBalance:0,pendingReturns:0,highestBidder:null,highestBid: 0, web3: null, accounts: null, contract: null,current_bid:"" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
    const current_bid = "";
    const contractBalance = await instance.methods.getContractBalance().call();
    const response = await instance.methods.highestBid().call();
    const response_1 = await instance.methods.highestBidder().call();
    //const pendingReturns = await instance.methods.withdraw().send({ from: accounts[0],value:5000000000000000000});
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance ,highestBid:response,highestBidder:response_1,getContactBalance:contractBalance,current_bid:""});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid1 = async () => {
    const { accounts, contract,current_bid} = this.state;
    const bid_amount = this.state.current_bid;
    // Stores a given value, 5 by default.
    const withdraw_am= await contract.methods.bid().send({ from: accounts[0],value:bid_amount});

          //console.log(this.state.input);
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.highestBid().call(); // responses for highestBid
    const response_1 = await contract.methods.highestBidder.call(); // responses for highestBidder

    // Update state with the result.
    this.setState({ highestBid: response ,highestBidder:response_1,pendingReturns:withdraw_am});
      
  };
  bid2 = async () => {
    const { accounts, contract,current_bid} = this.state;
    // Stores a given value, 5 by default.
          //console.log(this.state.input);
    const bid_amount = this.state.current_bid;
    const withdraw_am = await contract.methods.bid().send({ from: accounts[0],value:bid_amount});
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.highestBid().call();

    // Update state with the result.
    const response_1 = await contract.methods.highestBidder.call();
    // Update state with the result.
    this.setState({ highestBid: response ,highestBidder:response_1,pendingReturns:withdraw_am});
      
  };
  highestBid = async ()=>{
    const {accounts,contract} = this.state;

    const highestbid = await contract.methods.highestBid().call();
  }
  highestBidder = async () => {
    const {accounts,contract} = this.state;
    await contract.methods.highestBidder().call();
    console.log(this.state);

  }
  withdraw = async () => {
     const {accounts,contract} = this.state;
     
     const contractBalance = await contract.methods.getContractBalance().call({from: accounts[0]});


     const withdraw_am = await contract.methods.withdraw().send({from:accounts[0]});
     
      
     console.log(this.state);
     this.setState({getContractBalance:contractBalance,pendingReturns:withdraw_am});
  }

  getContractBalance = async () =>{
    const {accounts,contract} = this.state;
    const contractBalance = await contract.methods.getContractBalance().call({from: accounts[0]});
    console.log(this.state.contractBalance);
    this.setState({getContractBalance:contractBalance});

  }
  myChangeHandler  = (event) => {
    this.setState({current_bid : event.target.value*1000000000000000000},() =>{
      console.log(this.state.current_bid);
    });
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction Dapp</h1>
        <div>Enter bid amount!</div>
        <input type="text"  onChange={this.myChangeHandler}/>
        <div>Enter for bidder 1</div>
        <div>< button onClick={this.bid1}> Bidder 1</button></div>
        <div>Enter for bidder 2</div>
        <div><button onClick={this.bid2}> Bidder 2</button></div>
        <div><button onClick={this.highestBid}>Get highestBid</button></div>
        <div>{this.state.highestBid}></div>
        <button onClick={this.highestBidder}>Get highestBidder</button>
        <div>{this.state.highestBidder}></div>
        <button onClick={this.withdraw}>Withdraw</button>
        <div>{this.state.withdraw}</div>
        <button onClick={this.getContractBalance}>Contract BAlance</button>
        <div>{this.state.getContractBalance}</div>
      </div>
    );
  }
}

export default App;
