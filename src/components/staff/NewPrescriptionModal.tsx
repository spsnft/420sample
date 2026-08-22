"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { X, FilePlus } from "lucide-react"
import { createPrescription } from "@/app/staff/actions"
import { triggerHaptic } from "@/lib/utils"
import { DateField } from "./DateField"

const today = () => new Date().toISOString().slice(0, 10);

const inputClass =
  "w-full h-11 mt-1 px-3 rounded-button field-recessed border border-white/5 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50";
const labelClass = "text-[11px] font-black uppercase tracking-wide text-brand-light/40";

interface NewPrescriptionModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

export function NewPrescriptionModal({ clientId, clientName, onClose }: NewPrescriptionModalProps) {
  const router = useRouter();
  const [pt33Number, setPt33Number] = React.useState("");
  const [issueDate, setIssueDate] = React.useState(today());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const result = await createPrescription({ clientId, pt33Number, issueDate, doctor: "" });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    triggerHaptic("success");
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80" onClick={handleClose} />

      <div className="gradient-ring w-full max-w-md sm:rounded-modal rounded-t-modal shadow-2xl max-h-[90vh]">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full bg-brand-primary surface sm:rounded-modal rounded-t-modal p-6 pt-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 surface-row hover:brightness-110 active:translate-y-px rounded-full transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-black uppercase tracking-tight text-brand-light mb-1">New Prescription</h2>
        <p className="text-[12px] text-brand-light/50 mb-4">{clientName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>PT.33 number</label>
              <input required value={pt33Number} onChange={(e) => setPt33Number(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Issue date</label>
              <DateField required value={issueDate} onChange={setIssueDate} />
            </div>
          </div>

          {error && <p className="text-[12px] font-bold text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FilePlus size={18} />
            {isSubmitting ? "Adding…" : "Add Prescription"}
          </button>
        </form>
      </motion.div>
      </div>
    </div>
  );
}
