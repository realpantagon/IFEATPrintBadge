import axios from "axios";
import { useState } from "react";
import {
  BlobProvider,
} from "@react-pdf/renderer";
import { MyDocument } from './Document';

function App() {
  const [data, setData] = useState(null);
  const [refId, setRefId] = useState("IFEAT-");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const searchAirtableByRefId = async () => {
    try {
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
      setData(response.data.records[0]?.fields); // Use first record's fields for simplicity
    } catch (error) {
      console.error("Error fetching data:", error);
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

      {data ? (
        <BlobProvider document={<MyDocument data={data} />}>
          {({ blob, url, loading, error }) =>
            loading ? (
              <p>Loading document...</p>
            ) : (
              <button onClick={() => {
                if (url) {
                  window.location.href = url; // Opens the PDF in a new page
                }
              }}>Generate PDF</button>
            )
          }
        </BlobProvider>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default App;
