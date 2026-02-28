"use client";
import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaHeadset, FaRobot } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import useStore from "@/utils/store";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import instance from "@/utils/instance";

const options = [
  { issue: "Product Defects", value: "Product Defects" },
  { issue: "Quality Issues", value: "Quality Issues" },
  { issue: "Incorrect Item", value: "Incorrect Item" },
  { issue: "Service Issues", value: "Service Issues" },
  { issue: "Product Not as Described", value: "Product Not as Described" },
  { issue: "Price Issues", value: "Price Issues" },
  { issue: "Packaging Issues", value: "Packaging Issues" },
  { issue: "Functionality Problems", value: "Functionality Problems" },
];

interface Issue {
  issue: string;
  issue_description: string;
  customer_name: string;
  customer_email: string;
}

interface data {
  issue: string;
  resolution: string;
  id: string;
  customer_name: string;
  customer_email: string;
  issue_description: string;
  resolution_description: string;
  confidence_score: number;
  date: string;
}

const CustomerSupport = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const { showModal, setShowModal } = useStore();
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<data>({
    issue: "",
    resolution: "",
    id: "",
    customer_name: "",
    customer_email: "",
    issue_description: "",
    resolution_description: "",
    confidence_score: 0,
    date: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      issue: "",
      customer_name: "Sample User",
      customer_email: "sampleuser@gmail.com",
      issue_description: "",
    },
  });

  const onSubmit = (data: Issue) => {
    setLoading(true);
    instance
      .post("/create", data)
      .then((res) => {
        setLoading(false);
        setShowResult(true);
        setResultData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    setIsOpen(showModal);
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
    setShowResult(false);
    setResultData({
      issue: "",
      resolution: "",
      id: "",
      customer_name: "",
      customer_email: "",
      issue_description: "",
      resolution_description: "",
      confidence_score: 0,
      date: "",
    });
    reset();
  };

  return (
    <div
      className={`${isOpen ? "fixed" : "hidden"} z-50 inset-0 flex items-center justify-center`}
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="glass-modal w-11/12 lg:w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-fade-in-up"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl btn-gradient">
              <FaHeadset className="text-white text-base" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Contact Support</p>
              <p className="text-slate-400 text-xs">We'll find the best resolution for you</p>
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
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Spinner loading={loading} height={30} width={4} color="#7c3aed" />
              <div className="text-center">
                <p className="text-white text-sm font-semibold">Analyzing your issue…</p>
                <p className="text-slate-400 text-xs mt-1">Our AI agent is finding the best resolution</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
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
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-200">Keybros Keyboard M3</p>
                    <IoMdClose className="text-slate-500 text-xs" />
                    <p className="text-sm text-slate-400">1</p>
                  </div>
                  <p className="text-base font-bold text-white">$100.00</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex-shrink-0">
                  Delivered
                </span>
              </div>

              {/* Result */}
              {showResult ? (
                <div className="flex flex-col gap-3 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <HiSparkles className="text-violet-400" />
                    <span className="text-xs font-semibold text-violet-400 tracking-wide uppercase">AI Resolution</span>
                  </div>

                  <div className="glass rounded-xl p-4 border border-violet-500/20" style={{ background: "rgba(124,58,237,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-semibold text-sm">Hi {resultData.customer_name || "there"},</p>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {resultData.resolution || "–"}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      After careful review, we have decided to {resultData.resolution_description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                      <p className="text-slate-500 text-xs">Regards</p>
                      <p className="text-slate-300 text-xs font-medium">Team Customer Support</p>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="btn-gradient w-full text-white text-sm font-semibold py-3 rounded-xl"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  {/* Advanced toggle */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setAdvanced(!advanced)}
                      className="text-violet-400 text-xs font-medium hover:text-violet-300 transition-colors"
                    >
                      {advanced ? "Hide" : "Show"} Advanced Details
                    </button>
                  </div>

                  {advanced && (
                    <div className="glass rounded-xl p-4 border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-400">Customer Name</label>
                        <input
                          {...register("customer_name", { required: true })}
                          placeholder="Customer Name"
                          className="input-dark rounded-lg px-3 py-2 text-sm"
                        />
                        {errors.customer_name && <p className="text-rose-400 text-xs">Required</p>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-400">Customer Email</label>
                        <input
                          {...register("customer_email", { required: true })}
                          placeholder="Customer Email"
                          className="input-dark rounded-lg px-3 py-2 text-sm"
                        />
                        {errors.customer_email && <p className="text-rose-400 text-xs">Required</p>}
                      </div>
                    </div>
                  )}

                  {/* Issue select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Select Issue</label>
                    <select
                      {...register("issue", { required: true })}
                      className="input-dark rounded-xl px-3 py-2.5 text-sm appearance-none cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <option value="" style={{ background: "#0d0d16" }}>— Select an issue —</option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value} style={{ background: "#0d0d16", color: "#f1f5f9" }}>
                          {option.issue}
                        </option>
                      ))}
                    </select>
                    {errors.issue && <p className="text-rose-400 text-xs">Please select an issue</p>}
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Describe Your Issue</label>
                    <textarea
                      {...register("issue_description", { required: true })}
                      placeholder="Describe what went wrong in detail…"
                      rows={4}
                      className="input-dark rounded-xl px-3 py-2.5 text-sm resize-none"
                    />
                    {errors.issue_description && <p className="text-rose-400 text-xs">Please describe the issue</p>}
                  </div>

                  <button
                    type="submit"
                    className="btn-gradient w-full text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FaRobot className="text-base" />
                    Submit to AI Agent
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
