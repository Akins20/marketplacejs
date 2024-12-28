import React from "react";

function DropdownMenu({ onCreateAppointment, onReportConversation }) {
  return (
    <div className="absolute right-4 top-12 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow-lg">
      <button
        onClick={onCreateAppointment}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Create Appointment
      </button>
      <button
        onClick={onReportConversation}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Report Conversation
      </button>
    </div>
  );
}

export default DropdownMenu;
