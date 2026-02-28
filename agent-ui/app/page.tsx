"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaHeadset, FaRobot } from "react-icons/fa6";
import { FiGithub, FiPlay, FiEye } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import useStore from "@/utils/store";
import instance from "@/utils/instance";
import Spinner from "@/components/Spinner";

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

const resolutionBadgeClass = (resolution: string) => {
  const r = resolution?.toLowerCase();
  if (r?.includes("refund")) return "badge-refund";
  if (r?.includes("replacement")) return "badge-replacement";
  if (r?.includes("repair")) return "badge-repair";
  if (r?.includes("discount")) return "badge-discount";
  if (r?.includes("apology")) return "badge-apology";
  if (r?.includes("return")) return "badge-return";
  if (r?.includes("exchange")) return "badge-exchange";
  if (r?.includes("compensation")) return "badge-compensation";
  if (r?.includes("service")) return "badge-service";
  return "badge-default";
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-rose-400";
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<data>>([]);
  const { showModal, setShowModal, setShowView } = useStore();

  const getList = () => {
    setLoading(true);
    instance
      .get("/list")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (!showModal) {
      getList();
    }
  }, [showModal]);

  return (
    <main className="flex min-h-screen flex-col" style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif" }}>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="w-full flex flex-row justify-between items-center px-6 lg:px-10 py-4 glass border-b border-white/[0.06] sticky top-0 z-40">
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl btn-gradient">
            <FaRobot className="text-white text-base" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SupportAI
          </span>
          <span className="hidden sm:inline text-white/20 text-sm font-light ml-1">/ Customer Agent</span>
        </div>

        <div className="flex flex-row items-center gap-2">
          <a
            href="https://github.com/DhruvK278/customer-support-ai-agent"
            target="_blank"
            className="flex items-center gap-2 text-sm text-slate-300 px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition-all duration-200 border border-white/[0.06]"
          >
            <FiGithub className="text-base" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href=""
            className="flex items-center gap-2 text-sm text-slate-300 px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition-all duration-200 border border-white/[0.06]"
          >
            <FiPlay className="text-base" />
            <span className="hidden sm:inline">Demo</span>
          </a>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row flex-1 min-h-0">

        {/* Left — Order Panel */}
        <div className="flex flex-col items-center justify-center w-full xl:w-7/12 border-r border-white/[0.06] p-6 lg:p-10 min-h-[60vh] xl:min-h-0">
          <div className="w-full max-w-xl animate-fade-in-up">

            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <HiSparkles className="text-violet-400 text-sm" />
                <span className="text-violet-400 text-xs font-semibold tracking-widest uppercase">Demo Order</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                Customer Support AI Agent
              </h1>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                See how our AI Agent instantly triages customer complaints and recommends the best resolution — all in real time.
              </p>
            </div>

            {/* Order card */}
            <div className="glass glow-border rounded-2xl p-5 animate-pulse-glow">
              {/* Order meta row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-white/[0.06] mb-5">
                {[
                  { label: "Order ID", value: "#12345" },
                  { label: "Date", value: "12 Oct 2021" },
                  { label: "Total", value: "$100.00" },
                  { label: "Status", value: "Delivered", green: true },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.green ? "text-emerald-400" : "text-slate-200"}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Product row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden glass group flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Image
                      src="/keyboardimg.jpg"
                      fill
                      alt="Keybros Keyboard M3"
                      style={{ objectFit: 'contain' }}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-200">Keybros Keyboard M3</p>
                      <IoMdClose className="text-slate-500 text-xs" />
                      <p className="text-sm text-slate-400">1</p>
                    </div>
                    <p className="text-lg font-bold text-white mt-0.5">$100.00</p>
                    <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 w-fit">
                      ✓ Delivered
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="btn-gradient flex items-center gap-2.5 text-white text-sm font-semibold py-3 px-6 rounded-xl flex-shrink-0"
                >
                  <FaHeadset className="text-base" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right — AI Actions Panel */}
        <div className="flex flex-col w-full xl:w-5/12 p-6 lg:p-8 min-h-[40vh]">
          <div className="mb-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-400 text-xs font-semibold tracking-widest uppercase">Live Feed</span>
            </div>
            <h2 className="text-xl font-bold text-white">AI Agent Actions</h2>
            <p className="text-slate-400 text-xs mt-1">Past resolutions generated by the AI for customer queries.</p>
          </div>

          <div
            id="address"
            className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1"
            style={{ maxHeight: "calc(100vh - 240px)" }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <Spinner loading={loading} height={28} width={4} color="#7c3aed" />
                <p className="text-slate-500 text-xs">Fetching agent actions…</p>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 glass rounded-xl border border-white/[0.06]">
                <FaRobot className="text-slate-600 text-3xl" />
                <p className="text-slate-500 text-sm">No agent actions yet</p>
                <p className="text-slate-600 text-xs">Submit a support request to get started</p>
              </div>
            ) : (
              data.map((item, index) => (
                <div
                  key={index}
                  className="glass rounded-xl px-4 py-3 border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-200 animate-slide-right group"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    {/* Issue */}
                    <div className="flex flex-col min-w-0 w-[30%]">
                      <p className="text-xs text-slate-500 mb-0.5">Issue</p>
                      <p className="text-xs font-medium text-slate-300 truncate">{item.issue}</p>
                    </div>

                    {/* Resolution badge */}
                    <div className="flex flex-col w-[30%]">
                      <p className="text-xs text-slate-500 mb-0.5">Resolution</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${resolutionBadgeClass(item.resolution)}`}>
                        {item.resolution}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center w-[15%]">
                      <p className="text-xs text-slate-500 mb-0.5">Score</p>
                      <p className={`text-sm font-bold ${scoreColor(item.confidence_score)}`}>
                        {item.confidence_score}
                      </p>
                    </div>

                    {/* Eye button */}
                    <button
                      onClick={() => setShowView({ id: item.id, show: true })}
                      className="flex items-center justify-center w-8 h-8 rounded-lg glass border border-white/[0.06] text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-200 flex-shrink-0"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
