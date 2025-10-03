"use client"

import { useState } from 'react'

export default function QuickLoanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const formData = new FormData(event.target)

    try {
      const response = await fetch('/api/quickloan/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      // If OAuth is required, redirect user to Google's consent screen
      if (!response.ok && response.status === 401 && result?.authUrl) {
        window.location.href = result.authUrl
        return
      }

      if (result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Loan application submitted successfully!' 
        })
        event.target.reset()
        setShowSuccessModal(true)
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.error || 'Submission failed. Please try again.' 
        })
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Quick Loan Application</h1>
          <p className="text-sm text-gray-600">Fill in your details and upload required documents</p>
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Personal Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Customer Complete Name <span className="text-red-500">*</span></span>
                <input 
                  name="customerName" 
                  type="text" 
                  placeholder="Enter your full name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Father Name <span className="text-red-500">*</span></span>
                <input 
                  name="fatherName" 
                  type="text" 
                  placeholder="Enter father's full name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Mother Name <span className="text-red-500">*</span></span>
                <input 
                  name="motherName" 
                  type="text" 
                  placeholder="Enter mother's full name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Customer Marital Status <span className="text-red-500">*</span></span>
                <select 
                  name="maritalStatus" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Wife/Husband Name</span>
                <input 
                  name="spouseName" 
                  type="text" 
                  placeholder="Enter spouse name" 
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Customer Contact Number <span className="text-red-500">*</span></span>
                <input 
                  name="contactNumber" 
                  type="tel" 
                  placeholder="Enter contact number" 
                  required
                  pattern="[0-9]{10}"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Alternative Contact Number</span>
                <input 
                  name="altContactNumber" 
                  type="tel" 
                  placeholder="Enter alternative number" 
                  pattern="[0-9]{10}"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Customer Highest Education <span className="text-red-500">*</span></span>
                <input 
                  name="highestEducation" 
                  type="text" 
                  placeholder="Enter highest education" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Institution Name <span className="text-red-500">*</span></span>
                <input 
                  name="institutionName" 
                  type="text" 
                  placeholder="Enter institution name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Personal Mail ID <span className="text-red-500">*</span></span>
                <input 
                  name="personalEmail" 
                  type="email" 
                  placeholder="Enter personal email" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Official Mail ID</span>
                <input 
                  name="officialEmail" 
                  type="email" 
                  placeholder="Enter official email" 
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-600">Complete Current Address (With PIN Code and Landmark) <span className="text-red-500">*</span></span>
                <textarea 
                  name="currentAddress" 
                  rows={3} 
                  placeholder="Enter your complete current address" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-600">Complete Permanent Address (With PIN Code and Landmark) <span className="text-red-500">*</span></span>
                <textarea 
                  name="permanentAddress" 
                  rows={3} 
                  placeholder="Enter your complete permanent address" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-600">Complete Office Address (With PIN Code and Landmark) <span className="text-red-500">*</span></span>
                <textarea 
                  name="officeAddress" 
                  rows={3} 
                  placeholder="Enter your complete office address" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Employment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Company Name <span className="text-red-500">*</span></span>
                <input 
                  name="companyName" 
                  type="text" 
                  placeholder="Enter company name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Date of Joining <span className="text-red-500">*</span></span>
                <input 
                  name="dateOfJoining" 
                  type="date" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Current Designation <span className="text-red-500">*</span></span>
                <input 
                  name="designation" 
                  type="text" 
                  placeholder="Enter your designation" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Total Work Experience <span className="text-red-500">*</span></span>
                <input 
                  name="totalWorkExp" 
                  type="text" 
                  placeholder="e.g., 5 years 3 months" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
            </div>
          </div>

          {/* References */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">References</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Reference 1: Name <span className="text-red-500">*</span></span>
                <input 
                  name="ref1Name" 
                  type="text" 
                  placeholder="Enter reference name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Reference 1: Contact Number <span className="text-red-500">*</span></span>
                <input 
                  name="ref1Contact" 
                  type="tel" 
                  placeholder="Enter reference contact" 
                  required
                  pattern="[0-9]{10}"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-600">Reference 1: Address <span className="text-red-500">*</span></span>
                <textarea 
                  name="ref1Address" 
                  rows={2} 
                  placeholder="Enter reference address" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Reference 2: Name <span className="text-red-500">*</span></span>
                <input 
                  name="ref2Name" 
                  type="text" 
                  placeholder="Enter reference name" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Reference 2: Contact Number <span className="text-red-500">*</span></span>
                <input 
                  name="ref2Contact" 
                  type="tel" 
                  placeholder="Enter reference contact" 
                  required
                  pattern="[0-9]{10}"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-600">Reference 2: Address <span className="text-red-500">*</span></span>
                <textarea 
                  name="ref2Address" 
                  rows={2} 
                  placeholder="Enter reference address" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Loan Amount required <span className="text-red-500">*</span></span>
                <input 
                  name="loanAmount" 
                  type="text" 
                  placeholder="Enter loan amount" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Loan Tenure Required <span className="text-red-500">*</span></span>
                <input 
                  name="loanTenure" 
                  type="text" 
                  placeholder="e.g., 36 months" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-600">Purpose of Loan <span className="text-red-500">*</span></span>
                <textarea 
                  name="loanPurpose" 
                  rows={3} 
                  placeholder="Describe the purpose of your loan" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
            </div>
          </div>

          {/* Upload Documents */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Aadhar Card <span className="text-red-500">*</span></span>
                <input 
                  name="aadhar" 
                  type="file" 
                  accept="image/*,application/pdf" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">PAN Card <span className="text-red-500">*</span></span>
                <input 
                  name="pan" 
                  type="file" 
                  accept="image/*,application/pdf" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Salary Slip (last 3 months) <span className="text-red-500">*</span></span>
                <input 
                  name="salarySlips" 
                  type="file" 
                  accept="image/*,application/pdf" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">One Year Bank Statement (till date) <span className="text-red-500">*</span></span>
                <input 
                  name="bankStatement" 
                  type="file" 
                  accept="image/*,application/pdf" 
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`rounded-full font-semibold px-8 py-3 transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quick Loan Request'}
            </button>
          </div>
        </form>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Submission Complete</h3>
              <p className="mt-2 text-sm text-gray-600">Your quick loan application has been submitted successfully.</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}