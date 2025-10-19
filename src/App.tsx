import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

function App() {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const savedCoins = localStorage.getItem("coins");
    if (savedCoins) {
      setCoins(parseInt(savedCoins));
    }

    sdk.actions.ready();
  }, []);

  const handleClick = () => {
    const newCoins = coins + 1;
    setCoins(newCoins);
    localStorage.setItem("coins", newCoins.toString());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      <h1 className="text-4xl font-bold text-yellow-800 mb-4">💰 Coin Clicker</h1>
      <p className="text-lg mb-4">You have <strong>{coins}</strong> coins.</p>
      <button
        onClick={handleClick}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full text-xl"
      >
        Click to Earn Coins!
      </button>
    </div>
  );
}

export default App;
