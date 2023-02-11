import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/ShippingAgreement.json";
import DeliverySummary from "./DeliverySummary";

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const { ethereum } = window;


    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [deliverySummary, setDeliverySummanry] = useState([]);
  const [report, setReport] = useState("");
  const contractAddress = "0xD0c68753c42eef34d47eA6934A9FCcac8A28353C";

  /*
  * Create a variable here that references the abi content!
  */
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmReceipt = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const shippingAgreementContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
        * Execute the actual wave from your smart contract
        */
        // TODO Parse from input
        const confirmReceiptTx = await shippingAgreementContract.receiveShipment(76, 1, "af1967ac8fc8a5c0ee8ee903300a96a82e2787dfafaa1de19fb86648e5a8ab221392cf61b45fc363ee1c1cdc40ffe69f");
        console.log("Mining...", confirmReceiptTx.hash);

        await confirmReceiptTx.wait();
        console.log("Mined -- ", confirmReceiptTx.hash);

        setReport("");

        getDeliverSummary();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  /*
   * Create a method that gets all waves from your contract
   */
  const getDeliverSummary = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const shippingAgreementContract = new ethers.Contract(contractAddress, contractABI, signer);

        let summary = await shippingAgreementContract.getDeliverySummary()
        console.log("summary", summary)

        setDeliverySummanry(summary);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }


  /*
   * This runs our function when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    async function connectMetaMask() {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    }
    connectMetaMask();
  }, []);

  function changeHandler(event) {
    setReport(event.target.value);
  }

  async function pasteFromClipboard() {
    setReport("Report: [\n   Time: 2022-12-06 09:57:27\n   Max Gs: 1\n   Max Temp (F): 76\n] \nSignature: \naf1967ac8fc8a5c0ee8ee903300a96a82e2787dfafaa1de19fb86648e5a8ab221392cf61b45fc363ee1c1cdc40ffe69f");
  }


  return (<>
    <div style={{ display: "flex", justifyContent: "end", margin: "25px" }} >
      {!currentAccount ? (
        <button className="walletButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (<button className="walletButton" disabled>
        {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}
      </button>)
      }
    </div>
    <div style={{ display: "flex", justifyContent: "center" }} >
      <img src="/trac3y_logo.png" alt="Trac3y Logo" width="185" height="229" />
    </div>
    <div className="mainContainer">
      <div className="dataContainer">
        {deliverySummary.length === 0 ? (<>
          <div className="header">
            📦 Confirm Package Receipt
          </div>

          <div className="bio">
            Please paste the tracking report to confirm the package receipt.
          </div>
          <br />

          <textarea style={{ margin: "25px 20px" }} rows="10" cols="20" onChange={changeHandler} value={report} className="waveInput" placeholder="Tracking report"></textarea>
          <br />
          <button className="waveButton" onClick={pasteFromClipboard}>
            Paste from Clipboard
          </button>


          <button className="waveButton" onClick={confirmReceipt}>
            Submit Report
          </button>
        </>) : (<>
          <DeliverySummary delivery={deliverySummary} />
        </>)}

      </div>
    </div>
  </>
  );
};

export default App;