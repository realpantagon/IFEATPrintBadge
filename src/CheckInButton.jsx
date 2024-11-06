// CheckInButton.js
import React from "react";
import axios from "axios";

function CheckInButton({ checkInStatus, recordId, onCheckInSuccess }) {
  const isCheckedIn = checkInStatus === "Checked_in";

  const handleCheckIn = async () => {
    if (isCheckedIn || !recordId) return;

    try {
      const response = await axios.patch(
        `https://api.airtable.com/v0/app5cBH0nxzVUysXB/Registration`,
        {
          records: [
            {
              id: recordId,
              fields: {
                Check_in: "Checked_in",
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer patqmneNITxUZMqvh.6428bde97139fccfde8876240fce3c9516d79b6b2484a180eb6e4e696661cde5`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onCheckInSuccess(); // Callback to update the UI after successful check-in
      }
    } catch (error) {
      console.error("Error updating check-in status:", error);
    }
  };

  const buttonStyle = {
    backgroundColor: isCheckedIn ? "green" : "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: isCheckedIn ? "default" : "pointer",
  };

  return (
    <button style={buttonStyle} onClick={handleCheckIn} disabled={isCheckedIn}>
      {isCheckedIn ? "Checked In" : "Not Checked In"}
    </button>
  );
}

export default CheckInButton;
