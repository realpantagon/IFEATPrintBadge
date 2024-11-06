// QRScanner.js
import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function QRScanner({ scanning, setScanning, handleScan }) {
  return (
    <>
      <button className="gradient-button" onClick={() => setScanning(!scanning)}>
        {scanning ? "Stop Scanning" : "Scan QR Code"}
      </button>
      {scanning && (
        <Scanner onScan={handleScan} onError={(error) => console.error(error)} />
      )}
    </>
  );
}

export default QRScanner;
