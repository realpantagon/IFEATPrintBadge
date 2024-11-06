import axios from "axios";
import { useState } from "react";
import RefIDInput from "./RefIDInput";
import QRScanner from "./QRScanner";
import DataBadges from "./DataBadges";
import PDFGenerator from "./PDFGenerator";
import CheckInButton from "./CheckInButton";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [refId, setRefId] = useState("IFEAT-");
  const [recordId, setRecordId] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [qrMessage, setQrMessage] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null);

  const searchAirtableByRefId = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfReady(false);

      const response = await axios.get(
        `https://api.airtable.com/v0/app5cBH0nxzVUysXB/Registration`,
        {
          headers: {
            Authorization: `Bearer patqmneNITxUZMqvh.6428bde97139fccfde8876240fce3c9516d79b6b2484a180eb6e4e696661cde5`,
          },
          params: {
            filterByFormula: `{Ref_ID}="${refId}"`,
          },
        }
      );

      const record = response.data.records[0];
      if (record && record.fields) {
        setData(record.fields);
        setRecordId(record.id);
        setPdfReady(true);
        setCheckInStatus(record.fields.Check_in); // Set the check-in status
      } else {
        setData(null);
        setCheckInStatus(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setRefId(value.startsWith("IFEAT-") ? value : "IFEAT-" + value.replace("IFEAT-", ""));
  };

  const handleScan = (result) => {
    if (Array.isArray(result) && result[0]?.rawValue) {
      const scannedText = result[0].rawValue;
      setQrMessage(`Scanned QR Code: ${scannedText}`);
      setRefId(scannedText);
      setScanning(false);
    } else {
      console.warn("Invalid scan result:", result);
    }
  };

  const handleCheckInSuccess = () => {
    setCheckInStatus("Checked_in"); // Update local check-in status after success
  };

  const renderBadge = (label, value) => {
    let displayValue = value ?? <span style={{ color: "red" }}>No data</span>;
    if (typeof value !== "string" && typeof value !== "number") displayValue = <span style={{ color: "red" }}>Invalid data</span>;

    return (
      <span className="badge">
        <span className="badge-key">{label}:</span>
        <span className="badge-value">{displayValue}</span>
      </span>
    );
  };

  const renderImageStatus = (label, imageData) => {
    const hasImage = Array.isArray(imageData) && imageData[0]?.url;
    return (
      <span className="badge">
        <strong>{label}:</strong>{" "}
        {hasImage ? <span style={{ color: "green" }}>✅</span> : <span style={{ color: "red" }}>❌</span>}
      </span>
    );
  };

  return (
    <div>
      <RefIDInput refId={refId} handleInputChange={handleInputChange} onSubmit={searchAirtableByRefId} />
      <div style={{ textAlign: "center", margin: "0 0", fontWeight: "bold" }}>OR</div>
      <QRScanner scanning={scanning} setScanning={setScanning} handleScan={handleScan} />
      {qrMessage && <p><strong>{qrMessage}</strong></p>}
      {isGeneratingPDF ? (
        <div className="spinner"></div>
      ) : data ? (
        <>
          <DataBadges data={data} recordId={recordId} renderBadge={renderBadge} renderImageStatus={renderImageStatus} />
          <CheckInButton
            checkInStatus={checkInStatus}
            recordId={recordId}
            onCheckInSuccess={handleCheckInSuccess}
          />
          {checkInStatus === "Checked_in" && (
            <>
              <button
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
                onClick={() => window.open(`https://in2it-service.com/ifeat/photo/photo_capture.php?record_id=${recordId}`, "_blank")}
              >
                Take Photo
              </button>
              <button
                style={{
                  backgroundColor: "purple",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
                onClick={searchAirtableByRefId} // Trigger PDF regeneration
              >
                Refresh PDF
              </button>
              <PDFGenerator pdfReady={pdfReady} data={data} />
            </>
          )}
        </>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default App;
