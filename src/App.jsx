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
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]); // Store all fetched records
  const [selectedRecord, setSelectedRecord] = useState(null); // Store selected record

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchAirtableByFields = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfReady(false);

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

      if (response.data.records.length > 0) {
        setRecords(response.data.records); // Set all records
        setSelectedRecord(null); // Clear previous selection
      } else {
        setRecords([]);
        setData(null);
        setCheckInStatus(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleRecordSelection = (record) => {
    setSelectedRecord(record);
    setData(record.fields);
    setRecordId(record.id);
    setCheckInStatus(record.fields.Check_in);
    setPdfReady(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchAirtableByFields(); // Trigger search on Enter key press
    }
  };
  
  return (
    <div className="app-container">
      <input
        type="text"
        name="searchTerm"
        placeholder="Search across all fields"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={searchAirtableByFields}>Search</button>

      {isGeneratingPDF ? (
        <div className="spinner"></div>
      ) : records.length > 0 && !selectedRecord ? (
        <div className="records-container">
          <h3 className="records-title">Select a record:</h3>
          <table className="records-table">
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => handleRecordSelection(record)}
                >
                  <td>
                    <span className="first-name">
                      {record.fields["First Name"]}
                    </span>{" "}
                    <span className="last-name">
                      {record.fields["Last Name"]}
                    </span>{" "}
                    {/* {record.fields["Last Name"]}  */}-{" "}
                    {record.fields.Company}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : data ? (
        <>
          <DataBadges data={data} recordId={recordId} />
          <CheckInButton
            checkInStatus={checkInStatus}
            recordId={recordId}
            onCheckInSuccess={() => setCheckInStatus("Checked_in")}
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
                onClick={() =>
                  window.open(
                    `https://in2it-service.com/ifeat/photo/new_photo_capture.php?record_id=${recordId}`,
                    "_blank"
                  )
                }
              >
                Take Photo
              </button>
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
