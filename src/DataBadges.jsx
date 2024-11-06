// DataBadges.js
import React from "react";

function DataBadges({ data, recordId, renderBadge, renderImageStatus }) {
  return (
    <div className="data-badges">
      {renderBadge("Record ID", recordId)}
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
  );
}

export default DataBadges;
