// RefIDInput.js
import React from "react";

function RefIDInput({ refId, handleInputChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
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
  );
}

export default RefIDInput;
