import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/index.js';
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
        console.log(buildingContract);
      } catch (error) {
        console.error('Cüzdan bağlantısı başarısız:', error);
      }
    }
  };

  const registerNewBuilding = async () => {
    try {
      if (!contract || !buildingId) return;
      
      const tx = await contract.registerHouseNFT(
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
          <div>
            <h1 className="welcome-title">Granit'e Hoşgeldiniz</h1>
            <button className="connect-button" onClick={connectWallet}>
              Cüzdanı Bağla
            </button>
          </div>
        ) : (
          <div>
            <div className="wallet-info">
              <p>Bağlı Cüzdan: {account}</p>
            </div>
            
            <div className="building-form">
              <input 
                type="number" 
                placeholder="Bina ID (100-999)"
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                min="100"
                max="999"
              />
              
              <button className="action-button" onClick={registerNewBuilding}>
                Yeni Bina Kaydet
              </button>
              
              <button className="action-button" onClick={getBuildingData}>
                Bina Verilerini Getir
              </button>
              
              {buildingData && (
                <div className="building-data">
                  <h3>Bina Bilgileri:</h3>
                  
                  <div className="building-details">
                    <h4>İnşaat Aşamaları:</h4>
                    <p>Hafriyat ve Temel: {buildingData.build.excavationAndFoundation ? '✅' : '❌'}</p>
                    <p>Kaba İnşaat: {buildingData.build.roughConstruction ? '✅' : '❌'}</p>
                    <p>Çatı Yapımı: {buildingData.build.roofConstruction ? '✅' : '❌'}</p>
                    <p>İnce İşler: {buildingData.build.finishingWorks ? '✅' : '❌'}</p>
                    <p>Kapı/Pencere/İzolasyon: {buildingData.build.doorWindowInsulation ? '✅' : '❌'}</p>
                    <p>Güvenlik ve Ortak Alanlar: {buildingData.build.securityAndCommonAreas ? '✅' : '❌'}</p>
                    
                    <h4>İnşaat Sonrası Aşamalar:</h4>
                    <p>Denetim: {buildingData.post.inspection ? '✅' : '❌'}</p>
                    <p>Final Onayı: {buildingData.post.finalApproval ? '✅' : '❌'}</p>
                    <p>İç Mekan İşleri: {buildingData.post.interiorWorksCompleted ? '✅' : '❌'}</p>
                    <p>Dış Mekan İşleri: {buildingData.post.exteriorWorksCompleted ? '✅' : '❌'}</p>
                    <p>Yasal Evraklar: {buildingData.post.legalPaperwork ? '✅' : '❌'}</p>
                    <p>Final Teslim: {buildingData.post.finalHandover ? '✅' : '❌'}</p>

                    <h4>Genel Durum:</h4>
                    <p>İnşaat Tamamlandı: {buildingData.build.constructionCompleted ? '✅' : '❌'}</p>
                    <p>NFT Basıldı: {buildingData.minted ? '✅' : '❌'}</p>
                    <p>Bina ID: #{buildingId}</p>
                  </div>

                  <button className="nft-button" disabled>
                    Bina bilgilerini içeren NFT
                  </button>
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