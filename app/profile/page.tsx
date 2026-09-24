'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { User, ShieldCheck, Mail, Phone, MapPin, Laptop, Smartphone, Check } from 'lucide-react'

export default function ProfilePage() {
  const { userProfile, linkedDevices } = useBanking()
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState(userProfile?.phone || '+1 (555) 234-5678')
  const [address, setAddress] = useState(userProfile?.address || '742 Evergreen Terrace, Suite 400, New York, NY 10001')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile & KYC Verification</h1>
            <p className="text-sm text-gray-500 mt-1">
              Legal identity details, compliance status, and authorized active hardware.
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 text-xs font-semibold rounded-xl self-start"
          >
            {editing ? 'Cancel' : 'Edit Contact Details'}
          </button>
        </div>

        {saved && (
          <div className="p-3 bg-green-100 border border-emerald-500/30 text-green-600 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile and contact information updated successfully.</span>
          </div>
        )}

        {/* KYC Verification Tier Banner */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Tier 2 Customer Due Diligence (CDD)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Government photo ID, SSN/TIN, and biometric selfie verified. Full daily transfer limits active ($100,000/day).
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details Form */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Legal Customer Identity
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 uppercase font-medium mb-1">Legal Full Name</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.name || ''}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium opacity-75 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase font-medium mb-1">Taxpayer ID / SSN</label>
                <input
                  type="text"
                  disabled
                  value="•••-••-4819 (Verified)"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono opacity-75 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={userProfile?.email || 'alex.morgan@crestlinecapital.com'}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium opacity-75 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase font-medium mb-1">Phone Number (SMS MFA)</label>
                <input
                  type="text"
                  disabled={!editing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium ${
                    editing ? 'focus:border-[#D71E28]' : 'opacity-75'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 uppercase font-medium mb-1">Residential Address</label>
              <input
                type="text"
                disabled={!editing}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium ${
                  editing ? 'focus:border-[#D71E28]' : 'opacity-75'
                }`}
              />
            </div>

            {editing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71E28] text-gray-900 font-bold text-xs rounded-xl hover:bg-[#A31620]"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Linked Devices & Sessions */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Authorized Hardware & Sessions
          </h3>

          <div className="space-y-3">
            {linkedDevices.map((dev) => (
              <div
                key={dev.id}
                className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-[#D71E28] flex items-center justify-center">
                    {dev.type === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-900">{dev.name}</span>
                      {dev.current && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-green-100 text-green-600 font-bold">
                          CURRENT SESSION
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {dev.location} • Last active: {dev.lastActive}
                    </span>
                  </div>
                </div>

                {!dev.current && (
                  <button
                    onClick={() => alert(`Revoked authorization for ${dev.name}. Session token invalidated.`)}
                    className="text-[11px] text-red-600 hover:text-red-300"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
