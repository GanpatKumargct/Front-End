import { AlertCircle } from 'lucide-react';

interface StageTransitionModalProps {
  type: 'forward' | 'backward';
  candidateName: string;
  fromStage: string;
  toStage: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StageTransitionModal({
  type,
  candidateName,
  fromStage,
  toStage,
  onConfirm,
  onCancel,
}: StageTransitionModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            {type === 'backward' && (
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                {type === 'forward' ? 'Stage Transition Confirmation' : 'Non-Standard Procedure'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {candidateName}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="space-y-4">
            {/* Stage Transition Info */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-muted/40 rounded font-medium text-foreground">
                  {fromStage}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-muted/40 rounded font-medium text-foreground">
                  {toStage}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="text-center">
              <p className="text-sm text-foreground leading-relaxed">
                {type === 'forward' ? (
                  'Confirmation to proceed to the next round for the candidate?'
                ) : (
                  <>
                    This is not the standard procedure,
                    <br />
                    Are you sure you want to proceed?
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/5">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground bg-muted/30 hover:bg-muted/40 border border-border rounded-lg transition-all duration-200"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-background bg-foreground hover:bg-foreground/90 rounded-lg transition-all duration-200 shadow-sm"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
