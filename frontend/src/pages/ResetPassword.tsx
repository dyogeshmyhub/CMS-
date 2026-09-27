import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react'

const DEMO_OTP = '482916'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(
    initialEmail ? `We sent a 6-digit code to ${initialEmail}.` : 'Enter your email to receive a reset code.',
  )
  const [isCodeSent, setIsCodeSent] = useState(Boolean(initialEmail))
  const [isComplete, setIsComplete] = useState(false)

  const handleSendCode = (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setMessage('Please enter your email address.')
      return
    }

    setMessage(`A 6-digit verification code was sent to ${trimmedEmail}.`)
    setEmail(trimmedEmail)
    setIsCodeSent(true)
  }

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault()

    if (!isCodeSent) {
      setMessage('Please request a reset code first.')
      return
    }

    if (otp !== DEMO_OTP) {
      setMessage('The verification code is invalid. Please use the demo code shown below.')
      return
    }

    if (newPassword.length < 8) {
      setMessage('Your password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.')
      return
    }

    setIsComplete(true)
    setMessage('Password reset successful. You can now sign in with your new password.')
  }

  if (isComplete) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Password updated</h1>
          <p className="mt-2 text-sm text-slate-500">{message}</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-bold text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Reset password</h1>
          <p className="mt-1 text-sm text-slate-500">Secure your account with a new password</p>
        </div>

        <div className="mb-5 rounded-xl border border-brand-100 bg-brand-50/40 p-3 text-xs text-brand-800">
          <p className="font-semibold">Demo verification code</p>
          <p className="mt-1 text-lg font-bold tracking-[0.25em] text-brand-700">{DEMO_OTP}</p>
        </div>

        {!isCodeSent ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-700"
            >
              <KeyRound className="h-4 w-4" /> Send reset code
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Verification code</label>
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">New password</label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Confirm password</label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-700"
            >
              <CheckCircle2 className="h-4 w-4" /> Update password
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
