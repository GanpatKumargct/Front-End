import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ReferralConfirmationProps {
  type: 'success' | 'duplicate';
  onReturn: () => void;
}

export function ReferralConfirmation({ type, onReturn }: ReferralConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          {type === 'success' ? (
            <>
              <div className="flex justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <p className="text-sm text-foreground">
                  Thank you for your referral
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <p className="text-sm text-foreground">
                  The candidate has successfully is having for that role
                </p>
              </div>
            </>
          )}
        </div>

        {/* Return Button */}
        <button
          onClick={onReturn}
          className="px-6 py-2.5 bg-foreground/10 hover:bg-foreground/15 text-foreground text-sm font-medium rounded-lg transition-all duration-200"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
