import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import styles from './style.component/StoreLocator.module.css';

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 10.762622, lng: 106.660172 });
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const fetchStores = () => {
    const dummyStores = [
      { id: 1, name: 'PomDu Store Cộng Hòa', address: '554 Cộng Hòa, Tân Bình, TP.HCM', lat: 10.774305, lng: 106.701748 },
      { id: 2, name: 'PomDu Store Sư Vạn Hạnh', address: '662/17 Sư Vạn Hạnh, Quận 10, TP.HCM', lat: 10.768845, lng: 106.693048 },
      { id: 3, name: 'PomDu Store Lưu Trọng Tấn', address: '350 Lưu Trọng Tấn, Tân Bình, TP.HCM', lat: 10.785226, lng: 106.675908 },
      { id: 4, name: 'PomDu Store Trần Hưng Đạo', address: '828 Trần Hưng Đạo, Phú Nhuận, TP. HCM', lat: 10.7712, lng: 106.6676 },
    ];
    setStores(dummyStores);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setMapCenter({ lat: store.lat, lng: store.lng });
  };

  return (
    <div className={styles.storeLocator}>
      <h1 className={styles.title}>Tìm cửa hàng PomDu</h1>
      <div className={styles.container}>
        <div className={styles.mapContainer}>
          {googleMapsApiKey ? (
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={14}
                options={options}
              >
                {stores.map(store => (
                  <Marker
                    key={store.id}
                    position={{ lat: store.lat, lng: store.lng }}
                    onClick={() => handleStoreSelect(store)}
                  />
                ))}
                {selectedStore && (
                  <InfoWindow
                    position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
                    onCloseClick={() => setSelectedStore(null)}
                  >
                    <div>
                      <h3>{selectedStore.name}</h3>
                      <p>{selectedStore.address}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          ) : (
            <div>Không thể tải Google Maps. Vui lòng kiểm tra API key.</div>
          )}
        </div>
        <div className={styles.storeList}>
          <h2>Danh sách cửa hàng</h2>
          <ul>
            {stores.map(store => (
                <li key={store.id} onClick={() => handleStoreSelect(store)}>
                <h3>{store.name}</h3>
                <p>{store.address}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;