import axios from "axios";
import { useState } from "react";
import DataBadges from "./DataBadges";
import PDFGenerator from "./PDFGenerator";
import CheckInButton from "./CheckInButton";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null);
  
  // Single search term for smart search
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchAirtableByFields = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfReady(false);

      // Construct filter formula for smart search across all fields
      const formula = searchTerm
        ? `OR(
            SEARCH(LOWER("${searchTerm}"), LOWER({First Name})),
            SEARCH(LOWER("${searchTerm}"), LOWER({Last Name})),
            SEARCH(LOWER("${searchTerm}"), LOWER({Email})),
            SEARCH(LOWER("${searchTerm}"), LOWER({Position})),
            SEARCH(LOWER("${searchTerm}"), LOWER({Company})),
            SEARCH(LOWER("${searchTerm}"), LOWER({Phone}))
          )`
        : "";

      const response = await axios.get(
        `https://api.airtable.com/v0/app5cBH0nxzVUysXB/Registration`,
        {
          headers: {
            Authorization: `Bearer patqmneNITxUZMqvh.6428bde97139fccfde8876240fce3c9516d79b6b2484a180eb6e4e696661cde5`,
          },
          params: {
            filterByFormula: formula,
          },
        }
      );
      console.log("Response data:", response.data);

      const record = response.data.records[0];
      if (record && record.fields) {
        setData(record.fields);
        setRecordId(record.id);
        setPdfReady(true);
        setCheckInStatus(record.fields.Check_in);
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

  const handleCheckInSuccess = () => {
    setCheckInStatus("Checked_in");
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
    <div className="app-container">
      <input
        type="text"
        name="searchTerm"
        placeholder="Search across all fields"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={searchAirtableByFields}>Search</button>

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
                onClick={searchAirtableByFields}
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
