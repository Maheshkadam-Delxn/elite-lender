"use client"

import { useEffect, useRef, useState } from 'react'

export default function QuickLoanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showUpload, setShowUpload] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState({ aadhar: null, pan: null, salarySlips: null, bankStatement: null })
  // Runtime input sanitizers
  const handleDigitInput = (maxLen) => (e) => {
    const digitsOnly = (e.target.value || '').replace(/\D/g, '').slice(0, maxLen)
    e.target.value = digitsOnly
  }
  const handleNameInput = (e) => {
    const lettersOnly = (e.target.value || '').replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ')
    e.target.value = lettersOnly
  }
  const MAX_PER_FILE_BYTES = 3 * 1024 * 1024 // 3 MB per file
  const MAX_TOTAL_BYTES = 12 * 1024 * 1024 // 12 MB total across all files
  const onFileChange = (key, fileList) => {
    try {
      const file = fileList && fileList.length > 0 ? fileList[0] : null
      if (file && file.size > MAX_PER_FILE_BYTES) {
        setSubmitStatus({ type: 'error', message: `File too large: ${file.name}. Max ${Math.floor(MAX_PER_FILE_BYTES/1024/1024)} MB per file.` })
        // Reset the input value
        const form = formRef.current
        const input = form?.elements?.namedItem(key)
        if (input) input.value = ''
        setSelectedFiles((prev) => ({ ...prev, [key]: null }))
        return
      }
      const name = file ? file.name : null
      setSelectedFiles((prev) => ({ ...prev, [key]: name }))
    } catch (_) {}
  }
  // Network helpers for mobile robustness
  const fetchWithTimeout = async (url, options = {}, timeoutMs = 60000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' })
      return resp
    } finally {
      clearTimeout(id)
    }
  }
  const submitWithRetry = async (formData, maxRetries = 1) => {
    let attempt = 0
    let lastError = null
    while (attempt <= maxRetries) {
      try {
        if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
          throw new Error('You appear to be offline. Please check your internet connection.')
        }
        const response = await fetchWithTimeout('/api/quickloan/submit', { method: 'POST', body: formData }, 60000)
        return response
      } catch (err) {
        lastError = err
        const transient = err?.name === 'AbortError' || err instanceof TypeError
        if (!transient || attempt === maxRetries) {
          throw err
        }
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        attempt += 1
      }
    }
    throw lastError
  }
  const formRef = useRef(null)
  const uploadSectionRef = useRef(null)

  const CACHE_KEY = 'quickloanFormCache'
  const OAUTH_DONE_KEY = 'quickloanOAuthDone'
  const oauthPopupRef = useRef(null)
  const autoSubmitRef = useRef(false)

  const saveFormToCache = (formData) => {
    try {
      const entries = {}
      for (const [key, value] of formData.entries()) {
        // Skip files
        if (value instanceof File) continue
        entries[key] = value
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries))
    } catch (_) { /* ignore */ }
  }

  const restoreFormFromCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return false
      const data = JSON.parse(raw || '{}') || {}
      const form = formRef.current
      if (!form) return false
      let restored = false
      Object.keys(data).forEach((name) => {
        const el = form.elements.namedItem(name)
        if (!el) return
        // Handle multiple elements with same name (e.g., radios)
        if (el instanceof RadioNodeList) {
          for (let i = 0; i < el.length; i++) {
            if (el[i].value === data[name]) {
              el[i].checked = true
              restored = true
              break
            }
          }
          return
        }
        if (el && el.type !== 'file') {
          el.value = data[name]
          restored = true
        }
      })
      if (restored) {
        setSubmitStatus({
          type: 'error',
          message: 'Reopened after Google auth. Please reattach files and submit.'
        })
      }
      return restored
    } catch (_) {
      return false
    }
  }

  const clearCache = () => {
    try { localStorage.removeItem(CACHE_KEY) } catch (_) {}
  }

  useEffect(() => {
    // Try to restore cached values after returning from OAuth
    restoreFormFromCache()

    // If this window is the OAuth popup after redirect back to our origin, signal done and close
    try {
      if (typeof window !== 'undefined' && window.opener && window.name === 'oauthWindow') {
        localStorage.setItem(OAUTH_DONE_KEY, String(Date.now()))
        window.close()
      }
    } catch (_) {}

    // Listen for OAuth completion in the opener window
    const onStorage = (e) => {
      if (e.key === OAUTH_DONE_KEY && e.newValue) {
        // Clear the signal and auto-submit the form with existing data and files
        try { localStorage.removeItem(OAUTH_DONE_KEY) } catch (_) {}
        if (oauthPopupRef.current && !oauthPopupRef.current.closed) {
          try { oauthPopupRef.current.close() } catch (_) {}
        }
        // After OAuth, show the upload section and prompt to attach files
        setShowUpload(true)
        setSubmitStatus({
          type: 'error',
          message: 'Google auth complete. Please attach all required documents to continue.'
        })
        if (uploadSectionRef.current) {
          uploadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
    window.addEventListener('storage', onStorage)
    const onOnline = () => setSubmitStatus((prev) => prev && prev.type === 'error' ? null : prev)
    const onOffline = () => setSubmitStatus({ type: 'error', message: 'You are offline. Please reconnect to submit the form.' })
    try { window.addEventListener('online', onOnline); window.addEventListener('offline', onOffline) } catch (_) {}
    return () => { try { window.removeEventListener('storage', onStorage); window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) } catch (_) {} }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const formData = new FormData(event.target)

    // After OAuth, require all files before allowing submission + validate size limits
    if (showUpload) {
      const form = formRef.current
      const aadhar = form?.elements?.namedItem('aadhar')
      const pan = form?.elements?.namedItem('pan')
      const salarySlips = form?.elements?.namedItem('salarySlips')
      const bankStatement = form?.elements?.namedItem('bankStatement')

      const missingFiles = !(
        aadhar && aadhar.files && aadhar.files.length > 0 &&
        pan && pan.files && pan.files.length > 0 &&
        salarySlips && salarySlips.files && salarySlips.files.length > 0 &&
        bankStatement && bankStatement.files && bankStatement.files.length > 0
      )

      if (missingFiles) {
        setIsSubmitting(false)
        setSubmitStatus({
          type: 'error',
          message: 'Please attach all required documents before submitting.'
        })
        if (uploadSectionRef.current) {
          uploadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        return
      }

      // Size validations: per file and total
      const files = [aadhar.files[0], pan.files[0], salarySlips.files[0], bankStatement.files[0]]
      const tooLarge = files.find(f => f && f.size > MAX_PER_FILE_BYTES)
      const totalSize = files.reduce((sum, f) => sum + (f?.size || 0), 0)
      if (tooLarge) {
        setIsSubmitting(false)
        setSubmitStatus({ type: 'error', message: `File too large: ${tooLarge.name}. Max ${Math.floor(MAX_PER_FILE_BYTES/1024/1024)} MB per file.` })
        if (uploadSectionRef.current) uploadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (totalSize > MAX_TOTAL_BYTES) {
        setIsSubmitting(false)
        setSubmitStatus({ type: 'error', message: `Total upload too large (${(totalSize/1024/1024).toFixed(1)} MB). Max ${(MAX_TOTAL_BYTES/1024/1024)} MB total.` })
        if (uploadSectionRef.current) uploadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    try {
      const response = await submitWithRetry(formData, 1)

      let result
      try {
        result = await response.json()
      } catch (_) {
        const text = await response.text().catch(() => '')
        result = { success: response.ok, error: text || 'Unexpected server response' }
      }

      // If OAuth is required, redirect user to Google's consent screen
      if (!response.ok && response.status === 401 && result?.authUrl) {
        // Persist non-file fields just in case
        saveFormToCache(formData)
        // Mobile-first: do full-page redirect on mobile; desktop tries popup then falls back to redirect
        const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')
        if (isMobile) {
          window.location.href = result.authUrl
          return
        }
        // Desktop: try popup; if blocked, redirect
        const w = 500, h = 700
        const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2)
        const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2)
        oauthPopupRef.current = window.open(
          result.authUrl,
          'oauthWindow',
          `popup=yes,width=${w},height=${h},top=${Math.max(0, y)},left=${Math.max(0, x)}`
        )
        if (!oauthPopupRef.current) {
          window.location.href = result.authUrl
          return
        }
        // Fallback polling in case storage event is missed
        const poll = setInterval(() => {
          try {
            if (oauthPopupRef.current && oauthPopupRef.current.closed) {
              clearInterval(poll)
              return
            }
            // When popup navigates back to our origin, we can detect and trigger storage signal
            if (oauthPopupRef.current && oauthPopupRef.current.location && oauthPopupRef.current.location.origin === window.location.origin) {
              localStorage.setItem(OAUTH_DONE_KEY, String(Date.now()))
            }
          } catch (_) {
            // Ignore cross-origin access errors until it returns to our origin
          }
        }, 500)
        return
      }

      if (result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Loan application submitted successfully!' 
        })
        event.target.reset()
        clearCache()
        autoSubmitRef.current = false
        setShowSuccessModal(true)
      } else {
        const message = result?.error || result?.message || (!response.ok ? `Request failed (${response.status})` : 'Submission failed. Please try again.')
        setSubmitStatus({ 
          type: 'error', 
          message
        })
      }
    } catch (error) {
      const message = error?.message === 'Failed to fetch'
        ? 'Network error. Please check your internet connection and try again.'
        : (error?.name === 'AbortError' ? 'Request timed out. Please retry on a stable connection.' : (error?.message || 'Network error. Please try again.'))
      setSubmitStatus({ 
        type: 'error', 
        message
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

        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
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
                  onInput={handleNameInput}
                  pattern={"[A-Za-z ]+"}
                  title="Only letters and spaces are allowed"
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
                  onInput={handleNameInput}
                  pattern={"[A-Za-z ]+"}
                  title="Only letters and spaces are allowed"
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
                  onInput={handleNameInput}
                  pattern={"[A-Za-z ]+"}
                  title="Only letters and spaces are allowed"
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
                  onInput={handleNameInput}
                  pattern={"[A-Za-z ]+"}
                  title="Only letters and spaces are allowed"
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
                  onInput={handleDigitInput(10)}
                  pattern={"^\\d{10}$"}
                  maxLength={10}
                  inputMode="numeric"
                  title="Enter exactly 10 digits"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Alternative Contact Number</span>
                <input 
                  name="altContactNumber" 
                  type="tel" 
                  placeholder="Enter alternative number" 
                  onInput={handleDigitInput(10)}
                  pattern={"^\\d{10}$"}
                  maxLength={10}
                  inputMode="numeric"
                  title="Enter exactly 10 digits"
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
                  pattern={".*@.*"}
                  title="Email must contain @"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Official Mail ID</span>
                <input 
                  name="officialEmail" 
                  type="email" 
                  placeholder="Enter official email" 
                  pattern={".*@.*"}
                  title="Email must contain @"
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
                  onInput={handleNameInput}
                  pattern={"[A-Za-z ]+"}
                  title="Only letters and spaces are allowed"
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
                  onInput={handleDigitInput(10)}
                  pattern={"^\\d{10}$"}
                  maxLength={10}
                  inputMode="numeric"
                  title="Enter exactly 10 digits"
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
                  onInput={handleNameInput}
                  pattern={"[A-Za-z ]+"}
                  title="Only letters and spaces are allowed"
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
                  onInput={handleDigitInput(10)}
                  pattern={"^\\d{10}$"}
                  maxLength={10}
                  inputMode="numeric"
                  title="Enter exactly 10 digits"
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
                  onInput={handleDigitInput(20)}
                  pattern={"^\\d{1,20}$"}
                  maxLength={20}
                  inputMode="numeric"
                  title="Enter digits only (max 20)"
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
          {showUpload && (
          <div ref={uploadSectionRef} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Aadhar Card <span className="text-red-500">*</span></span>
                <input 
                  name="aadhar" 
                  type="file" 
                  accept="image/*,application/pdf" 
                  required
                  onChange={(e) => onFileChange('aadhar', e.target.files)}
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
                  onChange={(e) => onFileChange('pan', e.target.files)}
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
                  onChange={(e) => onFileChange('salarySlips', e.target.files)}
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
                  onChange={(e) => onFileChange('bankStatement', e.target.files)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </label>
            </div>
          </div>
          )}

          {showUpload && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
            <div className="font-semibold mb-1">Selected Documents</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aadhar: {selectedFiles.aadhar || 'Not selected'}</li>
              <li>PAN: {selectedFiles.pan || 'Not selected'}</li>
              <li>Salary Slips: {selectedFiles.salarySlips || 'Not selected'}</li>
              <li>Bank Statement: {selectedFiles.bankStatement || 'Not selected'}</li>
            </ul>
          </div>
          )}

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