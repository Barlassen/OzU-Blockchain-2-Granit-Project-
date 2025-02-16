import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/abi.js';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [buildingId, setBuildingId] = useState('');
  const [inputBuildingId, setInputBuildingId] = useState('');
  const [buildingData, setBuildingData] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Önce Sepolia ağına geçiş yapalım
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
        });
      } catch (switchError) {
        // Eğer ağ henüz eklenmemişse, ekleyelim
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SepoliaETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          } catch (addError) {
            console.error('Ağ ekleme hatası:', addError);
            return;
          }
        }
      }

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
        console.log("Cüzdan bağlandı:", accounts[0]);
        console.log("Kontrat bağlandı:", buildingContract.address);
      } catch (error) {
        console.error('Cüzdan bağlantı hatası:', error);
      }
    } else {
      alert('Lütfen MetaMask yükleyin!');
    }
  };

  const registerNewBuilding = async () => {
    try {
      if (!contract) {
        alert('Lütfen önce cüzdanınızı bağlayın!');
        return;
      }
      
      if (!inputBuildingId) {
        alert('Lütfen bir Bina ID girin!');
        return;
      }

      console.log('Bina kaydı başlatılıyor...', inputBuildingId);
      
      const tx = await contract.registerHouseNFT(
        true, // excavationAndFoundation
        true, // roughConstruction
        true, // roofConstruction
        true, // finishingWorks
        true, // doorWindowInsulation
        true  // securityAndCommonAreas
      );
      
      console.log('İşlem gönderildi:', tx.hash);
      
      await tx.wait();
      console.log('İşlem tamamlandı');
      
      setBuildingId(inputBuildingId);
      alert('Bina başarıyla kaydedildi!');
      
      // Yeni binanın verilerini otomatik olarak getir
      await getBuildingData();
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (error.code === 'ACTION_REJECTED') {
        alert('İşlem kullanıcı tarafından reddedildi');
      } else {
        alert('Kayıt sırasında bir hata oluştu: ' + error.message);
      }
    }
  };

  const getBuildingData = async () => {
    try {
      if (!contract || !inputBuildingId) return;
      
      setBuildingId(inputBuildingId);
      const data = await contract.houses(inputBuildingId);
      setBuildingData(data);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  const mintBuildingNFT = async () => {
    try {
      if (!contract || !buildingId) return;
      
      setIsMinting(true);
      const tx = await contract.registerHouseNFT(
        buildingData.build.excavationAndFoundation,
        buildingData.build.roughConstruction,
        buildingData.build.roofConstruction,
        buildingData.build.finishingWorks,
        buildingData.build.doorWindowInsulation,
        buildingData.build.securityAndCommonAreas
      );
      
      await tx.wait();
      alert('NFT başarıyla mint edildi!');
      await getBuildingData(); // Verileri güncelle
    } catch (error) {
      console.error('Mint hatası:', error);
      alert('NFT mint işlemi sırasında bir hata oluştu');
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde MetaMask bağlantısını kontrol et
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, []);

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
              <div className="input-group">
                <input 
                  type="number" 
                  placeholder="Bina ID (1-999)"
                  value={inputBuildingId}
                  onChange={(e) => setInputBuildingId(e.target.value)}
                  min="1"
                  max="999"
                />
              </div>
              
              <div className="button-group">
                <button className="action-button" onClick={registerNewBuilding}>
                  Yeni Bina Kaydet
                </button>
                
                <button className="action-button" onClick={getBuildingData}>
                  Bina Verilerini Getir
                </button>
              </div>
              
              {buildingData && (
                <div className="building-data">
                  <div className="granit-header">
                    <h1>GRANIT</h1>
                    <p>Bina Takip Sistemi</p>
                  </div>
                  
                  <h3>Bina Detaylı Bilgileri</h3>
                  
                  <div className="building-details">
                    <div className="building-header">
                      <h2>Bina #{buildingId}</h2>
                      <span className={`status ${buildingData.build.constructionCompleted ? 'completed' : 'in-progress'}`}>
                        {buildingData.build.constructionCompleted ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                    </div>

                    <div className="details-grid">
                      <div className="details-section">
                        <h4>🏗️ İnşaat Aşamaları</h4>
                        <div className="phase-list">
                          <p>
                            <span>1. Hafriyat ve Temel</span>
                            <span className="status-icon">{buildingData.build.excavationAndFoundation ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>2. Kaba İnşaat</span>
                            <span className="status-icon">{buildingData.build.roughConstruction ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>3. Çatı Yapımı</span>
                            <span className="status-icon">{buildingData.build.roofConstruction ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>4. İnce İşler</span>
                            <span className="status-icon">{buildingData.build.finishingWorks ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>5. Kapı/Pencere/İzolasyon</span>
                            <span className="status-icon">{buildingData.build.doorWindowInsulation ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>6. Güvenlik ve Ortak Alanlar</span>
                            <span className="status-icon">{buildingData.build.securityAndCommonAreas ? '✅' : '❌'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="details-section">
                        <h4>📋 İnşaat Sonrası Kontroller</h4>
                        <div className="phase-list">
                          <p>
                            <span>1. Denetim</span>
                            <span className="status-icon">{buildingData.post.inspection ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>2. Final Onayı</span>
                            <span className="status-icon">{buildingData.post.finalApproval ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>3. İç Mekan İşleri</span>
                            <span className="status-icon">{buildingData.post.interiorWorksCompleted ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>4. Dış Mekan İşleri</span>
                            <span className="status-icon">{buildingData.post.exteriorWorksCompleted ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>5. Yasal Evraklar</span>
                            <span className="status-icon">{buildingData.post.legalPaperwork ? '✅' : '❌'}</span>
                          </p>
                          <p>
                            <span>6. Final Teslim</span>
                            <span className="status-icon">{buildingData.post.finalHandover ? '✅' : '❌'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="details-section summary">
                        <h4>📊 Özet Bilgiler</h4>
                        <div className="summary-grid">
                          <div className="summary-item">
                            <span>NFT Durumu</span>
                            <span className={`status ${buildingData.minted ? 'completed' : 'pending'}`}>
                              {buildingData.minted ? 'Basıldı' : 'Beklemede'}
                            </span>
                          </div>
                          <div className="summary-item">
                            <span>İnşaat Durumu</span>
                            <span className={`status ${buildingData.build.constructionCompleted ? 'completed' : 'in-progress'}`}>
                              {buildingData.build.constructionCompleted ? 'Tamamlandı' : 'Devam Ediyor'}
                            </span>
                          </div>
                          <div className="summary-item">
                            <span>Bina ID</span>
                            <span className="id">#{buildingId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    className={`nft-button ${buildingData.minted ? 'minted' : ''}`}
                    onClick={mintBuildingNFT}
                    disabled={buildingData.minted || !buildingData.build.constructionCompleted || isMinting}
                  >
                    {isMinting ? 'NFT Mint Ediliyor...' : 
                     buildingData.minted ? 'NFT Mint Edildi' : 
                     'NFT Mint Et'}
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