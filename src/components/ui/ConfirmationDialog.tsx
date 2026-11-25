import { Overlay } from './Overlay'
import { Button } from './Button'

interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmationDialogProps) {
  return (
    <Overlay
      open={open}
      onClose={onCancel}
      title={title}
      variant="modal"
      footer={<><Button onClick={onCancel}>Cancel</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></>}
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Overlay>
  )
}
