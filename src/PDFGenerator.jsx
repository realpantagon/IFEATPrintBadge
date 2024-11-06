// PDFGenerator.js
import React from "react";
import { BlobProvider } from "@react-pdf/renderer";
import ErrorBoundary from "./ErrorBoundary";
import { MyDocument } from "./Document";

function PDFGenerator({ pdfReady, data }) {
  return (
    pdfReady && (
      <ErrorBoundary>
        <BlobProvider document={<MyDocument data={data} />}>
          {({ blob, url, loading, error }) => {
            if (error) {
              console.error("PDF generation error:", error);
              return <p style={{ color: "red" }}>Error generating PDF, please try again later.</p>;
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
    )
  );
}

export default PDFGenerator;
