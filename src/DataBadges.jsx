// DataBadges.js
import React from "react";

function DataBadges({ data, recordId }) {
  return (
    <div className="data-badges">
      <table className="data-table">
        <tbody>
          <tr>
            <td><strong>Record ID</strong></td>
            <td>{recordId || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Ref ID</strong></td>
            <td>{data.Ref_ID || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>First Name</strong></td>
            <td>{data.Use_FNAME_Badge || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Last Name</strong></td>
            <td>{data.Use_LNAME_Badge || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Position</strong></td>
            <td>{data.Use_Position_Badge || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Company</strong></td>
            <td>{data.Use_Company_Badge || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Country</strong></td>
            <td>{data.Use_Country_Badge || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{data.Email || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>Phone</strong></td>
            <td>{data.Phone || <span style={{ color: "red" }}>No data</span>}</td>
          </tr>
          <tr>
            <td><strong>QR Contact</strong></td>
            <td>{Array.isArray(data.QR_Contact) && data.QR_Contact[0]?.url ? "✅" : "❌"}</td>
          </tr>
          <tr>
            <td><strong>Background Type</strong></td>
            <td>{Array.isArray(data.BG_Type) && data.BG_Type[0]?.url ? "✅" : "❌"}</td>
          </tr>
          <tr>
            <td><strong>Photo</strong></td>
            <td>{Array.isArray(data.Photo) && data.Photo[0]?.url ? "✅" : "❌"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DataBadges;
