import axios from "axios";
import { useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { MyDocument } from "./Document";
import ErrorBoundary from "./ErrorBoundary";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [refId, setRefId] = useState("IFEAT-");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [qrMessage, setQrMessage] = useState(null); // Track QR message

  const searchAirtableByRefId = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfReady(false);

      const response = await axios.get(
        `https://api.airtable.com/v0/app5cBH0nxzVUysXB/Registration`,
        {
          headers: {
            Authorization: `Bearer YOUR_AIRTABLE_API_KEY`,
          },
          params: {
            filterByFormula: `{Ref_ID}="${refId}"`,
          },
        }
      );

      const record = response.data.records[0];
      if (record && record.fields) {
        setData(record.fields);
        setPdfReady(true);
      } else {
        setData(null);
        console.warn("No records found for the given Ref_ID.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith("IFEAT-")) {
      setRefId("IFEAT-" + value.replace("IFEAT-", ""));
    } else {
      setRefId(value);
    }
  };

  const handleScan = (result) => {
    if (Array.isArray(result) && result[0]?.rawValue) {
      // Extract rawValue from the first object in the result array
      const scannedText = result[0].rawValue;
      setQrMessage(`Scanned QR Code: ${scannedText}`);
      setRefId(scannedText); // Pre-fill the input with the scanned value
      setScanning(false); // Close the scanner after successful scan
    } else {
      console.warn("Invalid scan result:", result);
    }
  };

  const renderBadge = (label, value) => {
    let displayValue;

    if (value === undefined || value === null) {
      displayValue = <span style={{ color: "red" }}>No data</span>;
    } else if (typeof value === "string" || typeof value === "number") {
      displayValue = value;
    } else {
      displayValue = <span style={{ color: "red" }}>Invalid data</span>;
      console.error(`Invalid data for ${label}:`, value);
    }

    return (
      <span className="badge">
        <strong>{label}:</strong> {displayValue}
      </span>
    );
  };

  const renderImageStatus = (label, imageData) => {
    let hasImage = false;

    if (Array.isArray(imageData) && imageData[0]?.url) {
      hasImage = true;
    } else {
      if (imageData && imageData.error) {
        console.error(`Error loading image for ${label}:`, imageData.error);
      }
    }

    return (
      <span className="badge">
        <strong>{label}:</strong>{" "}
        {hasImage ? (
          <span style={{ color: "green" }}>✅</span>
        ) : (
          <span style={{ color: "red" }}>❌</span>
        )}
      </span>
    );
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchAirtableByRefId();
        }}
      >
        <input
          type="text"
          placeholder="Enter Reference ID"
          value={refId}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>

      {/* Divider indicating OR */}
      <div style={{ textAlign: "center", margin: "0 0", fontWeight: "bold" }}>
        OR
      </div>

      <button
        className="gradient-button"
        onClick={() => setScanning(!scanning)}
      >
        {scanning ? "Stop Scanning" : "Scan QR Code"}
      </button>

      {scanning && (
        <Scanner
          onScan={handleScan}
          onError={(error) => console.error(error)}
        />
      )}

      {/* Display scanned QR code message */}
      {qrMessage && (
        <p>
          <strong>{qrMessage}</strong>
        </p>
      )}

      {isGeneratingPDF ? (
        <div className="spinner"></div>
      ) : data ? (
        <>
          <div className="data-badges">
            {renderBadge("Ref ID", data.Ref_ID)}
            {renderBadge("First Name", data.Use_FNAME_Badge)}
            {renderBadge("Last Name", data.Use_LNAME_Badge)}
            {renderBadge("Position", data.Use_Position_Badge)}
            {renderBadge("Company", data.Use_Company_Badge)}
            {renderBadge("Country", data.Use_Country_Badge)}
            {renderImageStatus("QR Contact", data.QR_Contact)}
            {renderImageStatus("Background Type", data.BG_Type)}
            {renderImageStatus("Print", data.Print2)}
          </div>

          {pdfReady && (
            <ErrorBoundary>
              <BlobProvider document={<MyDocument data={data} />}>
                {({ blob, url, loading, error }) => {
                  if (error) {
                    console.error("PDF generation error:", error);
                    return (
                      <p style={{ color: "red" }}>
                        Error generating PDF, please try again later.
                      </p>
                    );
                  }
                  return loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <button
                      onClick={() => {
                        if (url) {
                          window.open(url, "_blank");
                        }
                      }}
                    >
                      Generate PDF
                    </button>
                  );
                }}
              </BlobProvider>
            </ErrorBoundary>
          )}
        </>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default App;
