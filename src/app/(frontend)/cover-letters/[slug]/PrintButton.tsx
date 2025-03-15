'use client'
import React from 'react'

export default function PrintButton() {
  const handlePrint = () => {
    // Simply trigger the print dialog - all styles are in print.css
    window.print()
  }

  return (
    <div className="flex justify-end mb-4 no-print">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm"
      >
        Print Cover Letter
      </button>
    </div>
  )
}
