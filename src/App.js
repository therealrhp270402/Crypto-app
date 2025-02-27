import React, { useState, useEffect } from "react";
import Web3 from "web3";

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState([]);

  // Fungsi untuk menghubungkan wallet Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAccount = accounts[0];
        setAccount(userAccount);

        // Mendapatkan balance ETH
        const balanceWei = await web3.eth.getBalance(userAccount);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(balanceEth);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Gagal menghubungkan wallet. Pastikan Metamask terinstall.");
      }
    } else {
      alert("Silakan install Metamask untuk melanjutkan!");
    }
  };

  // Fungsi untuk mengambil data ticker harga dari CoinGecko API
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,binancecoin,cardano&vs_currencies=usd"
      );
      const data = await response.json();
      const prices = [
        { name: "Bitcoin (BTC)", price: data.bitcoin.usd },
        { name: "Ethereum (ETH)", price: data.ethereum.usd },
        { name: "Ripple (XRP)", price: data.ripple.usd },
        { name: "Binance Coin (BNB)", price: data.binancecoin.usd },
        { name: "Cardano (ADA)", price: data.cardano.usd },
      ];
      setCryptoPrices(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

  // Mengambil data harga saat aplikasi dimuat
  useEffect(() => {
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60000); // Update setiap 60 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Crypto Wallet Dashboard</h1>
      </header>
      <main>
        <section className="wallet-section">
          {!account ? (
            <button onClick={connectWallet} className="connect-btn">
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-info">
              <p>Wallet Address: <span>{account}</span></p>
              <p>ETH Balance: <span>{balance ? `${balance.slice(0, 6)} ETH` : "Loading..."}</span></p>
            </div>
          )}
        </section>

        <section className="ticker-section">
          <h2>Cryptocurrency Prices</h2>
          <div className="ticker-container">
            {cryptoPrices.length > 0 ? (
              cryptoPrices.map((crypto, index) => (
                <div key={index} className="ticker-card">
                  <h3>{crypto.name}</h3>
                  <p>${crypto.price.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>Loading prices...</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;