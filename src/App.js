import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [buildingId, setBuildingId] = useState('');
  const [buildingData, setBuildingData] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        
        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();
        const buildingContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setContract(buildingContract);
      } catch (error) {
        console.error('Cüzdan bağlantısı başarısız:', error);
      }
    }
  };

  const registerNewBuilding = async () => {
    try {
      if (!contract || !buildingId) return;
      
      const tx = await contract.registerHouseNFT(
        buildingId,
        true, // excavationAndFoundation
        true, // roughConstruction
        true, // roofConstruction
        true, // finishingWorks
        true, // doorWindowInsulation
        true  // securityAndCommonAreas
      );
      
      await tx.wait();
      alert('Bina başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında bir hata oluştu');
    }
  };

  const getBuildingData = async () => {
    try {
      if (!contract || !buildingId) return;
      
      const data = await contract.houses(buildingId);
      setBuildingData(data);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!account ? (
          <button onClick={connectWallet}>Cüzdanı Bağla</button>
        ) : (
          <div>
            <p>Bağlı Cüzdan: {account}</p>
            
            <div className="building-form">
              <input 
                type="number" 
                placeholder="Bina ID (100-999)"
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                min="100"
                max="999"
              />
              
              <button onClick={registerNewBuilding}>
                Yeni Bina Kaydet
              </button>
              
              <button onClick={getBuildingData}>
                Bina Verilerini Getir
              </button>
              
              {buildingData && (
                <div className="building-data">
                  <h3>Bina Bilgileri:</h3>
                  <p>İnşaat Tamamlandı: {buildingData.build.constructionCompleted ? 'Evet' : 'Hayır'}</p>
                  <p>NFT Basıldı: {buildingData.minted ? 'Evet' : 'Hayır'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;