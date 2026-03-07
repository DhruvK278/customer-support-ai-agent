"use client";
import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FiUser, FiMail, FiAlertCircle, FiCheckCircle, FiEdit3 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import useStore from "@/utils/store";
import Image from "next/image";
import instance from "@/utils/instance";
import Spinner from "./Spinner";

interface data {
  issue: string;
  resolution: string;
  id: string;
  customer_name: string;
  customer_email: string;
  issue_description: string;
  resolution_description: string;
  confidence_score: number;
  status: string;
  date: string;
}

const resolutionOptions = [
  "Refund",
  "Replacement",
  "Repair",
  "Discount",
  "Apology",
  "Return",
  "Exchange",
  "Compensation",
  "Service Enhancement",
];

const scoreGradient = (score: number) => {
  if (score >= 80) return "from-emerald-500 to-teal-400";
  if (score >= 60) return "from-yellow-500 to-amber-400";
  return "from-rose-500 to-red-400";
};

const scoreLabel = (score: number) => {
  if (score >= 80) return { text: "High Confidence", color: "text-emerald-400" };
  if (score >= 60) return { text: "Moderate", color: "text-yellow-400" };
  return { text: "Low Confidence", color: "text-rose-400" };
};

const ViewTickets = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showView, setShowView } = useStore();
  const [data, setData] = useState<data>({
    issue: "",
    resolution: "",
    id: "",
    customer_name: "",
    customer_email: "",
    issue_description: "",
    resolution_description: "",
    confidence_score: 0,
    status: "",
    date: "",
  });

  // Override form state
  const [overrideResolution, setOverrideResolution] = useState("");
  const [overrideDescription, setOverrideDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getRunData = (id: string) => {
    setLoading(true);
    instance
      .get(`/run/${id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
        setOverrideResolution(res.data.resolution || "");
        setOverrideDescription(res.data.resolution_description || "");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    setIsOpen(showView.show);
    if (showView.show) {
      getRunData(showView.id);
    }
  }, [showView.show]);

  const handleClose = () => {
    setShowView({ id: "", show: false });
  };

  const handleOverrideSubmit = () => {
    setSubmitting(true);
    instance
      .put(`/update/${data.id}`, {
        resolution: overrideResolution,
        resolution_description: overrideDescription,
      })
      .then((res) => {
        setSubmitting(false);
        setData(res.data);
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  };

  const sl = scoreLabel(data.confidence_score);

  return (
    <div
      className={`${isOpen ? "fixed" : "hidden"} z-50 inset-0 flex items-center justify-center`}
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="glass-modal w-11/12 lg:w-[580px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-fade-in-up"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl btn-gradient">
              <HiSparkles className="text-white text-base" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Ticket Summary</p>
              <p className="text-slate-400 text-xs">AI-generated resolution details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner loading={loading} height={30} width={4} color="#7c3aed" />
              <p className="text-slate-400 text-sm">Loading ticket details…</p>
            </div>
          ) : (
            <>
              {/* Order snippet */}
              <div className="flex items-center gap-3 glass rounded-xl p-3 border border-white/[0.06]">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 glass">
                  <Image
                    src="/keyboardimg.jpg"
                    fill
                    alt="product-image"
                    style={{ objectFit: 'contain' }}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Your Order</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-200">Keybros Keyboard M3</p>
                    <IoMdClose className="text-slate-500 text-xs" />
                    <p className="text-sm text-slate-400">1</p>
                  </div>
                  <p className="text-base font-bold text-white">$100.00</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="glass rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Customer Information</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                  <div className="flex items-start gap-2.5 p-4 bg-transparent" style={{ background: "rgba(13,13,22,0.6)" }}>
                    <FiUser className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="text-sm font-medium text-slate-200 mt-0.5">{data.customer_name || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-4" style={{ background: "rgba(13,13,22,0.6)" }}>
                    <FiMail className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-200 mt-0.5 break-all">{data.customer_email || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complaint */}
              <div className="glass rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-amber-400 text-xs" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Complaint Raised</p>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3" style={{ background: "rgba(13,13,22,0.6)" }}>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Issue Type</p>
                    <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                      {data.issue || "—"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Description</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{data.issue_description || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Resolution */}
              <div className="glass rounded-xl border border-violet-500/20 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-violet-500/15" style={{ background: "rgba(124,58,237,0.08)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-violet-400 text-xs" />
                      <p className="text-xs font-semibold text-violet-300 uppercase tracking-wide">Agent Resolution</p>
                    </div>
                    {/* Status badge */}
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${data.status === "Auto-Resolved"
                          ? "status-auto-resolved"
                          : data.status === "Pending Review"
                            ? "status-pending-review"
                            : data.status === "Manually Resolved"
                              ? "status-manually-resolved"
                              : "badge-default"
                        }`}
                    >
                      {data.status || "—"}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3" style={{ background: "rgba(13,13,22,0.6)" }}>

                  {/* If Pending Review → show editable override form */}
                  {data.status === "Pending Review" ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <FiEdit3 className="text-amber-400 text-xs" />
                        <p className="text-xs font-semibold text-amber-400">Manual Override Required</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1">Resolution Type</p>
                        <select
                          value={overrideResolution}
                          onChange={(e) => setOverrideResolution(e.target.value)}
                          className="input-dark rounded-lg px-3 py-2 text-sm w-full appearance-none cursor-pointer"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          {resolutionOptions.map((opt) => (
                            <option key={opt} value={opt} style={{ background: "#0d0d16", color: "#f1f5f9" }}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1">Resolution Description</p>
                        <textarea
                          value={overrideDescription}
                          onChange={(e) => setOverrideDescription(e.target.value)}
                          rows={3}
                          className="input-dark rounded-lg px-3 py-2 text-sm w-full resize-none"
                          placeholder="Describe the resolution..."
                        />
                      </div>

                      <button
                        onClick={handleOverrideSubmit}
                        disabled={submitting}
                        className="btn-gradient w-full text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Override"}
                      </button>
                    </>
                  ) : (
                    /* Read-only view for Auto-Resolved / Manually Resolved */
                    <>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Resolution Type</p>
                        <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                          {data.resolution || "—"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Description</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{data.resolution_description || "—"}</p>
                      </div>
                    </>
                  )}

                  {/* Confidence bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${sl.color}`}>{sl.text}</span>
                        <span className={`text-sm font-bold ${sl.color}`}>{data.confidence_score}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${scoreGradient(data.confidence_score)} animate-bar-fill`}
                        style={{
                          "--bar-width": `${data.confidence_score}%`,
                          width: `${data.confidence_score}%`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTickets;
