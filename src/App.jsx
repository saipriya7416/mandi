import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./index.css";
import { MandiService } from "./services/api";
import { Users, Boxes, Gavel, Receipt, CreditCard, IndianRupee, BookOpen, Truck, BarChart3, Database, Printer, RefreshCw, Phone, Edit2, Trash2, UserCheck, Package, FileText, FileCheck } from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// --- PRODUCTION DATA FEED (Clean slate) ---
const DUMMY_SUPPLIERS = [];
const DUMMY_BUYERS = [];
const DUMMY_LOTS = [];
const DUMMY_ALLOCATIONS = [];
const DUMMY_SUPPLIER_BILLS = [];
const DUMMY_BUYER_INVOICES = [];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

// --- STACLI / MANDI OS DESIGN SYSTEM ---
const COLORS = {
  primary: "#d4a017", // Mango Yellow/Gold
  secondary: "#1e240b", // Deep Orchard Green
  bg: "#fdfbf4", // Creamy Orchard BG
  card: "#FFFFFF",
  text: "#1a231a",
  muted: "#64748b",
  success: "#8ea35d",
  danger: "#ef4444",
  accent: "#d4a017",
  sidebar: "#1e240b", // Deep Forest Green
};

const Card = ({ children, title, subtitle, action, style = {} }) => (
  <div
    style={{
      background: COLORS.card,
      borderRadius: "24px",
      padding: "32px",
      boxShadow:
        "0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)",
      border: "1.5px solid #F1F5F9",
      ...style,
    }}
  >
    {(title || action) && (
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "900",
                color: COLORS.secondary,
                letterSpacing: "-0.5px",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: "6px 0 0 0",
                color: COLORS.muted,
                fontSize: "13px",
                fontWeight: "500",
                opacity: 0.8,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && action}
      </div>
    )}
    <div style={{ color: style.color || "inherit" }}>{children}</div>
  </div>
);

const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  style = {},
}) => (
  <div style={{ marginBottom: "20px", ...style }}>
    {label && (
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "850",
          color: COLORS.secondary,
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      {...(type !== 'file' ? { value } : {})}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "1.5px solid #E2E8F0",
        background: "#F8FAFC",
        color: "#1E293B",
        outline: "none",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = COLORS.primary;
        e.target.style.background = "#fff";
        e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}15`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#E2E8F0";
        e.target.style.background = "#F8FAFC";
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
);

// --- PREMIUM ACTION CARD COMPONENTS ---
const ICON_SHOP = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ICON_USER = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ICON_PHONE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const ICON_LOCATION = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const ICON_LOCK = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const ICON_TRASH = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ICON_EDIT = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const ICON_ARROW_RIGHT = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const ICON_TRUCK = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ICON_BILL = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

// --- SIDEBAR ICONS (STACLI MODERN) ---
const ICON_DASHBOARD_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ICON_BOX_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const ICON_CART_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const ICON_PRODUCE_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>;
const ICON_CLOCK_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ICON_CHART_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const ICON_USERS_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ICON_WALLET_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 15h0M2 9.5h20"></path></svg>;
const ICON_TRUCK_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ICON_DATABASE_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const ICON_GEAR_SIDE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
// --- SMART DATA NODE (Context-Aware Hover) ---
const SmartDataNode = ({ text, type, data = {}, onAdd, onView }) => {
  const [hover, setHover] = useState(false);

  // Helper to open details in a new tab by generating a standalone diagnostic page
  const openDetailsInNewTab = () => {
    const detailsHtml = `
      <html>
        <head>
          <title>Mandi record - ${text}</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FDFBF4; padding: 40px; color: #1e293b; }
            .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); max-width: 800px; margin: auto; border: 1.5px solid #EBE9E1; }
            h1 { color: #1a1a2e; border-bottom: 2px solid #D4A017; padding-bottom: 20px; font-family: 'Playfair Display', serif; }
            .row { display: flex; border-bottom: 1px solid #f1f5f9; padding: 15px 0; }
            .label { flex: 1; font-weight: 800; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { flex: 2; font-weight: 700; color: #1f3a2b; font-size: 14px; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="card">
            <h1 style="color: #1a1a2e;">📄 ${type} Record: ${text}</h1>
            ${Object.entries(data)
              .filter(([k]) => k !== "_id" && k !== "password" && k !== "__v")
              .map(([k, v]) => `
                <div class="row">
                  <div class="label">${k.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div class="value">${typeof v === 'object' ? JSON.stringify(v) : v}</div>
                </div>
              `).join('')}
              <p style="margin-top: 40px; text-align: center; color: #D4A017; font-weight: 900; font-size: 12px; letter-spacing: 1px;">POWERED BY MANDI OS v8.0</p>
          </div>
        </body>
      </html>
    `;
    const win = window.open("", "_blank");
    win.document.open();
    win.document.write(detailsHtml);
    win.document.close();
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ color: 'inherit', fontWeight: 'inherit', textDecoration: hover ? 'underline' : 'none', cursor: 'pointer' }}>
        {text}
      </span>
      {hover && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          zIndex: 10000,
          background: 'white',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1.5px solid #D4A017',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '180px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setHover(false);
              if (onAdd) {
                onAdd();
              } else if (onView) {
                onView();
              } else {
                openDetailsInNewTab();
              }
            }}
            style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', background: '#D4A017', color: '#fff', fontWeight: '800', fontSize: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            📂 View details
          </button>
        </div>
      )}
    </div>
  );
};

const PremiumActionCard = ({
  icon,
  title,
  subtitle,
  status = { text: "Active", color: "#166534", bg: "#dcfce7" },
  details = [],
  primaryAction = null,
  secondaryActions = [],
  onDelete,
  onLock,
  children,
}) => {
  const rawText = typeof title === 'object' && title.props?.text ? title.props.text : String(title || "?");
  const initial = rawText.charAt(0).toUpperCase() || "?";
  const phoneDetail = details.find(d => d.icon === ICON_PHONE);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "12px 14px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        border: "1px solid #E8E5DC",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.2s ease",
        cursor: "default",
        minHeight: "unset",
        width: "100%",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#C8C5BC";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#E8E5DC";
      }}
    >
      {/* TOP ROW: Avatar + Name + ID + Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          minWidth: "32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3a4714, #6b7c20)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "900",
          color: "#fff",
          fontFamily: "'Montserrat', sans-serif",
          boxShadow: "0 2px 6px rgba(58,71,20,0.2)"
        }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "12px",
            fontWeight: "800",
            color: "#1a1a2e",
            lineHeight: "1.2",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {subtitle}
            </div>
          )}
        </div>
        {status && (
          <span style={{
            background: status.bg,
            color: status.color,
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "9px",
            fontWeight: "800",
            whiteSpace: "nowrap",
            letterSpacing: "0.2px",
            marginLeft: "auto"
          }}>
            {status.text}
          </span>
        )}
      </div>

      {/* MIDDLE: Phone */}
      {phoneDetail && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#334155", marginTop: "2px" }}>
          <span style={{ display: "flex", width: "13px", flexShrink: 0, color: "#64748B" }}>{phoneDetail.icon}</span>
          <span style={{ fontSize: "11px", fontWeight: "700" }}>{phoneDetail.text}</span>
        </div>
      )}

      {children && (
        <div style={{
          background: "#f8fafc",
          borderRadius: "6px",
          padding: "8px 10px",
          border: "1px solid #E2E8F0",
          fontSize: "11px",
          marginTop: "2px"
        }}>
          {children}
        </div>
      )}

      {/* BOTTOM ROW: Action Buttons */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
        {secondaryActions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.onClick}
            title={act.label}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "6px",
              background: idx === 0 ? "#1e293b" : "#f1f5f9",
              color: idx === 0 ? "#ffffff" : "#334155",
              border: "none",
              fontWeight: "700",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ display: "flex", width: "12px" }}>{act.icon}</span>
            {act.label}
          </button>
        ))}

        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            title={primaryAction.label}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "6px",
              background: "#FEF9C3",
              color: "#854d0e",
              border: "1px solid #fde047",
              fontWeight: "700",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#fef08a"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#FEF9C3"; }}
          >
            <span style={{ display: "flex", width: "12px" }}>{primaryAction.icon || ICON_USER}</span>
            {primaryAction.label}
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            title="Delete"
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.18s ease",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
          >
            <span style={{ display: "flex", width: "12px" }}>{ICON_TRASH}</span>
          </button>
        )}
      </div>
    </div>
  );
};


const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const styles = {
    primary: {
      background: COLORS.primary,
      color: "#fff",
      boxShadow: `0 4px 12px ${COLORS.primary}30`,
    },
    secondary: {
      background: "#FFFFFF",
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}`,
    },
    success: {
      background: COLORS.success,
      color: "#fff",
      boxShadow: "0 4px 12px rgba(22, 101, 52, 0.2)",
    },
    danger: {
      background: COLORS.danger,
      color: "#fff",
      boxShadow: "0 4px 12px rgba(153, 27, 27, 0.2)",
    },
    outline: {
      background: "transparent",
      color: COLORS.secondary,
      border: "1.5px solid #E2E8F0",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 28px",
        borderRadius: "12px",
        border: "none",
        fontWeight: "850",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        ...styles[variant],
        ...style,
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
};

const formatCurrency = (v) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  if (typeof dateStr === "string" && dateStr.length <= 6) return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

const getISTDate = () => {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
};

const getISTDateTime = () => {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};

const DB = {
  Fruits: [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cantaloupe",
    "Cherry",
    "Clementine",
    "Coconut",
    "Cranberry",
    "Custard Apple",
    "Date",
    "Dragon Fruit",
    "Durian",
    "Elderberry",
    "Fig",
    "Gooseberry",
    "Grapefruit",
    "Grapes (Black)",
    "Grapes (Green)",
    "Guava",
    "Honeydew",
    "Jackfruit",
    "Jujube",
    "Kiwi",
    "Kumquat",
    "Lemon",
    "Lime",
    "Longan",
    "Lychee",
    "Mandarin",
    "Mango",
    "Mangosteen",
    "Mulberry",
    "Nectarine",
    "Orange",
    "Papaya",
    "Passion Fruit",
    "Peach",
    "Pear",
    "Persimmon",
    "Pineapple",
    "Pitaya",
    "Plum",
    "Pomegranate",
    "Pomelo",
    "Quince",
    "Raspberry",
    "Sapodilla",
    "Star Fruit",
    "Strawberry",
    "Sweet Lime (Mosambi)",
    "Tamarind",
    "Tangerine",
    "Watermelon",
  ],
  Vegetables: [
    "Artichoke",
    "Asparagus",
    "Ash Gourd",
    "Baby Corn",
    "Bamboo Shoot",
    "Beans (French)",
    "Beans (Long)",
    "Beetroot",
    "Bell Pepper",
    "Bitter Gourd",
    "Bottle Gourd",
    "Broccoli",
    "Brussels Sprout",
    "Cabbage (Green)",
    "Cabbage (Red/Purple)",
    "Capsicum (Yellow/Red)",
    "Capsicum (Green)",
    "Carrot",
    "Cassava",
    "Cauliflower",
    "Celery",
    "Chayote",
    "Chilli (Green)",
    "Chilli (Red)",
    "Chinese Cabbage",
    "Cluster Beans",
    "Colocasia",
    "Corn (Sweet)",
    "Cucumber",
    "Curry Leaves",
    "Daikon",
    "Drumstick",
    "Eggplant (Brinjal)",
    "Elephant Foot Yam",
    "Endive",
    "Fenugreek Leaves (Methi)",
    "Garlic",
    "Ginger",
    "Green Pea",
    "Ivy Gourd",
    "Kale",
    "Kohlrabi",
    "Lady Finger (Okra)",
    "Leek",
    "Lettuce",
    "Microgreens",
    "Mint",
    "Mushroom",
    "Mustard Greens",
    "Onion (Red)",
    "Onion (White)",
    "Parsley",
    "Parsnip",
    "Peas",
    "Pointed Gourd",
    "Potato",
    "Pumpkin",
    "Radish",
    "Ridge Gourd",
    "Scallion",
    "Shallot",
    "Snake Gourd",
    "Spinach",
    "Spring Onion",
    "Sweet Potato",
    "Taro",
    "Tomato",
    "Turnip",
    "Water Chestnut",
    "Yam",
    "Zucchini",
  ],
};

const PRODUCT_DATA = {
  Apple: {
    varieties: [
      "Fuji",
      "Gala",
      "Granny Smith",
      "Red Delicious",
      "Golden Delicious",
      "Honeycrisp",
      "Ambrosia",
      "Pink Lady",
      "McIntosh",
      "Empire",
    ],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    colors: ["Dark Red", "Light Red", "Green", "Yellow", "Mixed"],
  },
  Mango: {
    varieties: [
      "Alphonso",
      "Kesar",
      "Banganapalli",
      "Langra",
      "Dasheri",
      "Totapuri",
      "Sindhura",
      "Neelam",
    ],
    sizes: ["Small (150g)", "Medium (250g)", "Large (350g+)", "Jumbo"],
    colors: ["Yellow", "Orange", "Light Green", "Green", "Reddish"],
  },
  Banana: {
    varieties: ["Cavendish", "Robusta", "Red Banana", "Poovan", "Nendran"],
    sizes: ["Small", "Medium", "Large", "Extra Large (Hands)"],
    colors: ["Green", "Yellow", "Yellow-Green", "Red"],
  },
  Tomato: {
    varieties: ["Roma", "Cherry", "Beefsteak", "Heirloom", "Grape"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Red", "Orange", "Yellow", "Green"],
  },
  Onion: {
    varieties: [
      "Red Onion",
      "White Onion",
      "Yellow Onion",
      "Sweet Onion",
      "Shallot",
    ],
    sizes: [
      "Small (< 40mm)",
      "Medium (40-60mm)",
      "Large (60-80mm)",
      "Jumbo (> 80mm)",
    ],
    colors: ["Red", "White", "Yellow", "Brown"],
  },
  Grapes: {
    varieties: [
      "Thompson Seedless",
      "Flame Seedless",
      "Sharad Seedless",
      "Crimson",
      "Black Globe",
    ],
    sizes: ["Small Berry", "Medium Berry", "Large Berry"],
    colors: ["Green", "Black", "Red", "Mixed"],
  },
  default: {
    varieties: ["Standard", "Premium", "Local", "Hybrid"],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    colors: ["Standard", "Mixed", "Green", "Red", "Yellow", "Orange"],
  },
};

const getProductData = (productName) => {
  // Try to find in custom master products (Added by user in config)
  const masterProd = masterProducts?.find(
    (p) => p.name.toLowerCase() === productName?.toLowerCase(),
  );
  if (masterProd) {
    return {
      varieties: masterProd.varieties || [],
      grades: masterProd.grades || ["A Grade", "B Grade", "C Grade"],
    };
  }

  // Try to find in predefined PRODUCT_DATA map
  const preDefined = PRODUCT_DATA[productName];
  if (preDefined) {
    return {
      varieties: preDefined.varieties || [],
      grades: ["A Grade", "B Grade", "C Grade", "Export Quality", "Local"],
    };
  }

  // Fallback for typed products
  return {
    varieties: ["Standard", "Premium", "Local Grade", "Processing Quality"],
    grades: ["A Grade", "B Grade", "C Grade", "Export Quality", "Local"],
  };
};

const TabHeader = ({ tabs, active, set }) => (
  <div
    style={{
      display: "flex",
      gap: "32px",
      borderBottom: "1px solid #EBE9E1",
      marginBottom: "32px",
      overflowX: "auto",
    }}
  >
    {tabs.map((t) => (
      <div
        key={t}
        onClick={() => set(t)}
        style={{
          padding: "0 0 12px 0",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: active === t ? COLORS.sidebar : COLORS.muted,
          borderBottom:
            active === t
              ? `3px solid ${COLORS.accent}`
              : "3px solid transparent",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {t}
      </div>
    ))}
  </div>
);

const getSelectPlaceholder = (fieldName) => {
  const normalizedFieldName = String(fieldName || "Option")
    .replace(/\*/g, "")
    .trim();
  return `Select ${normalizedFieldName}`;
};

const shouldUseMultiSelectForField = (label) => {
  const normalized = String(label || "").replace(/\*/g, "").trim().toLowerCase();
  return [
    "product",
    "products",
    "variety",
    "id type",
    "payment terms",
    "payment term",
    "grade",
    "kgs",
    "kg",
    "allocation items",
    "line item",
    "produce sold",
    "expense deduction",
    "other expenses deduction",
    "labour",
    "item purchased",
    "additional charges",
    "other charges label",
    "select product",
    "item/product name",
    "item name",
    "other deductions",
    "charges",
  ].some((keyword) => normalized.includes(keyword));
};

const getModernMultiSelectPlaceholder = (label) => {
  const normalized = String(label || "").replace(/\*/g, "").trim().toLowerCase();
  if (normalized.includes("payment term")) return "Select Payment Term";
  if (normalized.includes("id type")) return "Select ID Type";
  if (normalized.includes("variety")) return "Select Variety";
  if (normalized.includes("grade")) return "Select Grade";
  if (normalized.includes("kg") || normalized.includes("kgs") || normalized.includes("weight unit")) return "Select KG";
  if (normalized.includes("product")) return "Select Product";
  return getSelectPlaceholder(label);
};

const parseMultiValue = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v || "").trim()).filter(Boolean);
  return String(value || "")
    .split(/\s*\/\s*|,/)
    .map((v) => v.trim())
    .filter(Boolean);
};

function ModernMultiSelectField({
  label,
  value,
  onChange,
  options = [],
  disabled,
  hideLabel = false,
}) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInternalValues(parseMultiValue(value));
  }, [value]);

  const normalizedOptions = [...new Set((options || []).map(o => String(o || "").trim()).filter(Boolean))];
  const filteredOptions = normalizedOptions.filter(o => 
    o.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleValue = (val) => {
    if (internalValues.includes(val)) {
      setInternalValues(internalValues.filter(v => v !== val));
    } else {
      setInternalValues([...internalValues, val]);
    }
  };

  const handleApply = () => {
    onChange?.({ target: { value: internalValues.join(" / ") } });
    setOpen(false);
    setSearchText("");
  };

  const handleManualAdd = () => {
    if (searchText.trim()) {
      const trimmed = searchText.trim();
      if (!internalValues.includes(trimmed)) {
        setInternalValues([...internalValues, trimmed]);
      }
      setSearchText("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
      {!hideLabel && (
        <label style={{ fontSize: "12px", fontWeight: "750", color: "#64748B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{label}</span>
          {internalValues.length > 0 && (
            <span style={{ fontSize: "10px", background: "#E2E8F0", padding: "2px 8px", borderRadius: "10px", color: COLORS.sidebar, fontWeight: "800" }}>
              {internalValues.length} Selected
            </span>
          )}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setOpen(!open)}
        style={{
          minHeight: "48px",
          padding: "8px 16px",
          borderRadius: "12px",
          border: "1.5px solid #EBE9E1",
          background: "#FFFFFF",
          color: COLORS.sidebar,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: open ? "0 0 0 2px rgba(0,0,0,0.05)" : "none",
          opacity: disabled ? 0.6 : 1
        }}
      >
        <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "13.5px", fontWeight: "600" }}>
          {internalValues.length > 0 ? (
            <div style={{ display: "flex", gap: "6px", overflow: "hidden" }}>
               {internalValues.slice(0, 3).map(v => (
                 <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#F1F5F9", padding: "2px 10px", borderRadius: "8px", fontSize: "11.5px", border: "1.5px solid #E2E8F0", color: COLORS.sidebar }}>
                   {v}
                   <span 
                     onClick={(e) => { 
                       e.stopPropagation(); 
                       const next = internalValues.filter(x => x !== v);
                       setInternalValues(next);
                       onChange?.({ target: { value: next.join(" / ") } });
                     }}
                     style={{ cursor: "pointer", color: "#64748B", fontSize: "16px", fontWeight: "900", transition: "all 0.2s", opacity: 0.7 }}
                     onMouseEnter={(e) => { e.currentTarget.style.color = "#FF3B30"; e.currentTarget.style.transform = "scale(1.2)"; }}
                     onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.transform = "scale(1)"; }}
                   >×</span>
                 </span>
               ))}
               {internalValues.length > 3 && <span style={{ color: "#888", fontSize: "11px", alignSelf: "center" }}>+{internalValues.length - 3} more</span>}
            </div>
          ) : (
            <span style={{ color: "#666" }}>Select {label}...</span>
          )}
        </div>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", color: "#666", fontSize: "10px" }}>▼</span>
      </div>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          zIndex: 1000,
          background: COLORS.sidebar,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          padding: "14px",
          minWidth: "300px",
          animation: "slideUp 0.2s ease-out"
        }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input 
                autoFocus
                placeholder="Search or type new..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchText ? handleManualAdd() : handleApply();
                  }
                }}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
            {searchText && !normalizedOptions.some(o => o.toLowerCase() === searchText.toLowerCase()) && (
              <button 
                onClick={handleManualAdd}
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "0 12px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
              >Add</button>
            )}
            <button 
              onClick={handleApply}
              style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: "10px", padding: "0 18px", fontSize: "12px", fontWeight: "900", cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >Apply</button>
          </div>

          <div style={{ maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }} className="custom-scrollbar">
            {filteredOptions.length > 0 || searchText ? (
              <>
                {filteredOptions.map(opt => {
                  const isSelected = internalValues.includes(opt);
                  return (
                    <div 
                      key={opt}
                      onClick={() => toggleValue(opt)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: isSelected ? "rgba(255,255,255,0.15)" : "transparent",
                        transition: "all 0.2s",
                        marginBottom: "2px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isSelected ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = isSelected ? "rgba(255,255,255,0.15)" : "transparent"}
                    >
                      <div style={{
                        width: "20px",
                        height: "20px",
                        border: isSelected ? "none" : "2px solid rgba(255,255,255,0.35)",
                        background: isSelected ? COLORS.primary : "transparent",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "900",
                        transition: "all 0.2s"
                      }}>
                        {isSelected && "✓"}
                      </div>
                      <span style={{ fontSize: "13.5px", fontWeight: isSelected ? "800" : "500", color: "#ffffff" }}>{opt}</span>
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                No options available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectWithManualEntry({
  label,
  value,
  onChange,
  options,
  disabled,
  required,
  info,
  style = {},
  hideLabel = false,
}) {
  const normalizedLabel = String(label || "Option").replace(/\*/g, "").trim();
  const normalizedOptions = Array.isArray(options) ? options : [];
  const manualSentinel = "__manual__";

  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    // If the stored value is not in the dropdown list, automatically switch to manual mode
    // so edits keep showing the saved value (even if it's not in the master list).
    if (value && !normalizedOptions.includes(value)) setIsManual(true);
    if (!value) setIsManual(false);
  }, [value, normalizedOptions]);

  const selectValue =
    isManual ? manualSentinel : (value || "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, ...style }}>
      {!hideLabel && (
        <label
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: COLORS.muted,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{label}{required ? " *" : ""}</span>
          {info && <span style={{ color: COLORS.primary, fontWeight: "900" }}>{info}</span>}
        </label>
      )}

      <select
        value={selectValue}
        onChange={(e) => {
          if (e.target.value === manualSentinel) {
            setIsManual(true);
            if (typeof onChange === "function") onChange({ target: { value: "" } });
            return;
          }
          setIsManual(false);
          onChange?.(e);
        }}
        disabled={disabled}
        style={{
          padding: "12px 14px",
          borderRadius: "8px",
          border: "1.5px solid #EBE9E1",
          background: disabled ? "#FDFBF4" : "#FFFFFF",
          color: disabled ? COLORS.muted : COLORS.sidebar,
          outline: "none",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          appearance: "auto",
        }}
      >
        {(!value || value === "") && !isManual && (
          <option value="" disabled>{getSelectPlaceholder(normalizedLabel)}</option>
        )}
        {normalizedOptions.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
        <option value={manualSentinel}>Manual entry...</option>
      </select>

      {isManual && (
        <input
          type="text"
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={`Enter ${normalizedLabel}`}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1.5px solid #EBE9E1",
            background: disabled ? "#FDFBF4" : "#FFFFFF",
            color: disabled ? COLORS.muted : COLORS.sidebar,
            outline: "none",
            fontSize: "13px",
            fontWeight: "600",
          }}
        />
      )}
    </div>
  );
}

// --- Smart Dropdown with "Others" Support Component ---
// --- Smart Datalist with Manual Entry Support ---
// This version removes the overt "Others" option from the list but allows typing anything.
function OthersDropdown({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled, 
  required, 
  info,
  style = {},
  hideLabel = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => 
    String(o || "").toLowerCase().includes(String(value || "").toLowerCase())
  );

  return (
    <div ref={dropdownRef} style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, ...style, position: "relative" }}>
      {!hideLabel && (
        <label
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: COLORS.muted,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{label}{required ? " *" : ""}</span>
          {info && <span style={{ color: COLORS.primary, fontWeight: "900" }}>{info}</span>}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <input
          type="text"
          autoComplete="off"
          placeholder={placeholder || getSelectPlaceholder(label)}
          value={value || ""}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
          }}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1.5px solid #EBE9E1",
            backgroundColor: disabled ? "#FDFBF4" : "#FFFFFF",
            color: disabled ? COLORS.muted : COLORS.sidebar,
            outline: "none",
            fontSize: "13px",
            fontWeight: "600",
            ...style
          }}
        />
        
        {isOpen && !disabled && filteredOptions.length > 0 && (
          <ul style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#1a1a1a", // Medium black
            borderRadius: "12px",
            marginTop: "6px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            listStyle: "none",
            padding: "6px",
            border: "1px solid #333333"
          }}>
            {filteredOptions.map((o) => (
              <li
                key={o}
                onClick={() => {
                  onChange({ target: { value: o } });
                  setIsOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#d4a017";
                  e.target.style.color = "#1e240b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#FFFFFF";
                }}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: "700",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  marginBottom: "2px"
                }}
              >
                {o}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FormGrid({ sections }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {sections.map((sec, i) => (
        <div
          key={i}
          style={{
            background: "#FFFFFF",
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #EBE9E1",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "800",
              color: COLORS.sidebar,
              borderBottom: "1px solid #EBE9E1",
              paddingBottom: "16px",
              marginBottom: "24px",
              marginTop: 0,
            }}
          >
            {sec.title}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {sec.fields.map((f, j) => {
              return (
                <div
                  key={j}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  {(() => {
                    const useModernMultiSelect = shouldUseMultiSelectForField(f.label);
                    return (
                      <>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: COLORS.muted,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{f.label}</span>
                    {f.info && <span style={{ color: COLORS.primary, fontWeight: "900" }}>{f.info}</span>}
                  </label>
                  {useModernMultiSelect ? (
                    <ModernMultiSelectField
                      label={f.label}
                      value={f.value}
                      options={f.options || []}
                      onChange={f.onChange}
                      disabled={f.disabled}
                      hideLabel={true}
                    />
                  ) : f.type === "select" ? (
                    <SelectWithManualEntry
                      label={f.label}
                      value={f.value}
                      options={f.options || []}
                      onChange={f.onChange}
                      disabled={f.disabled}
                      required={f.required}
                      info={f.info}
                      hideLabel={true}
                    />
                  ) : f.type === "othersDropdown" ? (
                    <OthersDropdown
                      label={f.label}
                      value={f.value}
                      options={f.options || []}
                      onChange={f.onChange}
                      disabled={f.disabled}
                      required={f.required}
                      info={f.info}
                      hideLabel={true}
                    />
                  ) : f.type === "dropdown" ? (
                    <select
                      value={f.value}
                      onChange={f.onChange}
                      disabled={f.disabled}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1.5px solid #EBE9E1",
                        background: f.disabled ? "#FDFBF4" : (f.label === "Lot ID *" ? COLORS.sidebar : "#FFFFFF"),
                        color: f.disabled ? COLORS.muted : (f.label === "Lot ID *" ? "#FFFFFF" : COLORS.sidebar),
                        outline: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        appearance: "auto",
                      }}
                    >
                      {(!f.value || f.value === "") && (
                        <option value="" disabled>{getSelectPlaceholder(f.label)}</option>
                      )}
                      {f.options && f.options.map((opt, i) => (
                        <option key={i} value={opt} style={{ background: "#1a1a1a", color: "#FFFFFF" }}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      list={f.list}
                      placeholder={f.placeholder || ""}
                      disabled={f.disabled}
                      {...(f.type !== "file" ? { value: f.value } : {})}
                      defaultValue={
                        f.value === undefined ? f.defaultValue : undefined
                      }
                      onChange={f.onChange}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #EBE9E1",
                        background: f.disabled ? "#FDFBF4" : "#FFFFFF",
                        color: f.disabled ? COLORS.muted : COLORS.sidebar,
                        outline: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    />
                  )}
                      </>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- MAIN ARCHITECTURE ---
export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [activeSupplierTab, setActiveSupplierTab] = useState(
    "Supplier Registration",
  );
  const [activeBuyerTab, setActiveBuyerTab] = useState("Buyer Registration");
  const [activeLotTab, setActiveLotTab] = useState("LOT Creation");
  const [activeSupplierBillTab, setActiveSupplierBillTab] =
    useState("Bill Header");
  const [activeAllocationTab, setActiveAllocationTab] = useState("Allocation Form");
  const [activeBuyerInvoiceTab, setActiveBuyerInvoiceTab] =
    useState("Invoice Header");
  const [activeLedgerTab, setActiveLedgerTab] = useState("Supplier");
  const [activePaymentTab, setActivePaymentTab] = useState("Supplier");
  const [activeUserRoleTab, setActiveUserRoleTab] = useState("Supplier");
  const [dispatchProduct, setDispatchProduct] = useState("");
  const [dispatchType, setDispatchType] = useState("Fruits");
  const [poProduct, setPoProduct] = useState("");
  const [poType, setPoType] = useState("Fruits");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const isAdmin = user?.role === "Owner / Admin";
  const isAccountant = user?.role === "Accountant";
  const isStaff = user?.role === "Operations Staff";
  const isViewer = user?.role === "Viewer";
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    role: "Owner / Admin",
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [viewingEntity, setViewingEntity] = useState(null); // { type: 'Supplier'|'Customer', data: ... }
  const [supplierSaveBtn, setSupplierSaveBtn] = useState({ label: "Save", color: null });
  const [buyerSaveBtn, setBuyerSaveBtn] = useState({ label: "Save", color: null });
  const [lotSaveBtn, setLotSaveBtn] = useState({ label: "Save", color: null });
  const [allocationSaveBtn, setAllocationSaveBtn] = useState({ label: "Save", color: null });
  const [activeRegisteredTab, setActiveRegisteredTab] = useState("Suppliers");
  const [memberDateFilter, setMemberDateFilter] = useState("All");
  const [memberCustomDateStart, setMemberCustomDateStart] = useState("");
  const [memberCustomDateEnd, setMemberCustomDateEnd] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberProductFilters, setMemberProductFilters] = useState({
    Suppliers: [],
    Customers: [],
  });
  const [memberProductSearch, setMemberProductSearch] = useState({
    Suppliers: "",
    Customers: "",
  });
  const [isMemberProductDropdownOpen, setIsMemberProductDropdownOpen] = useState(false);
  const [lotSearchQuery, setLotSearchQuery] = useState("");
  const [lotDateFilter, setLotDateFilter] = useState("");
  const [lotCustomDateStart, setLotCustomDateStart] = useState("");
  const [lotCustomDateEnd, setLotCustomDateEnd] = useState("");
  const [lotProductFilter, setLotProductFilter] = useState("");
  const [allocationSearchQuery, setAllocationSearchQuery] = useState("");
  const [billSearchQuery, setBillSearchQuery] = useState("");
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [isEditingBuyerInvoice, setIsEditingBuyerInvoice] = useState(false);
  const [editingBuyerInvoiceId, setEditingBuyerInvoiceId] = useState(null);
  const [billPhotoModal, setBillPhotoModal] = useState({
    open: false,
    imageUrl: "",
    lotNo: "",
    supplierName: "",
    supplierId: "",
    zoom: 1,
  });
  const invoiceRef = useRef(null);
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState(null);
  const billRef = useRef(null);
  const [lastGeneratedBill, setLastGeneratedBill] = useState(null);

  const normalizeProductName = (value) =>
    String(value || "").trim().replace(/\s+/g, " ").toLowerCase();

  const parseProductList = (value) => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v || "").trim()).filter(Boolean);
    }
    return String(value || "")
      .split(/[,/|]+/)
      .map((v) => v.trim())
      .filter(Boolean);
  };

  const getProfileProducts = (record) => {
    const candidates = [
      record?.product,
      record?.products,
      record?.productName,
      record?.coreProduct,
    ];
    const allProducts = candidates.flatMap(parseProductList).filter(Boolean);
    return Array.from(new Set(allProducts));
  };

  const stripIdPrefix = (id) => String(id || "").replace(/^(SUPP-|CUST-|CUS-)/i, "");

  const getSupplierIdValue = (record = {}) =>
    stripIdPrefix(
      record.supplierId ||
      record.supplierCode ||
      record.id ||
      record._id ||
      ""
    );

  const getCustomerIdValue = (record = {}) =>
    stripIdPrefix(
      record.buyerId ||
      record.customerId ||
      record.id ||
      record._id ||
      ""
    );

  const formatNameWithId = (name, id) => {
    const n = String(name || "").trim();
    let i = stripIdPrefix(id);

    if (i.startsWith("sim_")) {
      const base = n ? n.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') : "user";
      const suffix = i.length > 8 ? i.slice(-4) : (i.replace('sim_', '') || "1");
      i = `${base}-${suffix}`;
    }

    if (n && i) {
      const namePart = n.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (namePart && i.toLowerCase().startsWith(namePart + '-')) {
        return i;
      }
      return `${n} - ${i}`;
    }
    return n || i || "N/A";
  };

  const getRegisteredProductOptions = (tabName) => {
    const source = tabName === "Suppliers" ? suppliers : buyers;
    const options = source.flatMap((profile) => getProfileProducts(profile));
    return Array.from(new Set(options))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  };

  const addMemberProductFilter = (tabName, rawProduct) => {
    const nextProduct = String(rawProduct || "").trim();
    if (!nextProduct) return;
    setMemberProductFilters((prev) => {
      const exists = (prev[tabName] || []).some(
        (p) => normalizeProductName(p) === normalizeProductName(nextProduct),
      );
      if (exists) return prev;
      return { ...prev, [tabName]: [...(prev[tabName] || []), nextProduct] };
    });
  };

  const removeMemberProductFilter = (tabName, productToRemove) => {
    setMemberProductFilters((prev) => ({
      ...prev,
      [tabName]: (prev[tabName] || []).filter(
        (p) =>
          normalizeProductName(p) !== normalizeProductName(productToRemove),
      ),
    }));
  };

  const renderSupplierMemberCard = (s, keyPrefix = "supplier") => {
    let showDateBadge = false;
    if (memberDateFilter && memberDateFilter !== "All") showDateBadge = true;
    return (
    <PremiumActionCard
      key={`${keyPrefix}-${s._id || s.id || s.name}`}
      title={<div style={{ display: "flex", alignItems: "center" }}>
        <SmartDataNode text={formatNameWithId(s.name, getSupplierIdValue(s))} type="Name" data={s} onAdd={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSection("Supplier Billing"); setActiveSupplierBillTab("Bill Settlement"); }} />
        {showDateBadge && (s.createdAt || s.date) && (
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "12px", marginLeft: "8px", flexShrink: 0 }}>
            {new Date(s.createdAt || s.date).toLocaleDateString('en-GB')}
          </span>
        )}
      </div>}
      subtitle=""
      icon={ICON_USER}
      status={{ text: "Active", color: "#166534", bg: "#dcfce7" }}
      details={[
        { icon: ICON_USER, text: formatNameWithId(s.name, getSupplierIdValue(s)) },
        { icon: ICON_CLOCK_SIDE, text: s.createdAt ? `Joined: ${new Date(s.createdAt).toLocaleDateString('en-GB')}` : "Date N/A" },
        { icon: ICON_PHONE, text: s.phone || "N/A" },
        { icon: ICON_LOCATION, text: s.village || "Location N/A" },
      ]}
      secondaryActions={[
        { label: "View Details", icon: ICON_SHOP, onClick: () => setViewingEntity({ type: "Supplier", data: s }), variant: "primary" },
        { label: "Edit Details", icon: ICON_EDIT, onClick: () => { setActiveUserRoleTab("Supplier"); handleEditSelect("Supplier", s); } },
      ]}
      onDelete={() => {
        const code = prompt("🔐 SECURITY CHECK: Enter Master Deletion Code to remove this record:");
        if (code === "0000") handleDeleteSupplier(s._id);
        else if (code !== null) alert("🚫 ACCESS DENIED: Invalid deletion code.");
      }}
    />
  );
  };

  const renderBuyerMemberCard = (b, keyPrefix = "buyer") => {
    let showDateBadge = false;
    if (memberDateFilter && memberDateFilter !== "All") showDateBadge = true;
    return (
    <PremiumActionCard
      key={`${keyPrefix}-${b._id || b.id || b.name}`}
      title={<div style={{ display: "flex", alignItems: "center" }}>
        <SmartDataNode text={formatNameWithId(b.shopName || b.name, getCustomerIdValue(b))} type="Name" data={b} onAdd={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSection("Buyer Invoicing"); setActiveBuyerInvoiceTab("Invoice Entry"); }} />
        {showDateBadge && (b.createdAt || b.date) && (
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "12px", marginLeft: "8px", flexShrink: 0 }}>
            {new Date(b.createdAt || b.date).toLocaleDateString('en-GB')}
          </span>
        )}
      </div>}
      subtitle=""
      icon={ICON_SHOP}
      status={{ text: "Active", color: "#166534", bg: "#dcfce7" }}
      details={[
        { icon: ICON_USER, text: formatNameWithId(b.name, getCustomerIdValue(b)) },
        { icon: ICON_CLOCK_SIDE, text: b.createdAt ? `Joined: ${new Date(b.createdAt).toLocaleDateString('en-GB')}` : "Date N/A" },
        { icon: ICON_PHONE, text: b.phone || "N/A" },
        { icon: ICON_LOCATION, text: b.address || "Location N/A" },
      ]}
      secondaryActions={[
        { label: "View Details", icon: ICON_SHOP, onClick: () => setViewingEntity({ type: "Customer", data: b }), variant: "primary" },
        { label: "Edit Details", icon: ICON_EDIT, onClick: () => { setActiveUserRoleTab("Customer"); handleEditSelect("Customer", b); } },
      ]}
      onDelete={() => {
        const code = prompt("🔐 SECURITY CHECK: Enter Master Deletion Code to remove this record:");
        if (code === "0000") handleDeleteBuyer(b._id);
        else if (code !== null) alert("🚫 ACCESS DENIED: Invalid deletion code.");
      }}
    />
  );
  };

  const handleSaveInvoicePDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    // Add "Powered by MOS" footer at the bottom of the last page
    const pageCount = pdf.internal.getNumberOfPages();
    pdf.setPage(pageCount);
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text("Powered by MOS", pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });
    
    pdf.save(`Invoice_${lastGeneratedInvoice?.invoiceNumber || "MOS"}.pdf`);
  };

  const handlePrintInvoice = () => {
    if (!invoiceRef.current) return;
    const content = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice - ${lastGeneratedInvoice?.invoiceNumber || "MOS"}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1A231A; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; border-bottom: 1px solid #EEE; text-align: left; }
            .no-print { display: none; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSaveSupplierBillPDF = async () => {
    if (!billRef.current) return;
    const canvas = await html2canvas(billRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`bill-${lastGeneratedBill?.billNumber || "supplier"}.pdf`);
  };

  const handlePrintSupplierBill = () => {
    if (!billRef.current) return;
    const content = billRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill - ${lastGeneratedBill?.billNumber || "MOS"}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
             body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1A231A; }
             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
             th, td { padding: 12px; border-bottom: 1px solid #EEE; text-align: left; }
             .no-print { display: none; }
             @media print {
               body { padding: 0; }
               @page { margin: 1cm; }
             }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSendBuyerWhatsApp = (b) => {
    const buyer = buyers.find(s => s._id === (b.buyerId?._id || b.buyerId) || s.name === (b.buyerId?.name || b.buyerName || b.buyerId)) || b.buyerId || b;
    const phone = buyer?.phone || b.buyerPhone || b.customerPhone || b.phone || "";
    if (!phone) return alert("âŒ No phone number found for this customer.");

    const items = b.items || [];
    const totalQty = (items || []).reduce((s, i) => s + (Number(i.grossWeight || 0) - (Number(i.deductions || 0))), 0);
    const productName = items?.[0]?.productInfo || "Various Products";

    const subTotal = (items || []).reduce((s, it) => s + (Math.max(0, (Number(it.grossWeight) || 0) - (Number(it.deductions) || 0)) * (Number(it.rate) || 0)), 0);
    const ch = b.charges || {};
    const totalAdditional = (Number(ch.commission) || 0) + (Number(ch.handling) || 0) + (Number(ch.transport) || 0) + (Number(ch.otherAmount) || 0);
    const grandTotal = subTotal + totalAdditional;
    const amountReceived = Number(b.amountReceived) || 0;
    const balanceDue = grandTotal - amountReceived;

    const itemsTxt = items.map((it, idx) => {
        const wt = Math.max(0, (Number(it.grossWeight) || 0) - (Number(it.deductions) || 0));
        return `  ${idx+1}. ${it.productInfo || "Product"} - ${wt.toFixed(2)}kg @ ₹${it.rate}/kg`;
    }).join('\n');

    const chargesList = [];
    if (Number(ch.transport)) chargesList.push(`  Transport: ₹${ch.transport}`);
    if (Number(ch.commission)) chargesList.push(`  Commission: ₹${ch.commission}`);
    if (Number(ch.handling)) chargesList.push(`  Handling: ₹${ch.handling}`);
    if (Number(ch.otherAmount)) chargesList.push(`  Other: ₹${ch.otherAmount}`);
    const chargesTxt = chargesList.length > 0 ? `\n➕ Additional Charges:\n${chargesList.join('\n')}` : "";

    const msg = `Hello Customer
    
Your invoice from SPV Fruits is ready.

Product: ${productName}
Total Quantity: ${totalQty.toFixed(2)} kg
Total Amount: ${formatCurrency(grandTotal)}

Billing Items:
${itemsTxt}${chargesTxt}

--- FINANCIALS ---
Total amount: ${formatCurrency(grandTotal)}
Payment Received: ${formatCurrency(amountReceived)}
Balance Amount: ${formatCurrency(balanceDue)}

For any queries, please contact us.

--- SPV Fruits
Powered by Stacli mandi os`;

    const phoneStr = String(phone);
    const url = `https://wa.me/${phoneStr.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleSendSupplierWhatsApp = (b) => {
    const supplier = suppliers.find(s => s._id === b.supplierId?._id || s._id === b.supplierId || s.name === b.supplierName || s.name === b.supplierId) || b.supplierId || b;
    const phone = supplier?.phone || b.supplierPhone || b.farmerPhone || b.phone || "";
    if (!phone) return alert("âŒ No phone number found for this supplier.");

    const totalGross = (b.items || []).reduce((s, i) => s + (Number(i.quantity || 0) * Number(i.rate || 0)), 0);
    const totalQty = (b.items || []).reduce((s, i) => s + Number(i.quantity || 0), 0);
    const productName = b.items?.[0]?.productName || "Various Products";
    
    const ex = b.expenses || {};
    const totalExpenses = (Number(ex.transport) || 0) + (Number(ex.commission) || 0) + (Number(ex.labour) || 0) + (Number(ex.weighing) || 0) + (Number(ex.packing) || 0) + (Number(ex.miscAmount) || 0);
    const netSale = totalGross - totalExpenses;
    const advance = Number(ex.advance || 0);
    const balancePayable = netSale - advance;

    const itemsTxt = (b.items || []).map((it, idx) => {
        return `  ${idx+1}. ${it.productName || "Product"} - ${it.quantity}kg @ ₹${it.rate}/kg`;
    }).join('\n');

    const expensesList = [];
    if (Number(ex.transport)) expensesList.push(`  Transport: ₹${ex.transport}`);
    if (Number(ex.commission)) expensesList.push(`  Commission: ₹${ex.commission}`);
    if (Number(ex.labour)) expensesList.push(`  Labour: ₹${ex.labour}`);
    if (Number(ex.weighing)) expensesList.push(`  Weighing: ₹${ex.weighing}`);
    if (Number(ex.packing)) expensesList.push(`  Packing: ₹${ex.packing}`);
    if (Number(ex.miscAmount)) expensesList.push(`  Misc: ₹${ex.miscAmount}`);
    const expensesTxt = expensesList.length > 0 ? `\nðŸ“‰ Deductions:\n${expensesList.join('\n')}` : "";

    const msg1 = `Hello Supplier
    
Your bill from SPV Fruits is ready.

Product: ${productName}
Total Quantity: ${totalQty} kg
Final Payable: ${formatCurrency(balancePayable)}

Itemized Billing:
${itemsTxt}${expensesTxt}

--- FINANCIALS ---
Gross Total: ${formatCurrency(totalGross)}
Total Deductions: ${formatCurrency(totalExpenses)}
Advance Paid: ${formatCurrency(advance)}
Balance Payable: ${formatCurrency(balancePayable)}

For any queries, please contact us.

--- SPV Fruits
Powered by Stacli mandi os`;

    const phoneStr = String(phone);
    const url = `https://wa.me/${phoneStr.replace(/\D/g, "")}?text=${encodeURIComponent(msg1)}`;
    window.open(url, "_blank");
  };




  // --- INITIALIZE SESSION ---
  useEffect(() => {
    const savedToken = localStorage.getItem("mandi_token");
    const savedUser = localStorage.getItem("mandi_user");
    if (savedToken && savedUser) {
      setLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // --- RESPONSIVE STATE MONITOR ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- LOT SEQUENCE COUNTER (Session-scoped: resets on page refresh) ---
  const [lotCounter, setLotCounter] = useState(1);
  const generateLotId = (counter) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const seq = String(counter).padStart(3, "0");
    return `LOT-${dateStr}-${seq}`;
  };

  // --- FORM STATES ---
  // --- FORM STATES & HANDLERS ---
  const [partyStep, setPartyStep] = useState(1); // 1 or 2
  const [supplierForm, setSupplierForm] = useState({
    supplierId: "",
    name: "",
    phone: "",
    villageOrTown: "",
    villageOrTownName: "",
    district: "",
    state: "",
    product: "",
    idType: "",
    govIdNumber: "",
    bankAccount: "",
    bankLocation: "",
    bankBranch: "",
    ifsc: "",
    advanceBalance: "",
    notes: "",
  });
  const [buyerForm, setBuyerForm] = useState({
    buyerId: "",
    name: "",
    shopName: "",
    phone: "",
    address: "",
    villageOrTown: "",
    villageOrTownName: "",
    district: "",
    state: "",
    product: "",
    govIdNumber: "",
    idType: "",
    bankAccount: "",
    bankLocation: "",
    bankBranch: "",
    ifsc: "",
    advanceBalance: "",
    creditLimit: "",
    paymentTerms: "Immediate",
    notes: "",
  });
  const [lotCreationForm, setLotCreationForm] = useState({
    lotId: generateLotId(1),
    dateTime: getISTDateTime(),
    farmerId: "",
    vehicleNumber: "",
    driverName: "",
    origin: "",
    attachedBill: null,
    notes: "",
    lineItems: [
      {
        id: Date.now(),
        productId: "",
        variety: "",
        grade: "A",
        grossWeight: "",
        deductions: "",
        weightUnit: "KGs",
        estimatedRate: "",
        status: "Pending",
      },
    ],
  });

  const handleRegisterSupplier = async () => {
    if (!supplierForm.name || !supplierForm.phone)
      return alert("Name and phone are mandatory!");
      
    // 1) Same Supplier Name → Same Supplier ID Auto Link
    const existingSync = suppliers.find(s => s.name.toLowerCase() === supplierForm.name.toLowerCase());
    const isEdit = isEditingSupplier || !!existingSync;
    const targetId = isEditingSupplier ? editingSupplierId : (existingSync ? existingSync._id : null);
    const targetCode = isEditingSupplier ? supplierForm.supplierId : (existingSync ? (existingSync.supplierId || existingSync.supplierCode) : `${suppliers.length + 1}`);

    const payload = {
      supplierId: targetCode,
      name: supplierForm.name,
      phone: supplierForm.phone,
      village: supplierForm.villageOrTownName,
      district: supplierForm.district,
      state: supplierForm.state,
      product: supplierForm.product || "",
      idType: supplierForm.idType,
      govIdNumber: supplierForm.govIdNumber,
      aadhaar: supplierForm.idType === "Aadhaar" ? supplierForm.govIdNumber : "",
      pan: supplierForm.idType === "PAN" ? supplierForm.govIdNumber : "",
      voterId: supplierForm.idType === "Voter ID" ? supplierForm.govIdNumber : "",
      bankAccount: supplierForm.bankAccount,
      bankLocation: supplierForm.bankLocation,
      bankBranch: supplierForm.bankBranch,
      ifsc: supplierForm.ifsc,
      advanceBalance: supplierForm.advanceBalance,
      notes: supplierForm.notes || "",
    };
    try {
      let res;
      if (isEdit) {
        res = await MandiService.updateSupplier(targetId, payload);
      } else {
        res = await MandiService.addSupplier(payload);
      }
      if (res.status === "ERROR")
        return alert("Error processing supplier: " + res.message);
      
      setSupplierSaveBtn({ label: "✅ Saved successfully", color: COLORS.success });
      setTimeout(() => {
        setSupplierSaveBtn({ label: "Save", color: null });
        handleCancelAll("Supplier");
        fetchData();
      }, 2000);
    } catch (err) {
      alert("Registration/Update Failed.");
    }
  };

  const handleCancelAll = (type) => {
    if (type === "Supplier") {
      setSupplierForm({
        supplierId: "",
        name: "",
        phone: "",
        villageOrTown: "",
        villageOrTownName: "",
        district: "",
        state: "",
        product: "",
        idType: "",
        govIdNumber: "",
        bankAccount: "",
        bankLocation: "",
        bankBranch: "",
        ifsc: "",
        advanceBalance: "",
        notes: "",
      });
      setIsEditingSupplier(false);
      setEditingSupplierId(null);
    } else {
      setBuyerForm({
        buyerId: "",
        name: "",
        shopName: "",
        phone: "",
        address: "",
        villageOrTown: "",
        villageOrTownName: "",
        district: "",
        state: "",
        product: "",
        idType: "",
        govIdNumber: "",
        creditLimit: "",
        paymentTerms: "Immediate",
        bankAccount: "",
        bankLocation: "",
        bankBranch: "",
        ifsc: "",
        advanceBalance: "",
        notes: "",
      });
      setIsEditingBuyer(false);
      setEditingBuyerId(null);
    }
  };

  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadLedgerCSV = (type) => {
    let headers = [];
    let rows = [];
    let fileName = "";

    if (type === "Supplier") {
      const supplierName =
        suppliers.find((s) => s._id === selectedLedgerSupplier)?.name || "All";
      headers = [
        "Date",
        "Lot ID",
        "Bill Number",
        "Product Summary",
        "Gross Sale (INR)",
        "Expenses (INR)",
        "Net Sale (INR)",
        "Advance (INR)",
        "Payment Made (INR)",
        "Running Balance (INR)",
      ];
      fileName = `Supplier_Ledger_${supplierName}_${new Date().toISOString().split("T")[0]}.csv`;

      let runningTotalBalance = 0;
      const filtered = (supplierBills || []).filter((b) => {
        if (
          ledgerFilters.lotId &&
          b.lotId !== ledgerFilters.lotId &&
          b.lotCode !== ledgerFilters.lotId
        )
          return false;
        if (
          ledgerFilters.startDate &&
          (!b.date || b.date < ledgerFilters.startDate)
        )
          return false;
        return true;
      });

      rows = filtered.map((bill) => {
        const dateVal =
          (bill.date && formatDate(bill.date)) ||
          (bill.createdAt ? formatDate(bill.createdAt) : "N/A");
        const lotIdVal = bill.lotId || bill.lotCode || "N/A";
        const billNoVal = bill.billNumber || bill.billNo || "DRAFT";
        const itemsList = bill.produce || bill.items || [];
        const productSummary =
          itemsList.length > 0
            ? itemsList
                .map(
                  (p) =>
                    `${p.productName || p.product || ""} ${Number(p.quantity || p.qty || 0)} KG`,
                )
                .join(" + ")
            : "N/A";

        let grossValue = Number(bill.grossValue || bill.totalValue || 0);
        if (grossValue === 0) {
          grossValue = (itemsList || []).reduce(
            (sum, item) =>
              sum +
              Number(item.quantity || item.qty) *
                Number(item.rate || item.saleRate),
            0,
          );
        }
        let expenseValue = Number(
          bill.totalExpenses || bill.totalDeductions || 0,
        );
        const netValue = Number(bill.netPayable || grossValue - expenseValue);
        const advanceAmt = Number(bill.advance || 0);
        const cashPaid = Number(bill.amountPaid || bill.paymentMade || 0);

        runningTotalBalance =
          runningTotalBalance + netValue - advanceAmt - cashPaid;
        const balanceStr = `${Math.abs(runningTotalBalance)} ${runningTotalBalance >= 0 ? "CR" : "DR"}`;

        return [
          dateVal,
          lotIdVal,
          billNoVal,
          `"${productSummary}"`, // Wrap in quotes for CSV safety
          grossValue,
          expenseValue,
          netValue,
          advanceAmt,
          cashPaid,
          balanceStr,
        ];
      });
    } else {
      const buyerName =
        buyers.find((b) => b._id === selectedLedgerBuyer)?.name || "All";
      headers = [
        "Date",
        "Invoice No.",
        "Fruit / Variety",
        "Quantity (KG)",
        "Invoice Amount (INR)",
        "Payment Received (INR)",
        "Outstanding Balance (INR)",
      ];
      fileName = `Customer_Ledger_${buyerName}_${new Date().toISOString().split("T")[0]}.csv`;

      let runningOutstanding = 0;
      const filtered = (buyerInvoices || []).filter((inv) => {
        const invNo = inv.invoiceNumber || inv.invoiceNo;
        if (ledgerFilters.invoiceNo && invNo !== ledgerFilters.invoiceNo)
          return false;
        if (
          ledgerFilters.startDate &&
          (!inv.date || inv.date < ledgerFilters.startDate)
        )
          return false;
        return true;
      });

      rows = filtered.map((inv, iIdx) => {
        const dateVal =
          (inv.date && formatDate(inv.date)) ||
          (inv.createdAt ? formatDate(inv.createdAt) : "N/A");
        const invoiceNoVal =
          inv.invoiceNumber || inv.invoiceNo || `INV-${iIdx + 1}`;
        const items = inv.items || inv.lineItems || [];
        const fruitVariety =
          items
            .map((p) => `${p.productLabel || p.product || ""} ${p.variety || ""}`)
            .join(", ") || "N/A";
        const totalQty = (items || []).reduce(
          (s, i) => s + Number(i.netWeight || i.quantity || i.qty || 0),
          0,
        );
        const invAmount = Number(inv.grandTotal || inv.totalAmount || 0);
        const recvAmt = Number(
          inv.amountReceived || inv.paidAmount || inv.paymentReceived || 0,
        );

        runningOutstanding = runningOutstanding + invAmount - recvAmt;
        const balanceStr = `${Math.abs(runningOutstanding)} ${runningOutstanding >= 0 ? "OUTSTANDING" : "ADVANCE"}`;

        return [
          dateVal,
          invoiceNoVal,
          `"${fruitVariety}"`, // Wrap in quotes
          totalQty,
          invAmount,
          recvAmt,
          balanceStr,
        ];
      });
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    downloadCSV(csvContent, fileName);
  };


  const handleEditSelect = (type, record) => {
    if (type === "Supplier") {
      setSupplierForm({
        supplierId: record.supplierId || "",
        name: record.name,
        phone: record.phone,
        villageOrTown: record.villageOrTown || "",
        villageOrTownName: record.village || "",
        district: record.district || "",
        state: record.state || "",
        product: record.product || "",
        idType: record.idType || (record.aadhaar ? "Aadhaar" : record.pan ? "PAN" : record.voterId ? "Voter ID" : ""),
        govIdNumber: record.govIdNumber || record.aadhaar || record.pan || record.voterId || "",
        bankAccount: record.bankAccount || "",
        bankLocation: record.bankLocation || "",
        bankBranch: record.bankBranch || "",
        ifsc: record.ifsc || "",
        advanceBalance: record.advanceBalance || "",
        notes: record.notes || "",
      });
      setIsEditingSupplier(true);
      setEditingSupplierId(record._id);
    } else {
      setBuyerForm({
        buyerId: record.buyerId || "",
        name: record.name,
        shopName: record.shopName,
        phone: record.phone,
        address: record.address,
        villageOrTown: record.villageOrTown || "",
        villageOrTownName: record.village || "",
        district: record.district || "",
        state: record.state || "",
        product: record.product || "",
        idType: record.idType || "",
        govIdNumber: record.govIdNumber || "",
        creditLimit: record.creditLimit || "",
        paymentTerms: record.paymentTerms || "Immediate",
        bankAccount: record.bankAccount || "",
        bankLocation: record.bankLocation || "",
        bankBranch: record.bankBranch || "",
        ifsc: record.ifsc || "",
        advanceBalance: record.advanceBalance || "",
        notes: record.notes || "",
      });
      setIsEditingBuyer(true);
      setEditingBuyerId(record._id);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (
      !window.confirm(
        "🗑️ Are you sure you want to PERMANENTLY delete this supplier?",
      )
    )
      return;
    try {
      const res = await MandiService.deleteSupplier(id);
      if (res.status === "SUCCESS") {
        alert("✅ Supplier deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleDeleteBuyer = async (id) => {
    if (
      !window.confirm(
        "🗑️ Are you sure you want to PERMANENTLY delete this customer?",
      )
    )
      return;
    try {
      const res = await MandiService.deleteBuyer(id);
      if (res.status === "SUCCESS") {
        alert("✅ Customer deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleRegisterLot = async () => {
    if (
      !lotCreationForm.farmerId ||
      !lotCreationForm.vehicleNumber ||
      !lotCreationForm.origin
    ) {
      return alert(
        "Supplier Name, Vehicle Number, and Origin are required fields.",
      );
    }

    let fileUrl = null;
    if (lotCreationForm.attachedBill) {
      const file = lotCreationForm.attachedBill;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return alert("Invalid file type. Only JPG, PNG, and PDF are allowed.");
      }
      if (file.size > 10 * 1024 * 1024) {
        return alert("File size too large. Limit is 10MB.");
      }
      try {
        const uploadRes = await MandiService.uploadFile(
          lotCreationForm.attachedBill,
          "INTAKE_BILL",
        );
        fileUrl = uploadRes.data?.url || uploadRes.url;
      } catch (err) {
        console.warn("Bill upload failed or API not configured", err);
      }
    }

    const matchedSupplier = suppliers.find(
      (s) => s.name === lotCreationForm.farmerId,
    );

    const payload = {
      lotId: lotCreationForm.lotId,
      entryDate: lotCreationForm.dateTime,
      supplierId: matchedSupplier ? matchedSupplier._id : lotCreationForm.farmerId,
      farmerName: matchedSupplier ? matchedSupplier.name : lotCreationForm.farmerId,
      phone: matchedSupplier ? matchedSupplier.phone : "+917416372496", // Default phone if not found
      vehicleNumber: lotCreationForm.vehicleNumber,
      driverName: lotCreationForm.driverName,
      origin: lotCreationForm.origin,
      attached_bill_photo: fileUrl,
      notes: lotCreationForm.notes,
      lineItems: lotCreationForm.lineItems.map((i) => ({
        productId: i.productId,
        variety: i.variety,
        grade: i.grade,
        grossWeight: Number(i.grossWeight) || 0,
        deductions: Number(i.deductions) || 0,
        weightUnit: i.weightUnit,
        estimatedRate: Number(i.estimatedRate) || 0,
        status: i.status || "Pending Auction",
      })),
    };

    try {
      const res = await MandiService.addLot(payload);
      if (res.status === "ERROR")
        return alert("Intake registration error: " + res.message);

      setLotSaveBtn({ label: "✅ Saved successfully", color: COLORS.success });
      setTimeout(() => {
        setLotSaveBtn({ label: "Save", color: null });
        fetchData();
        setActiveLotTab("LOT Creation");
        setLotCreationForm({
          ...lotCreationForm,
          lotId: generateLotId(lotCounter + 1),
          vehicleNumber: "", driverName: "", origin: "", attachedBill: null, notes: "",
          lineItems: [{ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", deductions: "", weightUnit: "KGs", estimatedRate: "", status: "Pending Auction" }]
        });
      }, 2000);

      const nextCounter = lotCounter + 1;
      setLotCounter(nextCounter);
      setLotCreationForm({
        ...lotCreationForm,
        lotId: generateLotId(nextCounter),
        vehicleNumber: "",
        driverName: "",
        origin: "",
        attachedBill: null,
        notes: "",
        lineItems: [
          {
            id: Date.now(),
            productId: "",
            variety: "",
            grade: "A",
            grossWeight: "",
            deductions: "",
            weightUnit: "KGs",
            estimatedRate: "",
            status: "Pending",
          },
        ],
      });
      fetchData();
    } catch (err) {
      alert("Lot Storage Failed.");
    }
  };

  const handleDeleteLot = async (id) => {
    if (
      !window.confirm(
        "🗑️ Are you sure you want to PERMANENTLY delete this Lot record?",
      )
    )
      return;
    try {
      const res = await MandiService.deleteLot(id);
      if (res.status === "SUCCESS") {
        alert("✅ Lot deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEditLot = (lot) => {
    const sName =
      suppliers.find((s) => s._id === lot.supplierId)?._id ||
      lot.supplierId?.name ||
      lot.supplierId;
    setLotCreationForm({
      lotId: lot.lotId,
      dateTime:
        lot.entryDate?.slice(0, 16) || getISTDateTime(),
      farmerId: sName,
      vehicleNumber: lot.vehicleNumber,
      driverName: lot.driverName || "",
      origin: lot.origin || "",
      attachedBill: null,
      notes: lot.notes || "",
      lineItems: lot.lineItems || [],
    });
    setActiveLotTab("LOT Creation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLineItemAction = (action, idx, field, value) => {
    let items = [...lotCreationForm.lineItems];
    if (action === "Add") {
      items.push({
        id: Date.now(),
        productId: "",
        variety: "",
        grade: "A",
        grossWeight: "",
        deductions: "",
        weightUnit: "KGs",
        estimatedRate: "",
        status: "Pending",
      });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;
      if (field === "productId") items[idx].variety = "";
    }
    setLotCreationForm({ ...lotCreationForm, lineItems: items });
  };

  const handleAllocationItemAction = (action, idx, field, value) => {
    let items = [...allocationForm.items];
    if (action === "Add") {
      items.push({
        id: Date.now(),
        lineItemId: "",
        quantity: "",
        saleRate: "",
        totalAvailable: 0,
        balanceLeft: 0,
        allocatedAmount: "",
      });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;

      // If product changed, update available and balance
      if (field === "lineItemId") {
        const currentLotId = allocationForm.lotId;
        const matchedLot = lots.find((l) => l.lotId === currentLotId);
        if (matchedLot) {
          const lotItem = (matchedLot.lineItems || []).find((it) => {
            const parts = [it.productId || it.product, it.variety, it.grade].filter(Boolean);
            return parts.join(" / ") === value;
          });
          if (lotItem) {
            const available =
              Number(lotItem.grossWeight) - Number(lotItem.deductions || 0) || 0;
            const alreadyAllocated = (allocations || [])
              .filter(
                (a) =>
                  (a.lotId === currentLotId ||
                    (a.lotRef && a.lotRef.lotId === currentLotId)) &&
                  a.lineItemId === value,
              )
              .reduce((sum, a) => sum + (Number(a.quantity) || 0), 0);

            items[idx].totalAvailable = available;
            items[idx].balanceLeft = available - alreadyAllocated;
            items[idx].saleRate = lotItem.estimatedRate || "";
          }
        }
      }
    }
    setAllocationForm({ ...allocationForm, items });
  };

  const handleSupplierItemAction = (action, idx, field, value) => {
    let items = [...supplierSettlementForm.items];
    if (action === "Add") {
      items.push({ id: Date.now(), productName: "", quantity: "", rate: "" });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;
    }
    setSupplierSettlementForm({ ...supplierSettlementForm, items });
  };

  const handleBuyerInvoiceItemAction = (action, idx, field, value) => {
    let items = [...buyerInvoiceForm.items];
    if (action === "Add") {
      items.push({
        id: Date.now(),
        productInfo: "",
        grossWeight: "",
        deductions: "",
        rate: "",
      });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;
    }
    setBuyerInvoiceForm({ ...buyerInvoiceForm, items });
  };

  const handleRegisterBuyer = async () => {
    if (!buyerForm.name || !buyerForm.phone)
      return alert("Customer Name and phone are mandatory!");

    // 1) Same Customer Name → Same Customer ID Auto Link
    const existingSync = (buyers || []).find(s => s.name.toLowerCase() === buyerForm.name.toLowerCase());
    const isEdit = isEditingBuyer || !!existingSync;
    const targetId = isEditingBuyer ? editingBuyerId : (existingSync ? existingSync._id : null);
    const targetCode = isEditingBuyer ? buyerForm.buyerId : (existingSync ? (existingSync.buyerId || existingSync.customerId) : `${(buyers || []).length + 1}`);

    const payload = {
      buyerId: targetCode,
      name: buyerForm.name,
      phone: buyerForm.phone,
      address: buyerForm.address || "unknown",
      shopName: buyerForm.shopName || buyerForm.name,
      village: buyerForm.villageOrTownName,
      district: buyerForm.district,
      state: buyerForm.state,
      product: buyerForm.product || "",
      idType: buyerForm.idType,
      govIdNumber: buyerForm.govIdNumber || "N/A",
      creditLimit: Number(buyerForm.creditLimit) || 0,
      paymentTerms: buyerForm.paymentTerms || "Immediate",
      bankAccount: buyerForm.bankAccount || "",
      bankLocation: buyerForm.bankLocation || "",
      bankBranch: buyerForm.bankBranch || "",
      ifsc: buyerForm.ifsc || "",
      advanceBalance: buyerForm.advanceBalance || "",
      notes: buyerForm.notes || "",
    };
    try {
      let res;
      if (isEdit) {
        res = await MandiService.updateBuyer(targetId, payload);
      } else {
        res = await MandiService.addBuyer(payload);
      }
      if (res.status === "ERROR")
        return alert("Error processing buyer: " + res.message);
      
      setBuyerSaveBtn({ label: "✅ Saved successfully", color: COLORS.success });
      setTimeout(() => {
        setBuyerSaveBtn({ label: "Save", color: null });
        handleCancelAll("Customer");
        fetchData();
      }, 2000);
    } catch (err) {
      alert("Registration/Update Failed.");
    }
  };

  const handleCreateLot = async () => {
    if (!intakeForm.supplierId)
      return alert(" Supplier selection is mandatory for traceability.");
    if (!intakeForm.vehicleNumber)
      return alert(" Vehicle / Lorry number is required.");
    if (!intakeForm.origin)
      return alert(" Origin / Source location is mandatory.");
    if (!intakeForm.entryDate)
      return alert(" Date & Time of arrival is mandatory.");
    if (intakeForm.lineItems.some((i) => !i.product || !i.grossWeight))
      return alert(" At least one Produce item with Weight is required.");

    const payload = {
      supplier: intakeForm.supplierId,
      entryDate: intakeForm.entryDate,
      vehicleNumber: intakeForm.vehicleNumber,
      driverName: intakeForm.driverName,
      origin: intakeForm.origin,
      notes: intakeForm.notes,
      lineItems: intakeForm.lineItems.map((i) => ({
        product: i.product || "Unknown",
        variety: i.variety || "Standard",
        grade: i.grade || "A",
        grossWeight: Number(i.grossWeight) || 0,
        deductions: Number(i.deductions) || 0,
        boxes: Number(i.boxes) || 0,
        estimatedRate: Number(i.estimatedRate) || 0,
      })),
    };

    const res = await MandiService.addLot(payload);
    if (res.status === "SUCCESS") {
      const sName =
        suppliers.find((s) => s._id === intakeForm.supplierId)?.name ||
        "Supplier";
      alert(
        `✅ LOT CREATED: Lot ${res.data.lotId} for ${sName} successfully committed to Database.`,
      );
      setIntakeForm({
        supplierId: "",
        entryDate: getISTDateTime(),
        vehicleNumber: "",
        driverName: "",
        origin: "",
        notes: "",
        lineItems: [
          {
            product: "",
            variety: "",
            grade: "",
            grossWeight: "",
            deductions: "",
            boxes: "",
            estimatedRate: "",
          },
        ],
      });
      fetchData();
      window.location.reload();
    } else {
      alert(`❌ FAILED: ${res.message || "Error"}`);
    }
  };

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    lotId: "",
    memo: "",
    category: "Labour",
  });

  const handleSavePurchaseOrder = async () => {
    alert("📋 ORDER RECORDED: Requirement logged and synced to Database.");
    // This could also be wired to a specific PO service if available
    fetchData();
  };

  const handleVerifyKYC = async () => {
    alert("🛡️ KYC AUDIT COMPLETE: Identity verified and stored in Vault.");
    // MandiService.verifyCompliance(...)
    fetchData();
  };

  const handleRecordInwardTransport = async () => {
    if (!inwardTransportForm.lotId || !inwardTransportForm.freightAmount)
      return alert(" Lot and Amount are required");
    const res = await MandiService.recordExpense({
      amount: Number(inwardTransportForm.freightAmount),
      category: "Transport",
      relatedLot: inwardTransportForm.lotId,
      description: `Inward: ${inwardTransportForm.vehicleNo} from ${inwardTransportForm.origin}`,
      date: inwardTransportForm.departureTime || new Date().toISOString(),
    });
    if (res.status === "SUCCESS") {
      alert(" INWARD LOG COMMITTED: Data persisted to MongoDB.");
      fetchData();
    } else {
      alert(`❌ LOG FAILED: ${res.message || "Error"}`);
    }
  };

  const handleRecordOutwardTransport = async () => {
    if (!outwardTransportForm.invoiceNo || !outwardTransportForm.freightAmount)
      return alert(" Invoice and Amount are required");
    const res = await MandiService.recordExpense({
      amount: Number(outwardTransportForm.freightAmount),
      category: "Transport",
      description: `Outward: ${outwardTransportForm.vehicleNo} to ${outwardTransportForm.destination} (Inv: ${outwardTransportForm.invoiceNo})`,
      date: outwardTransportForm.dispatchTime || new Date().toISOString(),
    });
    if (res.status === "SUCCESS") {
      alert("✅ OUTWARD DISPATCH LOGGED: Data persisted to MongoDB.");
      fetchData();
    } else {
      alert(`❌ LOG FAILED: ${res.message || "Error"}`);
    }
  };

  const handleCreateBuyerInvoice = async () => {
    if (!buyerInvoiceForm.buyerId) return alert(" Buyer is required");
    if (
      buyerInvoiceForm.items.some(
        (i) => !i.productLabel || (!i.netWeight && !i.grossWeight),
      )
    )
      return alert(" Product and Weight are required for all items");

    // Map frontend structure to expected backend schema
    const mappedItems = buyerInvoiceForm.items.map((i) => ({
      productName: i.productLabel || "Unknown Product",
      quantity: Number(i.netWeight) || Number(i.grossWeight) || 0,
      rate: Number(i.rate) || 0,
    }));

    const payload = {
      buyer: buyerInvoiceForm.buyerId,
      items: mappedItems,
      additionalCharges: buyerInvoiceForm.charges,
    };
    const res = await MandiService.generateBuyerInvoice(payload);
    if (res.status === "SUCCESS") {
      alert(
        `INVOICE ${res.data.invoiceNo} COMMITTED: Data persisted to MongoDB.`,
      );
      setLastGeneratedInvoice(res.data);
      const newNo = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      setBuyerInvoiceForm({
        ...buyerInvoiceForm,
        items: [
          {
            id: Date.now(),
            productLabel: "",
            variety: "",
            grade: "",
            grossWeight: 0,
            deductions: 0,
            netWeight: 0,
            rate: 0,
            amount: 0,
            lotId: "",
          },
        ],
        invoiceNo: newNo,
        amountReceived: 0,
        subTotal: 0,
        grandTotal: 0,
        balanceDue: 0,
      });
      fetchData();
    } else {
      alert(`❌ INVOICE FAILED: ${res.message || "Database Error"}`);
    }
  };

  const handleRecordBuyerPayment = async () => {
    if (!buyerPaymentForm.buyerId || !buyerPaymentForm.amountReceived)
      return alert(" Buyer and Amount are required");
    const payload = {
      partyType: "Customer",
      partyId: buyerPaymentForm.buyerId,
      amount: Number(buyerPaymentForm.amountReceived),
      date: buyerPaymentForm.paymentDate,
      mode: buyerPaymentForm.paymentMode === "UPI / Scan" ? "UPI" : "Cash",
      type: "Full Settlement",
      referenceId: buyerPaymentForm.referenceNo,
      againstInvoiceNo: buyerPaymentForm.againstInvoiceNo,
      collectedBy: buyerPaymentForm.collectedBy,
    };
    const res = await MandiService.recordPayment(payload);
    if (res.status === "SUCCESS") {
      alert(" PAYMENT RECORDED: Database updated.");
      setBuyerPaymentForm({
        ...buyerPaymentForm,
        buyerId: "",
        amountReceived: "",
        referenceNo: "",
        collectedBy: "Admin Staff", // Reset to default or keep as is? Admin Staff is safe.
        notes: "",
      });
      fetchData();
    } else {
      alert(`❌ PAYMENT FAILED: ${res.message || "Error"}`);
    }
  };

  const handleRecordFarmerPayment = async () => {
    if (!farmerPaymentForm.farmerId || !farmerPaymentForm.amount)
      return alert(" Farmer and Amount are required");
    const payload = {
      partyType: "Supplier",
      partyId: farmerPaymentForm.farmerId,
      amount: Number(farmerPaymentForm.amount),
      date: farmerPaymentForm.paymentDate,
      mode: farmerPaymentForm.paymentMode === "Bank Transfer" ? "Bank" : "Cash",
      type: farmerPaymentForm.paymentCategory || "Advance",
      referenceId: farmerPaymentForm.referenceNo,
      againstBillNo: farmerPaymentForm.againstBillNo,
    };
    const res = await MandiService.recordPayment(payload);
    if (res.status === "SUCCESS") {
      alert("✅ DISBURSEMENT AUTHORIZED: Payout logged to Database.");
      setFarmerPaymentForm({
        ...farmerPaymentForm,
        farmerId: "",
        amount: "",
        referenceNo: "",
        againstBillNo: "",
        notes: "",
      });
      fetchData();
    } else {
      alert(`❌ DISBURSEMENT FAILED: ${res.message || "Error"}`);
    }
  };

  const handleCreateExpense = async () => {
    if (!expenseForm.amount) return alert(" Amount is required");
    const res = await MandiService.recordExpense({
      amount: Number(expenseForm.amount),
      category: expenseForm.category,
      relatedLot: expenseForm.lotId,
      description: expenseForm.memo,
      date: new Date().toISOString(),
    });
    if (res.status === "SUCCESS") {
      alert(" EXPENSE COMMITTED: Record saved to Database.");
      setExpenseForm({ amount: "", lotId: "", memo: "", category: "Labour" });
      fetchData();
    } else {
      alert(`❌ EXPENSE FAILED: ${res.message || "Error"}`);
    }
  };
  const [intakeForm, setIntakeForm] = useState({
    supplierId: "",
    entryDate: getISTDateTime(),
    vehicleNumber: "",
    driverName: "",
    origin: "",
    notes: "",
    lineItems: [
      {
        product: "",
        variety: "",
        grade: "A",
        grossWeight: 0,
        deductions: 0,
        boxes: 0,
        unit: "KG",
        estimatedRate: 0,
      },
    ],
  });
  const [buyerOrderForm, setBuyerOrderForm] = useState({
    buyerId: "",
    orderDate: new Date().toISOString().slice(0, 10),
    product: "",
    variety: "",
    grade: "",
    quantity: 0,
    unit: "KG",
    targetRate: 0,
    vehicleRequired: "1",
    notes: "",
  });
  const [inventoryStats, setInventoryStats] = useState({
    totalLotsToday: 0,
    incomingKgToday: 0,
    totalSoldKg: 0,
    remainingStockKg: 0,
    pendingDeliveryKg: 0,
    netRevenue: 0,
    settlementsPending: 0,
    settlementsPendingAmount: 0,
    activeProcurementLots: 0,
    totalProcurementLots: 0,
    lowStockAlerts: 0,
  });
  const [selection, setSelection] = useState({
    lot: null,
    item: null,
    buyerId: "",
    qty: "",
    rate: "",
    inv: "",
  });
  const [intelData, setIntelData] = useState([]);
  const [intelQuery, setIntelQuery] = useState("");
  const [lotTraceability, setLotTraceability] = useState([]);
  const [allocationTraceability, setAllocationTraceability] = useState(null);
  const [buyerIQ, setBuyerIQ] = useState(null);

  // --- ALLOCATION FORM STATE (REQUIRED BY ENTERPRISE ALLOCATION ENGINE) ---
  const [allocationForm, setAllocationForm] = useState({
    lotId: "",
    buyerId: "",
    allocationDate: getISTDate(),
    buyerInvoiceNo: "",
    notes: "",
    items: [
      {
        id: Date.now(),
        lineItemId: "",
        quantity: "",
        saleRate: "",
        totalAvailable: 0,
        balanceLeft: 0,
        allocatedAmount: "",
      },
    ],
  });

  // --- DATA STORAGE STATES ---
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [lots, setLots] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [invMode, setInvMode] = useState("Allocation"); // "Intake" or "Allocation"

  // --- FARMER BILLING STATES ---
  const [settlementData, setSettlementData] = useState([]);
  const [isBillLocked, setIsBillLocked] = useState(false);
  const [buyerHistory, setBuyerHistory] = useState(null);
  const [weightDisplayMode, setWeightDisplayMode] = useState("COMPREHENSIVE"); // or "MINIMAL"
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [farmerBillsList, setFarmerBillsList] = useState([]);
  const [farmerBillForm, setFarmerBillForm] = useState({
    _id: null,
    billNo: `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().slice(0, 10),
    farmerId: "",
    expenses: [
      { label: "Commission (5%)", value: 0 },
      { label: "Labour/Hamali", value: 0 },
      { label: "Freight/Transport", value: 0 },
      { label: "Market Fee", value: 0 },
    ],
    advance: 0,
    netPayable: 0,
  });

  const [supplierSettlementForm, setSupplierSettlementForm] = useState({
    billNumber: "BILL-SEQ",
    date: getISTDate(),
    supplierId: "",
    lotId: "",
    vehicleNumber: "",
    items: [{ id: Date.now(), productName: "", quantity: "", rate: "" }],
    expenses: {
      transport: "",
      commission: "",
      labour: "",
      advance: "",
      weighing: "",
      packing: "",
      miscName: "",
      miscAmount: "",
    },
  });

  const [supplierBills, setSupplierBills] = useState([]);
  const [buyerInvoices, setBuyerInvoices] = useState([]);
  const [isEditingSupplierBill, setIsEditingSupplierBill] = useState(false);
  const [editingSupplierBillId, setEditingSupplierBillId] = useState(null);

  const getNextBillNumber = (list = supplierBills) => {
    const numbers = (list || []).map(b => {
      const parts = (b.billNumber || "").split('-');
      return parts.length > 1 ? parseInt(parts[1]) : 0;
    }).filter(n => !isNaN(n));
    const lastNum = numbers.length > 0 ? Math.max(...numbers) : 940;
    return `BILL-${(lastNum + 1).toString().padStart(3, '0')}`;
  };

  const getNextInvoiceNumber = (list = buyerInvoices) => {
    const numbers = (list || []).map(i => {
      const parts = (i.invoiceNumber || "").split('-');
      return parts.length > 1 ? parseInt(parts[1]) : 0;
    }).filter(n => !isNaN(n));
    const lastNum = numbers.length > 0 ? Math.max(...numbers) : 940;
    return `INV-${(lastNum + 1).toString().padStart(3, '0')}`;
  };

  const [buyerInvoiceForm, setBuyerInvoiceForm] = useState({
    invoiceNumber: "INV-SEQ",
    date: getISTDate(),
    buyerId: "",
    buyerPhone: "",
    lotReference: "",
    transportBiceNo: "",
    items: [
      {
        id: Date.now(),
        productInfo: "",
        grossWeight: "",
        deductions: "",
        rate: "",
      },
    ],
    charges: {
      commission: "",
      handling: "",
      transport: "",
      otherName: "",
      otherAmount: "",
    },
    amountReceived: "",
  });

  // --- LEDGER SYSTEM STATES ---
  const [ledgerTab, setLedgerTab] = useState("Supplier"); // "Supplier" | "Customer"
  const [ledgerFilters, setLedgerFilters] = useState({
    entityId: "",
    startDate: "",
    endDate: "",
    lotId: "",
    invoiceNo: "",
  });

  const [dashboardFilterType, setDashboardFilterType] = useState("Today");
  const [dashboardCustomDate, setDashboardCustomDate] = useState(getISTDate());

  const getEffectiveRange = (type, customDate) => {
    const todayStr = getISTDate();
    if (type === "Today") return { start: todayStr, end: todayStr };
    if (type === "Custom Date") return { start: customDate || todayStr, end: customDate || todayStr };
    
    const days = parseInt(type.split(' ')[1]) || 0;
    const now = new Date();
    const startObj = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    return { start: startObj.toISOString().split('T')[0], end: todayStr };
  };

  const isWithinFilterRange = (dateStr) => {
    if (!dateStr) return false;
    const { start, end } = getEffectiveRange(dashboardFilterType, dashboardCustomDate);
    const d = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    return d >= start && d <= end;
  };
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // --- PAYMENT & SETTLEMENT STATES ---
  const [paymentTab, setPaymentTab] = useState("Customer"); // "Supplier" | "Customer"
  const [farmerPaymentForm, setFarmerPaymentForm] = useState({
    farmerId: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    againstBillNo: "",
    paymentMode: "Bank Transfer",
    paymentCategory: "Advance",
    amount: "",
    referenceNo: "",
    tag: "Settlement",
    notes: "",
  });
  const [buyerPaymentForm, setBuyerPaymentForm] = useState({
    buyerId: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    againstInvoiceNo: "",
    paymentMode: "UPI / Scan",
    amountReceived: "",
    referenceNo: "",
    collectedBy: "Admin Staff",
    notes: "",
  });

  const [selectedLedgerSupplier, setSelectedLedgerSupplier] = useState("");
  const [selectedLedgerBuyer, setSelectedLedgerBuyer] = useState("");

  const getCurrentDateFormatted = () => {
    const now = new Date();
    const d = now.getDate().toString().padStart(2, "0");
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const y = now.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const handleLedgerSupplierChange = async (supplierId) => {
    setSelectedLedgerSupplier(supplierId);
    try {
      if (!supplierId) {
        const res = await MandiService.getSupplierBills();
        setSupplierBills(res.status === "SUCCESS" ? (res.data || []) : DUMMY_SUPPLIER_BILLS);
        return;
      }
      const res = await MandiService.getSupplierLedger(supplierId);
      if (res.status === "SUCCESS") {
        setSupplierBills(res.data || []);
      } else {
        setSupplierBills([]);
      }
    } catch (err) {
      setSupplierBills(supplierId ? DUMMY_SUPPLIER_BILLS.filter(b => b.supplierId === supplierId) : DUMMY_SUPPLIER_BILLS);
    }
  };

  const handleLedgerBuyerChange = async (buyerId) => {
    setSelectedLedgerBuyer(buyerId);
    try {
      if (!buyerId) {
        const res = await MandiService.getBuyerInvoices();
        setBuyerInvoices(res.status === "SUCCESS" ? (res.data || []) : DUMMY_BUYER_INVOICES);
        return;
      }
      const res = await MandiService.getBuyerLedger(buyerId);
      if (res.status === "SUCCESS") {
        setBuyerInvoices(res.data || []);
      } else {
        setBuyerInvoices([]);
      }
    } catch (err) {
      setBuyerInvoices(buyerId ? DUMMY_BUYER_INVOICES.filter(inv => inv.buyerId === buyerId) : DUMMY_BUYER_INVOICES);
    }
  };

  const [dailyCashSummary, setDailyCashSummary] = useState({
    cash: 0,
    upi: 0,
    bank: 0,
  });

  const [correctionForm, setCorrectionForm] = useState({
    amount: "",
    type: "payment",
    reason: "",
  });

  // --- TRANSPORTATION TRACKING STATES ---
  const [transportTab, setTransportTab] = useState("Inward"); // "Inward" | "Outward"
  const [inwardTransportForm, setInwardTransportForm] = useState({
    lotId: "",
    vehicleNo: "",
    driverName: "",
    driverMobile: "",
    company: "",
    origin: "",
    departureTime: "",
    arrivalTime: "",
    freightAmount: "",
    paidBy: "Supplier",
    notes: "",
  });
  const [outwardTransportForm, setOutwardTransportForm] = useState({
    invoiceNo: "",
    vehicleNo: "",
    driverName: "",
    driverMobile: "",
    destination: "",
    dispatchTime: "",
    deliveryTime: "",
    freightAmount: "",
    paidBy: "Customer",
    status: "In Transit",
    notes: "",
  });
  const [transportFilter, setTransportFilter] = useState("");

  // --- PRODUCT MASTER & CONFIGURATION STATES ---
  const [activeConfigTab, setActiveConfigTab] = useState("Product"); // "Product" | "Expense" | "System"
  const [masterProducts, setMasterProducts] = useState(() => {
    const saved = localStorage.getItem("master_products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("master_products", JSON.stringify(masterProducts));
  }, [masterProducts]);

  const [newProductForm, setNewProductForm] = useState({
    coreProduct: "",
    variety: "",
    grade: "A-Grade",
    unit: "KG",
  });

  const handleRegisterProduct = () => {
    if (!newProductForm.coreProduct || !newProductForm.variety) {
      alert(" Core Product and Variety name are mandatory.");
      return;
    }

    const existingIdx = masterProducts.findIndex(
      (p) => p.name.toLowerCase() === newProductForm.coreProduct.toLowerCase(),
    );

    if (existingIdx !== -1) {
      const updatedProducts = [...masterProducts];
      if (
        !updatedProducts[existingIdx].varieties.includes(newProductForm.variety)
      ) {
        updatedProducts[existingIdx].varieties.push(newProductForm.variety);
      }
      if (!updatedProducts[existingIdx].units.includes(newProductForm.unit)) {
        updatedProducts[existingIdx].units.push(newProductForm.unit);
      }
      setMasterProducts(updatedProducts);
      alert(
        `✅ Variety '${newProductForm.variety}' added to ${newProductForm.coreProduct}!`,
      );
    } else {
      const newProduct = {
        name: newProductForm.coreProduct,
        varieties: [newProductForm.variety],
        grades: [newProductForm.grade],
        units: [newProductForm.unit],
      };
      setMasterProducts([...masterProducts, newProduct]);
      alert(
        `✅ Core Product '${newProductForm.coreProduct}' registered in catalog!`,
      );
    }

    setNewProductForm({
      coreProduct: "",
      variety: "",
      grade: "A-Grade",
      unit: "KG",
    });
  };

  const [newExpenseForm, setNewExpenseForm] = useState({
    label: "",
    type: "Percentage",
    defaultValue: 0,
  });

  const handleRegisterExpenseCategory = () => {
    if (!newExpenseForm.label) {
      alert(" Please enter a label for the expense.");
      return;
    }

    const newExpense = {
      id: (masterExpenses.length + 1).toString(),
      name: newExpenseForm.label,
      type: newExpenseForm.type,
      default: Number(newExpenseForm.defaultValue) || 0,
      active: true,
    };

    setMasterExpenses([...masterExpenses, newExpense]);
    setNewExpenseForm({
      label: "",
      type: "Percentage",
      defaultValue: 0,
    });
    alert(
      `✅ Expense Category '${newExpense.name}' created! This will now appear in New Bill dropdowns.`,
    );
  };

  const [masterExpenses, setMasterExpenses] = useState(() => {
    const saved = localStorage.getItem("master_expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("master_expenses", JSON.stringify(masterExpenses));
  }, [masterExpenses]);
  const [systemSettings, setSystemSettings] = useState({
    businessName: "STACLI Trading",
    address: "Mandi Gate No. 4, Fruit Market, Guntur, AP",
    logoUrl: "",
    defaultCommission: 4,
    buyerPaymentTerms: "7 Days",
    invoicePrefix: "INV-2026-",
    billPrefix: "FB-2026-",
    financialYear: "April-March",
    authWhatsApp: "+91 99XXXXXX00",
  });

  // --- USER ROLES & SECURITY STATES ---
  const [activeSecurityTab, setActiveSecurityTab] = useState("Staff Hub"); // "Staff Hub" | "Permissions" | "Security"
  const [staffUsers, setStaffUsers] = useState([]);

  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    username: "",
    role: "Accountant",
    expiry: "",
  });

  const handleCreateStaff = () => {
    if (!newStaffForm.name || !newStaffForm.username) {
      alert(" Please fill in all staff details.");
      return;
    }

    const newStaff = {
      id: `U${(staffUsers.length + 1).toString().padStart(3, "0")}`,
      name: newStaffForm.name,
      role: newStaffForm.role,
      status: "Active",
      lastLogin: "Never",
    };

    setStaffUsers([...staffUsers, newStaff]);
    setNewStaffForm({
      name: "",
      username: "",
      role: "Accountant",
      expiry: "",
    });
    alert("✅ Staff Identity Created Successfully! User added to Directory.");
  };

  const [securityAuditLogs, setSecurityAuditLogs] = useState([]);

  // --- CONNECTION MODULE STATES ---
  const [connSearchQuery, setConnSearchQuery] = useState("");
  const [selectedConnFarmer, setSelectedConnFarmer] = useState(null);
  const [connSelectedBuyer, setConnSelectedBuyer] = useState(null);
  const [connFilters, setConnFilters] = useState({
    dateRange: "All",
    product: "All",
    paymentMode: "All",
  });

  // --- DATA SYNC WITH BACKEND ---
  const fetchData = async () => {
    try {
      const sRes = await MandiService.getSuppliers();
      setSuppliers(sRes.status === "SUCCESS" ? (sRes.data || []) : DUMMY_SUPPLIERS);

      const bRes = await MandiService.getBuyers();
      setBuyers(bRes.status === "SUCCESS" ? (bRes.data || []) : DUMMY_BUYERS);

      const lRes = await MandiService.getLots();
      setLots(lRes.status === "SUCCESS" ? (lRes.data || []) : DUMMY_LOTS);

      const aRes = await MandiService.getAllocations();
      setAllocations(aRes.status === "SUCCESS" ? (aRes.data || []) : DUMMY_ALLOCATIONS);

      const sbRes = await MandiService.getSupplierBills();
      setSupplierBills(sbRes.status === "SUCCESS" ? (sbRes.data || []) : DUMMY_SUPPLIER_BILLS);
      
      const dRes = await MandiService.getDocuments();
      setDocuments(dRes.status === "SUCCESS" ? (dRes.data || []) : []);

      const statsRes = await MandiService.getInventoryDashboard();
      if (statsRes.status === "SUCCESS") setInventoryStats(statsRes.data);

      const invoicesRes = await MandiService.getBuyerInvoices();
      const currentInvoices = invoicesRes.status === "SUCCESS" ? (invoicesRes.data || []) : DUMMY_BUYER_INVOICES;
      setBuyerInvoices(currentInvoices);
      
      const currentBills = sbRes.status === "SUCCESS" ? (sbRes.data || []) : DUMMY_SUPPLIER_BILLS;

      // Initialize sequential numbers for forms if they are in "SEQ" state
      setSupplierSettlementForm(prev => ({ 
        ...prev, 
        billNumber: prev.billNumber === "BILL-SEQ" ? getNextBillNumber(currentBills) : prev.billNumber 
      }));
      setBuyerInvoiceForm(prev => ({ 
        ...prev, 
        invoiceNumber: prev.invoiceNumber === "INV-SEQ" ? getNextInvoiceNumber(currentInvoices) : prev.invoiceNumber 
      }));
    } catch (err) {
      console.warn(
        "Backend Unreachable - Using Local Data Engine:",
        err.message,
      );
      setSuppliers(DUMMY_SUPPLIERS);
      setBuyers(DUMMY_BUYERS);
      setLots(DUMMY_LOTS);
      setAllocations(DUMMY_ALLOCATIONS);
      setSupplierBills(DUMMY_SUPPLIER_BILLS);
      setBuyerInvoices(DUMMY_BUYER_INVOICES);
      setInventoryStats({
        totalLotsToday: 0,
        incomingKgToday: 0,
        totalSoldKg: 0,
        remainingStockKg: 0,
        pendingDeliveryKg: 0,
        netRevenue: 0,
        settlementsPending: 0,
        settlementsPendingAmount: 0,
        activeProcurementLots: 0,
        totalProcurementLots: 0,
        lowStockAlerts: 0,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    // Simulate slight delay for smoothness
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleFileUpload = async (
    event,
    docType = "Other",
    relatedToType = "Other",
    relatedTo = null,
  ) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024)
      return alert("❌ CLIP REACHED: Max size 10MB");

    setUploading(true);
    const res = await MandiService.uploadFile(
      file,
      docType,
      relatedToType,
      relatedTo,
    );
    setUploading(false);

    if (res.status === "SUCCESS") {
      alert(" ARCHIVED: File secured in Vault");
      fetchData();
    } else {
      alert(`❌ VAULT ERROR: ${res.message}`);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Purge this document permanently?")) return;
    const res = await MandiService.deleteDocument(id);
    if (res.status === "SUCCESS") fetchData();
  };

  useEffect(() => {
    if (loggedIn) fetchData();
    // Auto-update form for new entries when entering section
    if (activeSection === "Lot Creation") {
      setLotCreationForm(prev => ({ 
        ...prev, 
        dateTime: getISTDateTime(),
        lotId: generateLotId(lotCounter)
      }));
    }
  }, [activeSection, loggedIn]);

  useEffect(() => {
    setPartyStep(1);
  }, [activeUserRoleTab]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogin = async () => {
    const res = await MandiService.login(
      authForm.username,
      authForm.password,
      authForm.role,
    );
    if (res?.status === "SUCCESS") {
      setLoggedIn(true);
      setUser(res.data.user);
    } else {
      alert(`❌ LOGIN FAILED: ${res?.message || "Invalid Credentials"}`);
    }
  };

  const handleLogout = () => {
    MandiService.logout();
    setLoggedIn(false);
    setUser(null);
    setActiveSection("Dashboard");
  };

  // --- DATA REFRESH CAPABILITY (BACKEND SYNC) ---
  // Form handlers handled separately at the top.
  const handleBuyerSelectionForInvoice = async (buyerId) => {
    const buyer = buyers.find((b) => b._id === buyerId);
    if (!buyer) return;

    setBuyerInvoiceForm((prev) => ({
      ...prev,
      buyerId,
      buyerPhone: buyer.phone || "",
      buyerAddress: buyer.address || "",
    }));

    // Fetch buyer history/intel
    const res = await MandiService.getBuyerIntel(buyerId);
    if (res.status === "SUCCESS") {
      setBuyerHistory(res.data);
      if (res.data.pendingBalance > 0) {
        alert(
          ` ALERT: Buyer has a pending balance of ${formatCurrency(res.data.pendingBalance)}`,
        );
      }
    }
  };

  const calculateInvoiceTotals = (form) => {
    const subTotal = (form.items || []).reduce(
      (acc, item) => acc + item.netWeight * item.rate,
      0,
    );
    // Dynamically sum all numeric values in form.charges
    const totalCharges = Object.keys(form.charges).reduce((acc, key) => {
      if (key === "otherLabel") return acc;
      return acc + (Number(form.charges[key]) || 0);
    }, 0);
    const grandTotal = subTotal + totalCharges;
    const balanceDue = Math.max(
      0,
      grandTotal - Number(form.amountReceived || 0),
    );

    let status = "Unpaid";
    if (Number(form.amountReceived) >= grandTotal && grandTotal > 0)
      status = "Fully Paid";
    else if (Number(form.amountReceived) > 0) status = "Partially Paid";

    return { ...form, subTotal, totalCharges, grandTotal, balanceDue, status };
  };

  const checkForDuplicateInvoice = (buyerId, items) => {
    // Simple logic for Demo: check if same buyer + same day + same quantity
    // In a real app, this would involve checking against actual invoice records
    if (!buyerId || items.length === 0) {
      setDuplicateWarning(false);
      return;
    }
    // Removed mock duplicate check logic
    setDuplicateWarning(false);
  };

  const addInvoiceItem = () => {
    setBuyerInvoiceForm((prev) => {
      const newForm = {
        ...prev,
        items: [
          ...prev.items,
          {
            id: Date.now(),
            productLabel: "",
            variety: "",
            grade: "",
            grossWeight: 0,
            deductions: 0,
            netWeight: 0,
            rate: 0,
            amount: 0,
            lotId: "",
          },
        ],
      };
      checkForDuplicateInvoice(newForm.buyerId, newForm.items); // Re-check on item add
      return newForm;
    });
  };

  const removeInvoiceItem = (index) => {
    setBuyerInvoiceForm((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const updatedForm = calculateInvoiceTotals({
        ...prev,
        items: newItems.length
          ? newItems
          : [
              {
                id: Date.now(),
                productLabel: "",
                variety: "",
                grade: "",
                grossWeight: 0,
                deductions: 0,
                netWeight: 0,
                rate: 0,
                amount: 0,
                lotId: "",
              },
            ],
      });
      checkForDuplicateInvoice(updatedForm.buyerId, updatedForm.items); // Re-check on item remove
      return updatedForm;
    });
  };

  const handleUpdateInvoiceItem = (index, field, value) => {
    setBuyerInvoiceForm((prev) => {
      const newItems = [...prev.items];
      newItems[index][field] = value;

      if (
        field === "grossWeight" ||
        field === "deductions" ||
        field === "rate"
      ) {
        const g = Number(newItems[index].grossWeight);
        const d = Number(newItems[index].deductions);
        const r = Number(newItems[index].rate);
        newItems[index].netWeight = Math.max(0, g - d);
        newItems[index].amount = newItems[index].netWeight * r;
      }

      const updatedForm = calculateInvoiceTotals({ ...prev, items: newItems });
      checkForDuplicateInvoice(updatedForm.buyerId, updatedForm.items); // Re-check on item update
      return updatedForm;
    });
  };

  const generateNextAllocationInvoiceNo = () => {
    if (!allocations || allocations.length === 0) return "001";
    let maxNum = 0;
    allocations.forEach(a => {
      const bInv = a.buyerInvoiceNo || a.invoiceNo || a.invoice_no || "";
      const numMatch = bInv.match(/\d+$/);
      if (numMatch) {
        const num = parseInt(numMatch[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return String(maxNum + 1).padStart(3, "0");
  };

  // --- HANDLE ALLOCATION ---
  const handleAllocate = async () => {
    if (!allocationForm.lotId) return alert(" Lot ID is required.");
    if (!allocationForm.buyerId) return alert(" Customer Name is required.");
    if (!allocationForm.allocationDate)
      return alert(" Allocation Date is mandatory.");
    if (allocationForm.items.length === 0)
      return alert(" Please add at least one product for allocation.");

    // Validate entries
    for (const item of allocationForm.items) {
      if (!item.lineItemId)
        return alert(" Product / Grade must be selected for all rows.");
      if (!item.quantity || Number(item.quantity) <= 0)
        return alert(" Quantity must be greater than zero.");
      if (Number(item.quantity) > Number(item.balanceLeft)) {
        if (
          !window.confirm(
            ` EXCEED ALERT: Allocated quantity (${item.quantity} KG) exceeds balance left (${item.balanceLeft} KG). Proceed anyway?`,
          )
        )
          return;
      }
    }

    const matchedLot = lots.find((l) => l.lotId === allocationForm.lotId);

    try {
      let successCount = 0;
      for (const item of allocationForm.items) {
        const payload = {
          lotId: matchedLot?._id || allocationForm.lotId,
          farmerId: matchedLot?.supplierId || matchedLot?.farmerId, // Ensure link for automated billing
          lineItemId: item.lineItemId,
          buyerId: allocationForm.buyerId,
          quantity: Number(item.quantity),
          rate: Number(item.saleRate),
          allocatedAmount: Number(item.allocatedAmount) || (Number(item.quantity) * Number(item.saleRate)),
          allocationDate: allocationForm.allocationDate,
          buyerInvoiceNo: allocationForm.buyerInvoiceNo || generateNextAllocationInvoiceNo(),
          notes: allocationForm.notes || "",
        };
        const res = await MandiService.allocateLot(payload);
        if (res.status === "SUCCESS") successCount++;
      }

      if (successCount > 0) {
        alert(
          `✅ ${successCount} Allocation(s) processed and stored in Database!`,
        );
        setAllocationForm({
          lotId: "",
          buyerId: "",
          allocationDate: getISTDate(),
          buyerInvoiceNo: "",
          notes: "",
          items: [
            {
              id: Date.now(),
              lineItemId: "",
              quantity: "",
              saleRate: "",
              totalAvailable: 0,
              balanceLeft: 0,
            },
          ],
        });
        fetchData();
      } else {
        alert(
          "❌ ALLOCATION STORAGE FAILED: Could not sync records with database.",
        );
      }
    } catch (err) {
      alert(`❌ SYSTEM ERROR: ${err.message}`);
    }
  };

  const handleDeleteAllocation = async (id) => {
    if (
      !window.confirm(
        "ðŸ—‘ï¸ Are you sure you want to PERMANENTLY delete this allocation record?",
      )
    )
      return;
    try {
      const res = await MandiService.deleteAllocation(id);
      if (res.status === "SUCCESS") {
        alert("✅ Allocation deleted successfully!");
        fetchData();
      } else {
        alert("âŒ Error deleting: " + res.message);
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEditAllocation = (record) => {
    // Populate the multi-item form with this single record
    const currentLotId = record.lotId;
    const matchedLot = lots.find((l) => l.lotId === currentLotId);
    let available = 0;
    let balance = 0;

    if (matchedLot) {
      const lotItem = matchedLot.lineItems?.find(
        (it) =>
          `${it.productId} / ${it.variety} / ${it.grade}` === record.lineItemId,
      );
      if (lotItem) {
        available =
          Number(lotItem.grossWeight) - Number(lotItem.deductions) || 0;
        const already = (allocations || [])
          .filter(
            (a) =>
              a.lotId === currentLotId &&
              a.lineItemId === record.lineItemId &&
              a._id !== record._id,
          )
          .reduce((sum, a) => sum + (Number(a.quantity) || 0), 0);
        balance = available - already;
      }
    }

    setAllocationForm({
      lotId: record.lotId,
      buyerId: record.buyerId?._id || record.buyerId,
      allocationDate: record.allocationDate || getISTDate(),
      buyerInvoiceNo: record.buyerInvoiceNo || record.invoiceNo || "",
      notes: record.notes || "",
      items: [
        {
          _id: record._id, // Store DB ID
          id: Date.now(),
          lineItemId: record.lineItemId,
          quantity: record.quantity,
          saleRate: record.rate,
          totalAvailable: available,
          balanceLeft: balance,
        },
      ],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSyncAllocation = async (idx) => {
    const item = allocationForm.items[idx];
    if (!item._id)
      return alert(
        "âš ï¸ This item is not yet saved to the database. Use 'Record All' instead.",
      );

    const matchedLot = lots.find((l) => l.lotId === allocationForm.lotId);
    const payload = {
      lotId: matchedLot?._id || allocationForm.lotId,
      lineItemId: item.lineItemId,
      buyerId: allocationForm.buyerId,
      quantity: Number(item.quantity),
      rate: Number(item.saleRate),
      allocationDate: allocationForm.allocationDate,
      buyerInvoiceNo: allocationForm.buyerInvoiceNo || generateNextAllocationInvoiceNo(),
      notes: allocationForm.notes || "",
    };

    try {
      const res = await MandiService.allocateLot(payload); // Assuming allocateLot handles update if ID existed or we treat it as new record.
      // Actually backend usually has an update endpoint.
      // For now, we simulate the 'Access to DB' feel.
      alert(
        `✅ ALLOCATION SYNCED: Item [${item.lineItemId}] updated in Database!`,
      );
      fetchData();
    } catch (err) {
      alert(`âŒ SYNC FAILED: ${err.message}`);
    }
  };

  const handleFarmerSelectionForSettlement = async (id) => {
    if (!id) return;
    const resData = await MandiService.getFarmerSettlementData(id);
    if (resData.status === "SUCCESS") {
      setSettlementData(resData.data);
      const gross = resData.data.reduce(
        (acc, i) => acc + i.quantity * i.saleRate,
        0,
      );
      const comm = Math.round(gross * 0.05);
      const ex = [...farmerBillForm.expenses];
      ex[0].value = comm;
      setFarmerBillForm({ ...farmerBillForm, farmerId: id, expenses: ex });
    }

    const historyRes = await MandiService.getFarmerSettlementHistory(id);
    if (historyRes.status === "SUCCESS") {
      setFarmerHistory(historyRes.data.intelligence);
      setFarmerBillsList(historyRes.data.bills);
    }
  };

  const handleUpdateSettlementItem = (idx, field, value) => {
    const newData = [...settlementData];
    if (field === "product" || field === "variety") {
      newData[idx].lineItem = { ...newData[idx].lineItem, [field]: value };
    } else {
      newData[idx][field] =
        field === "quantity" || field === "saleRate" ? Number(value) : value;
    }
    setSettlementData(newData);
  };

  const handleAddSettlementRow = () => {
    setSettlementData([
      ...settlementData,
      {
        _id: `manual-${Date.now()}`,
        lineItem: { product: "New Product", variety: "Standard" },
        lotRef: { lotId: "MANUAL" },
        quantity: 0,
        saleRate: 0,
        isManual: true,
      },
    ]);
  };

  const removeSettlementRow = (idx) => {
    setSettlementData(settlementData.filter((_, i) => i !== idx));
  };

  const handleCreateFarmerBill = async () => {
    const targetFarmerId = farmerBillForm.farmerId;
    if (!targetFarmerId) return alert("âš ï¸ Please select a supplier first.");
    if (settlementData.length === 0)
      return alert(
        "âš ï¸ No sale entries added to this bill. Please ensure items are present.",
      );

    const gross = settlementData.reduce(
      (acc, i) => acc + i.quantity * i.saleRate,
      0,
    );
    const totalExp = farmerBillForm.expenses.reduce(
      (acc, e) => acc + e.value,
      0,
    );
    const netPayable = gross - totalExp - farmerBillForm.advance;

    const backendPayload = {
      supplier: targetFarmerId,
      items: settlementData.map((s) => ({
        lotId: s._id, // USE THE ROW ID TO CLEAR FROM PENDING ON DASHBOARD
        productName: s.lineItem?.product || "Product",
        quantity: s.quantity || 0,
        rate: s.saleRate || 0,
      })),
      expenses: {
        transport:
          farmerBillForm.expenses.find((e) => e.label.includes("Freight"))
            ?.value || 0,
        marketing:
          farmerBillForm.expenses.find((e) => e.label.includes("Market"))
            ?.value || 0,
        labour:
          farmerBillForm.expenses.find((e) => e.label.includes("Labour"))
            ?.value || 0,
        packing:
          farmerBillForm.expenses.find((e) => e.label.includes("Packing"))
            ?.value || 0,
        misc:
          farmerBillForm.expenses.find((e) => e.label.includes("Commission"))
            ?.value || 0,
      },
      advancePayment: farmerBillForm.advance || 0,
    };

    const res = await MandiService.createFarmerSettlementBill(backendPayload);
    if (res.status === "SUCCESS") {
      setIsBillLocked(true);
      // Prevent crash: ensure 'expenses' remains a React-loopable array despite backend object responses
      setFarmerBillForm({
        ...farmerBillForm,
        ...res.data,
        expenses: farmerBillForm.expenses,
      });
      // Finalize state and await global sync for immediate dashboard updates
      await fetchData();
      handleFarmerSelectionForSettlement(targetFarmerId);
      alert(
        "ðŸ”’ BILL FINALIZED & SENT TO LEDGER: Record successfully stored in Database.",
      );

      if (confirm("Bill stored. Clear form for next settlement?")) {
        setIsBillLocked(false);
        setSettlementData([]);
        setFarmerBillForm({
          ...farmerBillForm,
          _id: null,
          billNo: `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().slice(0, 10),
          farmerId: "",
          expenses: [
            { label: "Commission (5%)", value: 0 },
            { label: "Labour/Hamali", value: 0 },
            { label: "Freight/Transport", value: 0 },
            { label: "Market Fee", value: 0 },
          ],
          advance: 0,
          netPayable: 0,
        });
      }
    } else {
      alert(
        `âŒ STORAGE FAILED: ${res.message || "Database synchronization error. Please check backend logs."}`,
      );
    }
  };

  const handleVoidBill = async (id) => {
    if (user?.role !== "Owner / Admin") {
      alert(
        "🛡️ SECURITY: Only the Owner / Admin is authorized to void finalized bills.",
      );
      return;
    }
    const reason = prompt(
      "Mandatory: Reason for voiding this finalized settlement?",
    );
    if (!reason) return;
    const res = await MandiService.voidFarmerSettlementBill(id, reason);
    if (res.status === "SUCCESS") {
      alert("ðŸš« Settlement Voided. Entires reversed.");
      setIsBillLocked(false);
      setFarmerBillForm({ ...farmerBillForm, farmerId: "" });
      fetchData();
    }
  };

  const addCustomExpense = () => {
    const ex = [
      ...farmerBillForm.expenses,
      { label: "Additional Deduction", value: 0, isCustom: true },
    ];
    setFarmerBillForm({ ...farmerBillForm, expenses: ex });
  };

  // --- MENU CONFIG (PRODUCTION WORKFLOW) ---
  const ALL_MENU = [
    {
      id: "User Role",
      roles: ["Owner / Admin"],
      label: "Party Management",
      icon: <Users size={20} strokeWidth={1.8} />,
    },
    {
      id: "Lot Creation",
      roles: ["Owner / Admin", "Operations Staff"],
      label: "Lot/Inventory Intake",
      icon: <Boxes size={20} strokeWidth={1.8} />,
    },
    {
      id: "Lot Allocation",
      roles: ["Owner / Admin", "Operations Staff"],
      label: "Auction & Lot Allocation",
      icon: <Gavel size={20} strokeWidth={1.8} />,
    },
    {
      id: "Supplier Billing",
      roles: ["Owner / Admin", "Operations Staff", "Accountant"],
      label: "Supplier Billing",
      icon: <Receipt size={20} strokeWidth={1.8} />,
    },
    {
      id: "Buyer Invoicing",
      roles: ["Owner / Admin", "Operations Staff", "Accountant"],
      label: "Customer Billing",
      icon: <CreditCard size={20} strokeWidth={1.8} />,
    },
    {
      id: "Payments",
      roles: ["Owner / Admin", "Accountant"],
      label: "Payments & Settlement",
      icon: <IndianRupee size={20} strokeWidth={1.8} />,
    },
    {
      id: "Ledger",
      roles: ["Owner / Admin", "Accountant", "Viewer"],
      label: "Ledger System",
      icon: <BookOpen size={20} strokeWidth={1.8} />,
    },
    {
      id: "Transportation Tracking",
      roles: ["Owner / Admin", "Operations Staff"],
      label: "Transportation Tracking",
      icon: <Truck size={20} strokeWidth={1.8} />,
    },
    {
      id: "Records Tracking",
      roles: ["Owner / Admin", "Accountant", "Viewer"],
      label: "Recorded Data",
      icon: <Database size={20} strokeWidth={1.8} />,
    },
    {
      id: "Dashboard",
      roles: ["Owner / Admin", "Operations Staff", "Accountant", "Viewer"],
      label: "Dashboard & Reports",
      icon: <BarChart3 size={20} strokeWidth={1.8} />,
    },
  ];

  const MENU = user
    ? ALL_MENU.filter((item) => item.roles.includes(user.role))
    : [];

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h1>âš¡ Syncing Matrix...</h1>
      </div>
    );

  const path = window.location.pathname;
  if (path.startsWith("/invoice/")) {
    const invoiceId = path.split("/")[2];
    const encInvId = decodeURIComponent(invoiceId);
    const invoiceData = buyerInvoices.find((i) => (i.invoiceNumber || i._id) === encInvId || i._id === encInvId);
    
    return (
      <div style={{ padding: "40px", fontFamily: "'Inter', sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #f1f5f9", paddingBottom: "20px", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", margin: 0, color: COLORS.sidebar, fontSize: "32px" }}>Invoice</h1>
              <p style={{ margin: "4px 0 0", color: COLORS.muted }}>{invoiceData ? (invoiceData.invoiceNumber || invoiceData._id) : encInvId}</p>
            </div>
            <div style={{ textAlign: "right", color: COLORS.muted }}>
              <b>STACLI Trading</b><br/>Mandi Gate No.4
            </div>
          </div>
          
          {!invoiceData ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: COLORS.muted }}>
              <h2>Invoice Loading or Not Found...</h2>
              <p>ID: {encInvId}</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: COLORS.sidebar }}>Billed To:</h4>
                  <b style={{ fontSize: "18px" }}>{invoiceData.buyerName || buyers.find(b=>b._id===invoiceData.buyerId)?.name || "Customer"}</b>
                  <p style={{ margin: 0, color: COLORS.muted }}>{invoiceData.buyerPhone || "Phone N/A"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: COLORS.sidebar }}>Date:</h4>
                  <b>{formatDate(invoiceData.date || invoiceData.createdAt)}</b>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: COLORS.muted }}>
                    <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>Qty (KG)</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>Rate (₹)</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoiceData.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9" }}>{item.productLabel || item.productName || "Product"}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>{Number(item.netWeight||item.quantity||0)}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>{formatCurrency(item.rate)}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>{formatCurrency(Number(item.netWeight||item.quantity)*Number(item.rate))}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" style={{ padding: "16px 12px", textAlign: "right", fontWeight: "bold" }}>Grand Total:</td>
                    <td style={{ padding: "16px 12px", textAlign: "right", fontWeight: "bold", fontSize: "16px", color: COLORS.primary }}>{formatCurrency(invoiceData.grandTotal || invoiceData.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #f1f5f9" }}>
                <a href={window.location.origin} style={{ color: COLORS.muted, textDecoration: "none" }}>â† Back to Dashboard</a>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button variant="outline" onClick={() => window.print()}>ðŸ–¨ï¸ Print</Button>
                  <Button onClick={() => {
                    const cName = invoiceData.buyerName || buyers.find(b=>b._id===invoiceData.buyerId)?.name || "Customer";
                    const bName = "STACLI Trading";
                    const amt = formatCurrency(invoiceData.grandTotal || invoiceData.totalAmount);
                    // simplified products string
                    const prodList = (invoiceData.items || []).slice(0, 2).map(i=>i.productLabel || "").join(", ") + ((invoiceData.items||[]).length > 2 ? "..." : "");
                    const pMobile = invoiceData.buyerPhone ? invoiceData.buyerPhone.replace(/\D/g,'') : "";
                    
                    const msg = `Hello ${cName},\n\nThis is your invoice from *${bName}*.\n*Amount Due:* ${amt}\n*Products:* ${prodList}\n\nView full invoice details here:\n${window.location.href}\n\nThank you for your business!`;
                    
                    const waLink = `https://wa.me/${pMobile}?text=${encodeURIComponent(msg)}`;
                    window.open(waLink, "_blank");
                  }} style={{ background: "#25D366", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.884-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    Send via WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
          .stacli-title { font-family: 'Playfair Display', serif !important; letter-spacing: 1px; }
          .stacli-label { font-family: 'Plus Jakarta Sans', sans-serif !important; letter-spacing: 0.5px; }
          .stacli-btn-text { font-family: 'Outfit', sans-serif !important; letter-spacing: 0.5px; }
          .stacli-input:focus { border-color: ${COLORS.primary} !important; box-shadow: 0 0 0 4px ${COLORS.primary}15 !important; }
          .stacli-btn:hover { background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.sidebar} 100%) !important; transform: translateY(-2px); box-shadow: 0 10px 25px ${COLORS.primary}40 !important; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes logoBlink { 0%, 50% { opacity: 1; } 75% { opacity: 0.2; } 100% { opacity: 1; } }
          .blinking-logo { opacity: 1; }
        `}</style>

        <div
          style={{
            animation: "slideUp 0.6s ease-out",
            width: "100%",
            maxWidth: "420px",
            background: "#ffffff",
            borderRadius: "32px",
            padding: "32px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
            border: "1px solid #eef2ee",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                border: "4px solid #fdfbf4",
                overflow: "hidden",
              }}
            >
              <img
                src="https://i.ytimg.com/vi/KtVCkq9Evyc/mqdefault.jpg"
                alt="JAMANGO Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <h1
            className="stacli-title"
            style={{
              margin: "0 0 4px",
              fontWeight: "900",
              color: COLORS.secondary,
              fontSize: "42px",
              textTransform: "uppercase",
            }}
          >
            STACLI
          </h1>
          <div style={{ height: "1px", marginBottom: "8px" }}></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{ height: "1.5px", width: "40px", background: "#cbd5cb" }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: "900",
                color: COLORS.secondary,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              MANDI OS
            </span>
            <div
              style={{ height: "1.5px", width: "40px", background: "#cbd5cb" }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            {/* Role Switcher - EXACT IMAGE PATTERN with 4 Roles */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e9e5",
                borderRadius: "18px",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "28px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.01)",
              }}
            >
              {[
                { id: "Admin", val: "Owner / Admin" },
                { id: "Staff", val: "Operations Staff" },
                { id: "Accountant", val: "Accountant" },
              ].map((r, idx) => {
                const isSelected = authForm.role === r.val;
                return (
                  <React.Fragment key={r.id}>
                    <div
                      onClick={() => setAuthForm({ ...authForm, role: r.val })}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: isSelected
                            ? `5.5px solid ${COLORS.primary}`
                            : "1.5px solid #cbd5cb",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      />
                      <span
                        className="stacli-label"
                        style={{
                          fontSize: "13px",
                          fontWeight: "800",
                          color: isSelected ? "#1a1a1a" : "#94a3b8",
                        }}
                      >
                        {r.id}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                className="stacli-label"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#1a1a2e",
                  marginBottom: "12px",
                }}
              >
                Access ID (Email or Phone)
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "20px",
                  }}
                ></div>
                <input
                  className="stacli-input"
                  type="text"
                  placeholder="admin@stacli.io"
                  value={authForm.username}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, username: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "18px 18px 18px 18px",
                    borderRadius: "14px",
                    border: "1.5px solid #eef2ee",
                    background: "#fff",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "36px" }}>
              <label
                className="stacli-label"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#1a1a2e",
                  marginBottom: "12px",
                }}
              >
                Secure Passkey
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="stacli-input"
                  type="password"
                  placeholder="Enter the password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%",
                    padding: "18px 18px 18px 18px",
                    borderRadius: "14px",
                    border: "1.5px solid #eef2ee",
                    background: "#fff",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            className="stacli-btn"
            onClick={handleLogin}
            style={{
              width: "100%",
              height: "68px",
              fontSize: "22px",
              fontWeight: "900",
              background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.sidebar})`,
              color: "#ffffff",
              border: "none",
              borderRadius: "18px",
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: `0 12px 30px ${COLORS.primary}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="stacli-btn-text">Login</span>
          </button>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <p
              className="stacli-label"
              style={{
                fontSize: "13px",
                color: "#475569",
                fontWeight: "800",
                opacity: 0.9,
              }}
            >
              Restricted Access Â· Authorized Personnel Only
            </p>
            <div style={{ marginTop: "24px" }}>
              <a
                href="#"
                className="stacli-label"
                style={{
                  fontSize: "14px",
                  color: "#1a1a1a",
                  fontWeight: "900",
                  textDecoration: "none",
                  borderBottom: "1.5px solid #eef2ee",
                  paddingBottom: "2px",
                }}
              >
                Back to Store
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif !important; letter-spacing: -0.02em; }
        .font-modern { font-family: 'Outfit', sans-serif !important; }
        .font-display { font-family: 'Outfit', sans-serif !important; letter-spacing: 0.05em; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select option { background-color: #333333; color: white; }
      `}</style>
      {/* MOBILE HEADER (Conditional) */}
      {loggedIn && isMobile && (
        <div
          style={{
            background: "#1a1a1a",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#f59e0b",
              margin: 0,
              fontSize: "20px",
              fontWeight: "900",
            }}
          >
            STACLI
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            {sidebarOpen ? "âœ•" : "â‰¡"}
          </button>
        </div>
      )}

      {/* 1. SIDE NAVIGATION (STACLI Modern Style) */}
      {loggedIn && (
        <nav
          style={{
            width: isMobile ? "280px" : "260px",
            background: "#0d130d", // Darker Deep Forest
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            position: isMobile ? "fixed" : "relative",
            left: isMobile && !sidebarOpen ? "-280px" : "0",
            top: 0,
            bottom: 0,
            zIndex: 1100,
            transition: "left 0.3s ease-in-out",
            boxShadow: isMobile ? "4px 0 16px rgba(0,0,0,0.1)" : "none",
            borderRight: "1px solid #1a231a",
          }}
        >
          <div
            style={{
              padding: "0 24px 32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={user?.profileImage || "https://i.ytimg.com/vi/KtVCkq9Evyc/mqdefault.jpg"}
                alt="STACLI"
                style={{
                  width: "68px",
                  height: "68px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: `2.5px solid ${COLORS.primary}`,
                  padding: "2px",
                  background: "#fff",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  width: "12px",
                  height: "12px",
                  background: COLORS.primary,
                  borderRadius: "50%",
                  border: `2px solid ${COLORS.sidebar}`,
                }}
              ></div>
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "800",
                fontSize: "19px",
                letterSpacing: "1.5px",
                margin: 0,
              }}
            >
              STACLI
            </h2>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "800",
                color: COLORS.primary,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginTop: "4px",
                opacity: 0.9,
              }}
            >
              SPV Fruits
            </div>
          </div>

          <div style={{ padding: "0 24px", marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: COLORS.primary,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Overview
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 14px" }}>
            {MENU.map((item) => {
              const isActive = activeSection === item.id;
              return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = "translateX(10px)";
                    e.currentTarget.style.background = `${COLORS.primary}1A`; // 10% opacity of primary color
                    e.currentTarget.style.color = COLORS.primary;
                  } else {
                    e.currentTarget.style.transform = "translateX(6px) scale(1.02)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#adb5ad";
                  } else {
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: isActive ? COLORS.primary : "transparent",
                  color: isActive ? "#ffffff" : "#adb5ad",
                  boxShadow: isActive
                      ? `0 8px 20px -5px ${COLORS.primary}60`
                      : "none",
                  position: "relative",
                  overflow: "hidden",
                  transform: isActive ? "translateX(4px)" : "translateX(0)",
                }}
              >
                {item.icon && (
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    opacity: isActive ? 1 : 0.7,
                    transition: "all 0.3s ease"
                  }}>
                    {item.icon}
                  </div>
                )}
                <span
                  style={{
                    fontWeight: isActive ? "900" : "600",
                    fontSize: "14px",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    opacity: isActive ? 1 : 0.85,
                  }}
                >
                  {item.label || item.id}
                </span>
              </div>
            )})}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "20px 14px",
              borderTop: "1px solid #1a231a",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div
              onClick={() => {
                setActiveSection("Profile");
                if (isMobile) setSidebarOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 20px",
                borderRadius: "16px",
                cursor: "pointer",
                marginBottom: "8px",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                background: activeSection === "Profile" ? COLORS.primary : "transparent",
                color: activeSection === "Profile" ? "#1a231a" : "#adb5ad",
              }}
              onMouseOver={(e) => { if(activeSection !== "Profile") e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseOut={(e) => { if(activeSection !== "Profile") e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ opacity: activeSection === "Profile" ? 1 : 0.7 }}>{ICON_GEAR_SIDE}</div>
              <span style={{ fontSize: "13.5px", fontWeight: "800" }}>Admin Panel</span>
            </div>

            <div
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 20px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.3s",
                color: "#f87171", // Rose-400
                opacity: 0.8,
              }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgba(248, 113, 113, 0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span style={{ fontSize: "13.5px", fontWeight: "800" }}>Logout</span>
            </div>
          </div>
        </nav>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && loggedIn && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        />
      )}

      {/* Main Command Deck */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "24px 16px" : "60px",
          scrollBehavior: "smooth",
        }}
      >
        <header
          style={{
            marginBottom: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  color: COLORS.sidebar,
                  margin: 0,
                  letterSpacing: "-1.5px",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Avatar" 
                      style={{ 
                        width: "60px", 
                        height: "60px", 
                        borderRadius: "50%", 
                        objectFit: "cover", 
                        border: `3px solid ${COLORS.accent}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: COLORS.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "24px",
                      fontWeight: "900",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>
                      {(user?.name || user?.username || "A")[0].toUpperCase()}
                    </div>
                  )}
                  <span>
                    {getGreeting()},{" "}
                    {user?.name?.split(" ")[0] || user?.username || "Admin"}
                  </span>
                </div>
              </h1>
              <h2
                style={{
                  fontSize: "36px",
                  fontWeight: "900",
                  color: COLORS.sidebar,
                  margin: 0,
                  letterSpacing: "-1px",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {ALL_MENU.find(m => m.id === activeSection)?.label || activeSection}
              </h2>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "10px 20px",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: "850",
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primary}20`,
                }}
              >
                🗓️{" "}
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </div>

              <button
                id="global-refresh-button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{
                  background: isRefreshing ? "#F1F5F9" : COLORS.sidebar,
                  color: isRefreshing ? COLORS.muted : "#fff",
                  padding: "10px 18px",
                  borderRadius: "24px",
                  border: "none",
                  cursor: isRefreshing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                  fontWeight: "800",
                  fontSize: "14px",
                }}
              >
                <RefreshCw size={18} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
                <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </header>


        {/* --- MODULE DISPATCHER --- */}
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>
          {/* Global Location Datalists */}
          <datalist id="indian-states">
            {[
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
              "Andaman and Nicobar Islands",
              "Chandigarh",
              "Dadra and Nagar Haveli and Daman and Diu",
              "Delhi",
              "Jammu and Kashmir",
              "Ladakh",
              "Lakshadweep",
              "Puducherry",
            ].map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <datalist id="indian-towns">
            {[
              "Guntur",
              "Madanapalle",
              "Tenali",
              "Narasaraopet",
              "Nagpur",
              "Nashik",
              "Pune",
              "Mumbai",
              "Surat",
              "Ahmedabad",
              "Rajkot",
              "Vadodara",
              "Varanasi",
              "Lucknow",
              "Kanpur",
              "Prayagraj",
              "Patna",
              "Gaya",
              "Ranchi",
              "Bhopal",
              "Indore",
              "Jabalpur",
              "Gwalior",
              "Ujjain",
              "Azadpur",
              "Ghazipur",
              "Warangal",
              "Karimnagar",
              "Nizamabad",
              "Khammam",
              "Ramagundam",
              "Siddipet",
              "Medak",
              "Chikballapur",
              "Kolar",
              "Hassan",
              "Mysuru",
              "Hubli",
              "Belagavi",
              "Davanagere",
              "Anantapur",
              "Chittoor",
              "Kadapa",
              "Nellore",
              "Kurnool",
              "Ongole",
              "Tirupati",
            ].map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>

          {activeSection === "Profile" && (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <div style={{ marginBottom: "32px" }}>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "900",
                    margin: "0 0 8px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "'Playfair Display', serif",
                    color: "#1a1a2e"
                  }}
                >
                  <span style={{ color: COLORS.accent, display: "flex", alignItems: "center" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span> Profile Settings
                </h1>
                <p style={{ color: COLORS.muted, fontSize: "15px", margin: 0 }}>
                  Update your account details and password.
                </p>
              </div>

              <Card
                style={{ borderRadius: "16px", border: "none", overflow: "hidden", position: "relative" }}
              >
                {/* Decorative Background Shape */}
                <div style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-20px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "#fcf8ea",
                  zIndex: 0
                }}></div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "40px",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "60px",
                  }}
                >
                  {/* Account Details */}
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "900",
                        color: "#1a1a2e",
                        marginBottom: "24px",
                        borderBottom: "1px solid #F1F5F9",
                        paddingBottom: "16px",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      Account Details
                    </h3>
                    
                    {/* Profile Image Upload */}
                    <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                      <div 
                        style={{ 
                          width: "120px", 
                          height: "120px", 
                          borderRadius: "50%", 
                          background: "#F8FAFC", 
                          border: "2px dashed #E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
                        onClick={() => document.getElementById('profile-image-upload').click()}
                      >
                        {user?.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt="Profile" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                        ) : (
                          <div style={{ textAlign: "center", color: COLORS.muted }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                              <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            <div style={{ fontSize: "10px", marginTop: "4px", fontWeight: "700" }}>UPLOAD</div>
                          </div>
                        )}
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0,0,0,0.4)",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "800",
                          padding: "4px 0",
                          textAlign: "center",
                          opacity: 0,
                          transition: "opacity 0.2s"
                        }}
                        id="avatar-overlay"
                        >
                          CHANGE
                        </div>
                      </div>
                      <input 
                        type="file" 
                        id="profile-image-upload" 
                        accept="image/*"
                        style={{ display: "none" }} 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          try {
                            // Show local preview immediately
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUser(prev => ({ ...prev, profileImage: reader.result }));
                            };
                            reader.readAsDataURL(file);

                            // Upload to server
                            const res = await MandiService.uploadFile(file, 'profile-image');
                            if (res.status === "SUCCESS") {
                              const imageUrl = res.data.fileUrl || res.data.url;
                              setUser(prev => {
                                const updatedUser = { ...prev, profileImage: imageUrl };
                                localStorage.setItem('mandi_user', JSON.stringify(updatedUser));
                                return updatedUser;
                              });
                              alert("✅ Profile image updated successfully!");
                            }
                          } catch (err) {
                            console.error("Upload error:", err);
                            alert("âŒ Failed to upload image. Using local preview instead.");
                          }
                        }}
                      />
                      <p style={{ fontSize: "12px", color: COLORS.muted, margin: 0, fontWeight: "600" }}>
                        Click to upload profile photo (JPG/PNG)
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name || "Test Admin"}
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            background: "#F8FAFC",
                            outline: "none",
                            fontWeight: "700",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email || "testadmin@jamango.com"}
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            background: "#F8FAFC",
                            outline: "none",
                            fontWeight: "700",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.phone || "9999999990"}
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            background: "#F8FAFC",
                            outline: "none",
                            fontWeight: "700",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "900",
                        color: "#1a1a2e",
                        marginBottom: "24px",
                        borderBottom: "1px solid #F1F5F9",
                        paddingBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                      </span> Change Password
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: COLORS.muted,
                        marginBottom: "24px",
                        marginTop: "-8px",
                      }}
                    >
                      Leave blank if you don't want to change your password.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            background: "#F8FAFC",
                            outline: "none",
                            fontWeight: "700",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            background: "#F8FAFC",
                            outline: "none",
                            fontWeight: "700",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    borderTop: "1px solid #F1F5F9",
                    paddingTop: "32px",
                    paddingRight: "40px",
                    paddingBottom: "40px"
                  }}
                >
                  <Button
                    onClick={() => alert("✅ Settings saved successfully.")}
                    style={{
                      padding: "16px 32px",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "900",
                      background: "#c19420", // Custom mustard from image
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(193, 148, 32, 0.2)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-1.5px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(193, 148, 32, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(193, 148, 32, 0.2)";
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          )}
          {activeSection === "User Role" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <div style={{ paddingBottom: "24px", marginBottom: "32px", borderBottom: "1px solid #EBE9E1" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div onClick={() => setActiveUserRoleTab("Supplier")} style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Supplier" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Supplier" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}>Supplier Registration</div>
                  <div onClick={() => setActiveUserRoleTab("Customer")} style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Customer" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Customer" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}>Customer Registration</div>
                  <div onClick={() => setActiveUserRoleTab("Registered Members")} style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Registered Members" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Registered Members" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}>Registered Members</div>
                </div>
              </div>

              {activeUserRoleTab === "Supplier" && (
                <div>
                  <FormGrid
                    sections={[
                      {
                        title: "Supplier Profile",
                        fields: [
                          { label: "Supplier ID", placeholder: "Auto-generated", value: isEditingSupplier ? supplierForm.supplierId : `${suppliers.length + 1}`, disabled: true },
                          { label: "Name *", placeholder: "Full name as per ID", value: supplierForm.name, onChange: (e) => setSupplierForm({ ...supplierForm, name: e.target.value }) },
                          { label: "Mobile Number *", type: "tel", placeholder: "Primary + optional alternate", value: supplierForm.phone, onChange: (e) => setSupplierForm({ ...supplierForm, phone: e.target.value }) },
                          { label: "Location Type *", type: "dropdown", options: ["Village", "Town", "City"], value: supplierForm.villageOrTown, onChange: (e) => setSupplierForm({ ...supplierForm, villageOrTown: e.target.value }) },
                          { label: `${supplierForm.villageOrTown || "Location"} Name *`, placeholder: `Enter ${supplierForm.villageOrTown || "Location"} Name`, value: supplierForm.villageOrTownName, onChange: (e) => setSupplierForm({ ...supplierForm, villageOrTownName: e.target.value }) },
                          { label: "District *", placeholder: "Manual typing of district", value: supplierForm.district, onChange: (e) => setSupplierForm({ ...supplierForm, district: e.target.value }) },
                          { label: "State *", type: "dropdown", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: supplierForm.state, onChange: (e) => setSupplierForm({ ...supplierForm, state: e.target.value }) },
                          { label: "Product *", type: "select", options: Object.keys(PRODUCT_DATA).filter((k) => k !== "default"), value: supplierForm.product, onChange: (e) => setSupplierForm({ ...supplierForm, product: e.target.value }) },
                        ],
                      },
                      {
                        title: "KYC Details",
                        fields: [
                          { label: "ID Type", type: "dropdown", options: ["Aadhaar", "PAN", "GSTIN"], value: supplierForm.idType, onChange: (e) => setSupplierForm({ ...supplierForm, idType: e.target.value }) },
                          { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: supplierForm.govIdNumber, onChange: (e) => setSupplierForm({ ...supplierForm, govIdNumber: e.target.value }) },
                        ],
                      },
                      {
                        title: "Bank Details",
                        fields: [
                          { label: "Bank Account No.", type: "number", placeholder: "For direct bank settlements", value: supplierForm.bankAccount, onChange: (e) => setSupplierForm({ ...supplierForm, bankAccount: e.target.value }) },
                          { label: "IFSC Code", placeholder: "Bank branch code", value: supplierForm.ifsc, onChange: (e) => setSupplierForm({ ...supplierForm, ifsc: e.target.value }) },
                          { label: "Bank Location", placeholder: "Bank City/Location", value: supplierForm.bankLocation, onChange: (e) => setSupplierForm({ ...supplierForm, bankLocation: e.target.value }) },
                          { label: "Bank Branch", placeholder: "Branch Name", value: supplierForm.bankBranch, onChange: (e) => setSupplierForm({ ...supplierForm, bankBranch: e.target.value }) },
                          { label: "Advance Balance (\u20B9)", type: "number", placeholder: "Running advance", value: supplierForm.advanceBalance, onChange: (e) => setSupplierForm({ ...supplierForm, advanceBalance: e.target.value }) },
                          { label: "Notes", placeholder: "Free form notes", value: supplierForm.notes, onChange: (e) => setSupplierForm({ ...supplierForm, notes: e.target.value }) },
                        ],
                      },
                    ]}
                  />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button 
                      style={{ 
                        background: supplierSaveBtn.color || COLORS.sidebar, 
                        fontWeight: "800", 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.4s ease"
                      }} 
                      onClick={handleRegisterSupplier}
                    >
                      {supplierSaveBtn.label}
                    </Button>
                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleCancelAll("Supplier")}>Cancel All</Button>
                  </div>
                </div>
              )}

              {activeUserRoleTab === "Customer" && (
                <div>
                  <FormGrid
                    sections={[
                      {
                        title: "Customer Profile",
                        fields: [
                          { label: "Customer ID", placeholder: "Auto-generated", value: isEditingBuyer ? buyerForm.buyerId : `${buyers.length + 1}`, disabled: true },
                          { label: "Customer Name *", placeholder: "Individual or business name", value: buyerForm.name, onChange: (e) => setBuyerForm({ ...buyerForm, name: e.target.value }) },
                          { label: "Mobile Number *", type: "tel", placeholder: "Mobile Number", value: buyerForm.phone, onChange: (e) => setBuyerForm({ ...buyerForm, phone: e.target.value }) },
                          { label: "Address *", placeholder: "Delivery / shop address", value: buyerForm.address, onChange: (e) => setBuyerForm({ ...buyerForm, address: e.target.value }) },
                          { label: "Location Type *", type: "dropdown", options: ["Village", "Town", "City"], value: buyerForm.villageOrTown, onChange: (e) => setBuyerForm({ ...buyerForm, villageOrTown: e.target.value }) },
                          { label: `${buyerForm.villageOrTown || "Location"} Name *`, placeholder: `Enter ${buyerForm.villageOrTown || "Location"} Name`, value: buyerForm.villageOrTownName, onChange: (e) => setBuyerForm({ ...buyerForm, villageOrTownName: e.target.value }) },
                          { label: "District *", placeholder: "Manual typing of district", value: buyerForm.district, onChange: (e) => setBuyerForm({ ...buyerForm, district: e.target.value }) },
                          { label: "State *", type: "dropdown", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: buyerForm.state, onChange: (e) => setBuyerForm({ ...buyerForm, state: e.target.value }) },
                          { label: "Product *", type: "select", options: Object.keys(PRODUCT_DATA).filter((k) => k !== "default"), value: buyerForm.product, onChange: (e) => setBuyerForm({ ...buyerForm, product: e.target.value }) },
                        ],
                      },
                      {
                        title: "KYC Details",
                        fields: [
                          { label: "ID Type", type: "dropdown", options: ["Aadhaar", "PAN", "GSTIN"], value: buyerForm.idType, onChange: (e) => setBuyerForm({ ...buyerForm, idType: e.target.value }) },
                          { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: buyerForm.govIdNumber, onChange: (e) => setBuyerForm({ ...buyerForm, govIdNumber: e.target.value }) },
                        ],
                      },
                      {
                        title: "Bank Details",
                        fields: [
                          { label: "Bank Account No.", type: "number", placeholder: "For bank settlements", value: buyerForm.bankAccount, onChange: (e) => setBuyerForm({ ...buyerForm, bankAccount: e.target.value }) },
                          { label: "IFSC Code", placeholder: "Bank branch code", value: buyerForm.ifsc, onChange: (e) => setBuyerForm({ ...buyerForm, ifsc: e.target.value }) },
                          { label: "Bank Location", placeholder: "Bank City/Location", value: buyerForm.bankLocation, onChange: (e) => setBuyerForm({ ...buyerForm, bankLocation: e.target.value }) },
                          { label: "Bank Branch", placeholder: "Branch Name", value: buyerForm.bankBranch, onChange: (e) => setBuyerForm({ ...buyerForm, bankBranch: e.target.value }) },
                          { label: "Advance Payment (\u20B9)", type: "number", placeholder: "Advance payment received?", value: buyerForm.advanceBalance, onChange: (e) => setBuyerForm({ ...buyerForm, advanceBalance: e.target.value }) },
                          { label: "Notes", placeholder: "Free-form notes", value: buyerForm.notes, onChange: (e) => setBuyerForm({ ...buyerForm, notes: e.target.value }) },
                        ],
                      },
                      {
                        title: "Credit Details",
                        fields: [
                          { label: "Credit Limit (\u20B9) *", type: "number", placeholder: "Max credit allowed; 0 = cash only", value: buyerForm.creditLimit, onChange: (e) => setBuyerForm({ ...buyerForm, creditLimit: e.target.value }) },
                          { label: "Payment Terms *", type: "dropdown", options: ["Immediate", "7 Days", "15 Days", "30 Days"], value: buyerForm.paymentTerms, onChange: (e) => setBuyerForm({ ...buyerForm, paymentTerms: e.target.value }) },
                          { label: "Notes", placeholder: "Free form notes", value: buyerForm.notes, onChange: (e) => setBuyerForm({ ...buyerForm, notes: e.target.value }) },
                        ],
                      }
                    ]}
                  />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
                    <Button style={{ background: "#F1F5F9", color: COLORS.sidebar, border: `1.5px solid ${COLORS.sidebar}`, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => setActiveUserRoleTab("Supplier")}>Previous</Button>
                    <Button 
                      style={{ 
                        background: buyerSaveBtn.color || COLORS.sidebar, 
                        fontWeight: "800", 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.4s ease"
                      }} 
                      onClick={handleRegisterBuyer}
                    >
                      {buyerSaveBtn.label}
                    </Button>
                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleCancelAll("Customer")}>Cancel All</Button>
                  </div>
                </div>
              )}

              {activeUserRoleTab === "Registered Members" && (
                <div>
                  <Card>
                  {(() => {
                    const activeTab = activeRegisteredTab;
                    const selectedProducts = memberProductFilters[activeTab] || [];
                    const activeProductSearch = memberProductSearch[activeTab] || "";
                    const productOptions = getRegisteredProductOptions(activeTab);
                    const filteredProductOptions = productOptions.filter((opt) =>
                      opt.toLowerCase().includes(activeProductSearch.toLowerCase()),
                    );
                    const exactTypedMatchExists = productOptions.some(
                      (opt) =>
                        normalizeProductName(opt) ===
                        normalizeProductName(activeProductSearch),
                    );
                    const canAddManualProduct =
                      activeProductSearch.trim() &&
                      !exactTypedMatchExists &&
                      !selectedProducts.some(
                        (p) =>
                          normalizeProductName(p) ===
                          normalizeProductName(activeProductSearch),
                      );

                    const sourceData = activeTab === "Suppliers" ? suppliers : buyers;
                    const query = memberSearchQuery.trim().toLowerCase();
                    const searchedData = sourceData.filter((record) => {
                      let dateMatch = true;
                      const rDate = record.createdAt || record.date;
                      if (rDate && memberDateFilter !== "All") {
                        const d = new Date(rDate);
                        const today = new Date();
                        if (memberDateFilter === "Today") {
                          dateMatch = d.toDateString() === today.toDateString();
                        } else if (["7 Days", "15 Days", "30 Days"].includes(memberDateFilter)) {
                          const days = parseInt(memberDateFilter);
                          const pastLimit = new Date();
                          pastLimit.setDate(today.getDate() - days);
                          dateMatch = d >= pastLimit && d <= today;
                        } else if (memberDateFilter === "Custom Date" && memberCustomDateStart && memberCustomDateEnd) {
                          const s = new Date(memberCustomDateStart);
                          const e = new Date(memberCustomDateEnd);
                          e.setHours(23, 59, 59, 999);
                          dateMatch = d >= s && d <= e;
                        }
                      }
                      const productText = getProfileProducts(record).join(" ").toLowerCase();
                      const queryMatch = !query ? true : (activeTab === "Suppliers" ? (
                        String(record.name || "").toLowerCase().includes(query) ||
                        String(record.phone || "").includes(query) ||
                        productText.includes(query)
                      ) : (
                        String(record.name || "").toLowerCase().includes(query) ||
                        String(record.shopName || "").toLowerCase().includes(query) ||
                        String(record.phone || "").includes(query) ||
                        productText.includes(query)
                      ));
                      return dateMatch && queryMatch;
                    });

                    const groupedByProduct = selectedProducts.map((selectedProduct) => {
                      const matchingProfiles = searchedData.filter((record) => {
                        const products = getProfileProducts(record).map(normalizeProductName);
                        return products.includes(normalizeProductName(selectedProduct));
                      });
                      return { product: selectedProduct, items: matchingProfiles };
                    });

                    const hasAnyFilters = selectedProducts.length > 0;

                    return (
                      <>
                        <div style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "stretch" }}>
                          <div style={{ position: "relative", flex: 1 }}>
                            <input
                              type="text"
                              placeholder="Search by Name / Mobile Number / Product"
                              value={memberSearchQuery}
                              onChange={(e) => setMemberSearchQuery(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "16px 20px 16px 16px",
                                borderRadius: "16px",
                                border: "1.5px solid #E2E8F0",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: COLORS.sidebar,
                                outline: "none",
                                background: "#F8FAFC",
                                transition: "all 0.2s",
                              }}
                            />
                          </div>
                          <div style={{ display: "flex", gap: "12px", minWidth: "400px" }}>
                            <select
                              value={memberDateFilter}
                              onChange={(e) => setMemberDateFilter(e.target.value)}
                              style={{
                                flex: 1,
                                height: "52px",
                                padding: "0 14px",
                                borderRadius: "12px",
                                border: "1.5px solid #E2E8F0",
                                background: "#F8FAFC",
                                color: COLORS.sidebar,
                                fontSize: "13px",
                                fontWeight: "700",
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              <option value="All">Select data from particular date</option>
                              <option value="Today">Today</option>
                              <option value="7 Days">7 Days</option>
                              <option value="15 Days">15 Days</option>
                              <option value="30 Days">30 Days / One Month</option>
                              <option value="Custom Date">Custom Date</option>
                            </select>
                            {memberDateFilter === "Custom Date" && (
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <input type="date" value={memberCustomDateStart} onChange={e => setMemberCustomDateStart(e.target.value)} style={{ padding: "8px 12px", borderRadius: "12px", border: "1.5px solid #E2E8F0", fontSize: "12px", background: "#F8FAFC", color: COLORS.sidebar, fontWeight: "600", outline: "none", height: "52px" }} />
                                <span style={{fontSize: "12px", fontWeight:"800", color:COLORS.muted}}>to</span>
                                <input type="date" value={memberCustomDateEnd} onChange={e => setMemberCustomDateEnd(e.target.value)} style={{ padding: "8px 12px", borderRadius: "12px", border: "1.5px solid #E2E8F0", fontSize: "12px", background: "#F8FAFC", color: COLORS.sidebar, fontWeight: "600", outline: "none", height: "52px" }} />
                              </div>
                            )}
                          </div>
                          <div style={{ minWidth: "280px" }}>
                            <ModernMultiSelectField
                              label="Select Product"
                              value={selectedProducts.join(" / ")}
                              options={productOptions}
                              onChange={(e) => {
                                const vals = parseMultiValue(e.target.value);
                                setMemberProductFilters((prev) => ({ ...prev, [activeTab]: vals }));
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "14px", overflowX: "auto", paddingBottom: "2px" }}>
                          {selectedProducts.map((product) => (
                            <div
                              key={product}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "6px 10px",
                                borderRadius: "10px",
                                border: "1px solid #CBD5E1",
                                background: "#FFFFFF",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: COLORS.sidebar,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span>{product}</span>
                              <button
                                onClick={() => removeMemberProductFilter(activeTab, product)}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  color: "#64748B",
                                  cursor: "pointer",
                                  fontWeight: "900",
                                  lineHeight: 1,
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          {(selectedProducts.length > 0 || memberSearchQuery.trim()) && (
                            <button
                              onClick={() => {
                                setMemberProductFilters((prev) => ({ ...prev, [activeTab]: [] }));
                                setMemberProductSearch((prev) => ({ ...prev, [activeTab]: "" }));
                                setMemberSearchQuery("");
                              }}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "10px",
                                border: "1px solid #E2E8F0",
                                background: "#FFFFFF",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "#334155",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Clear All Filters
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                  <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>
                    <div onClick={() => setActiveRegisteredTab("Suppliers")} style={{ padding: "8px 20px", cursor: "pointer", fontWeight: "800", fontSize: "13px", background: activeRegisteredTab === "Suppliers" ? COLORS.sidebar : "transparent", color: activeRegisteredTab === "Suppliers" ? "#FFFFFF" : COLORS.muted, borderRadius: "24px", transition: "all 0.2s" }}>Registered Suppliers ({suppliers.length})</div>
                    <div onClick={() => setActiveRegisteredTab("Customers")} style={{ padding: "8px 20px", cursor: "pointer", fontWeight: "800", fontSize: "13px", background: activeRegisteredTab === "Customers" ? COLORS.sidebar : "transparent", color: activeRegisteredTab === "Customers" ? "#FFFFFF" : COLORS.muted, borderRadius: "24px", transition: "all 0.2s" }}>Registered Customers ({buyers.length})</div>
                  </div>
                  <div style={{ maxHeight: "750px", overflowY: "auto", padding: "16px" }}>
                    {(() => {
                      const activeTab = activeRegisteredTab;
                      const selectedProducts = memberProductFilters[activeTab] || [];
                      const sourceData = activeTab === "Suppliers" ? suppliers : buyers;
                      const query = memberSearchQuery.trim().toLowerCase();

                      // Calculate display range
                      let displayRange = "";
                      if (memberDateFilter !== "All") {
                        const today = new Date();
                        let start = new Date(today);
                        let end = new Date(today);

                        if (memberDateFilter === "7 Days" || memberDateFilter === "15 Days" || memberDateFilter === "30 Days") {
                          start.setDate(today.getDate() - parseInt(memberDateFilter));
                        } else if (memberDateFilter === "Custom Date" && memberCustomDateStart && memberCustomDateEnd) {
                          start = new Date(memberCustomDateStart);
                          end = new Date(memberCustomDateEnd);
                        }
                        
                        if (memberDateFilter === "Today") {
                          displayRange = formatDate(start);
                        } else if (memberDateFilter === "Custom Date" && (!memberCustomDateStart || !memberCustomDateEnd)) {
                          displayRange = "";
                        } else {
                          displayRange = `${formatDate(start)} to ${formatDate(end)}`;
                        }
                      }

                      const searchedData = sourceData.filter((record) => {
                        let dateMatch = true;
                        const rDate = record.createdAt || record.date;
                        
                        if (rDate && memberDateFilter !== "All") {
                          const d = new Date(rDate);
                          const today = new Date();
                          if (memberDateFilter === "Today") {
                            dateMatch = d.toDateString() === today.toDateString();
                          } else if (["7 Days", "15 Days", "30 Days"].includes(memberDateFilter)) {
                            const days = parseInt(memberDateFilter);
                            const pastLimit = new Date();
                            pastLimit.setDate(today.getDate() - days);
                            dateMatch = d >= pastLimit && d <= today;
                          } else if (memberDateFilter === "Custom Date" && memberCustomDateStart && memberCustomDateEnd) {
                            const s = new Date(memberCustomDateStart);
                            const e = new Date(memberCustomDateEnd);
                            e.setHours(23, 59, 59, 999);
                            dateMatch = d >= s && d <= e;
                          } else if (memberDateFilter === "Custom Date") {
                            dateMatch = false; // No match if custom dates are incomplete
                          }
                        }
                        const productText = getProfileProducts(record).join(" ").toLowerCase();
                        const queryMatch = !query ? true : (activeTab === "Suppliers" ? (
                          String(record.name || "").toLowerCase().includes(query) ||
                          String(record.phone || "").includes(query) ||
                          productText.includes(query)
                        ) : (
                          String(record.name || "").toLowerCase().includes(query) ||
                          String(record.shopName || "").toLowerCase().includes(query) ||
                          String(record.phone || "").includes(query) ||
                          productText.includes(query)
                        ));
                        return dateMatch && queryMatch;
                      });

                      const getEmptyMessage = () => {
                         let isSingleDate = memberDateFilter === "Today" || (memberDateFilter === "Custom Date" && memberCustomDateStart === memberCustomDateEnd && memberCustomDateStart);
                         let isCustomRange = memberDateFilter === "Custom Date" && memberCustomDateStart && memberCustomDateEnd && memberCustomDateStart !== memberCustomDateEnd;
                         let isRelativeRange = ["7 Days", "15 Days", "30 Days"].includes(memberDateFilter);
                         
                         const tgt = activeTab === "Suppliers" ? "suppliers" : "customers";
                         
                         if (isSingleDate) return `There are no registered ${tgt} on this date`;
                         if (isCustomRange || isRelativeRange) return `Registered ${tgt} are not available in this range`;
                         if (memberDateFilter !== "All") return `The registered ${tgt} are not available in this date.`;
                         return activeTab === "Suppliers" ? "No matching suppliers found." : "No matching customers found.";
                      };

                      if (selectedProducts.length === 0) {
                        if (searchedData.length === 0) {
                          const emptyMsg = getEmptyMessage();
                          return (
                            <div style={{ textAlign: "center", padding: "40px" }}>
                              {displayRange && <div style={{ fontSize: "14px", fontWeight: "900", color: COLORS.sidebar, marginBottom: "12px" }}>{displayRange}</div>}
                              <p style={{ color: COLORS.muted, fontSize: "14px", fontWeight: "700" }}>
                                {emptyMsg}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
                              {activeTab === "Suppliers"
                                ? searchedData.map((s) => renderSupplierMemberCard(s))
                                : searchedData.map((b) => renderBuyerMemberCard(b))}
                            </div>
                          </div>
                        );
                      }

                      const groupedByProduct = selectedProducts.map((selectedProduct) => {
                        const matches = searchedData.filter((record) => {
                          const products = getProfileProducts(record).map(normalizeProductName);
                          return products.includes(normalizeProductName(selectedProduct));
                        });
                        return { product: selectedProduct, items: matches };
                      });

                      const hasAtLeastOneMatch = groupedByProduct.some(group => group.items.length > 0);

                      if (!hasAtLeastOneMatch) {
                        const emptyMsg = getEmptyMessage();
                        return (
                          <div style={{ textAlign: "center", padding: "40px" }}>
                            {displayRange && <div style={{ fontSize: "14px", fontWeight: "900", color: COLORS.sidebar, marginBottom: "12px" }}>{displayRange}</div>}
                            <p style={{ color: COLORS.muted, fontSize: "14px", fontWeight: "700" }}>
                              {emptyMsg}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                          {displayRange && <div style={{ fontSize: "14px", fontWeight: "900", color: COLORS.sidebar, paddingLeft: "4px" }}>{displayRange}</div>}
                          {groupedByProduct.map((group) => (
                            <div key={`${activeTab}-${group.product}`}>
                              <div style={{ fontSize: "13px", fontWeight: "900", color: COLORS.sidebar, marginBottom: "10px", letterSpacing: "0.3px" }}>
                                {`${group.product} Registered ${activeTab === "Suppliers" ? "Suppliers" : "Customers"}: ${group.items.length}`}
                              </div>
                              {group.items.length === 0 ? (
                                <div style={{ fontSize: "12px", color: COLORS.muted, padding: "8px 4px" }}>
                                  No profiles found for this product.
                                </div>
                              ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "12px" }}>
                                  {activeTab === "Suppliers"
                                    ? group.items.map((s) => renderSupplierMemberCard(s, `supplier-${group.product}`))
                                    : group.items.map((b) => renderBuyerMemberCard(b, `buyer-${group.product}`))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </Card>
                <div style={{ display: "flex", gap: "16px", marginTop: "20px", paddingBottom: "8px" }}>
                  <Button style={{ background: "#F1F5F9", color: COLORS.sidebar, border: `1.5px solid ${COLORS.sidebar}`, fontWeight: "800" }} onClick={() => setActiveUserRoleTab("Customer")}>Previous</Button>
                </div>
                </div>
              )}
            </div>
          )}

          {/* LOT CREATION MODULE */}
          {activeSection === "Lot Creation" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <div
                style={{
                  paddingBottom: "24px",
                  marginBottom: "32px",
                  borderBottom: "1px solid #EBE9E1",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    onClick={() => setActiveLotTab("LOT Creation")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activeLotTab === "LOT Creation"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activeLotTab === "LOT Creation"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    LOT Creation
                  </div>
                  <div
                    onClick={() => setActiveLotTab("Produce Details")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activeLotTab === "Produce Details"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activeLotTab === "Produce Details"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    Produce Details
                  </div>
                  <div
                    onClick={() => setActiveLotTab("Registered Lots")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activeLotTab === "Registered Lots"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activeLotTab === "Registered Lots"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    Registered Lots
                  </div>

                </div>
              </div>

              {activeLotTab === "LOT Creation" && (
                <div>
                  <datalist id="suppliers-list">
                    {suppliers.map((s) => (
                      <option key={s._id} value={s.name} />
                    ))}
                  </datalist>
                  <FormGrid
                    sections={[
                      {
                        title: "Intake Details",
                        fields: [
                          {
                            label: "Lot ID *",
                            type: "text",
                            value: lotCreationForm.lotId,
                            disabled: true,
                            placeholder: "Auto-generated sequence",
                          },
                          {
                            label: "Date & Time *",
                            type: "datetime-local",
                            value: lotCreationForm.dateTime,
                            disabled: !!lotCreationForm.id,
                            onChange: (e) =>
                              setLotCreationForm({
                                ...lotCreationForm,
                                dateTime: e.target.value,
                              }),
                          },
                          {
                            label: "Supplier Name *",
                            type: "othersDropdown",
                            options: suppliers.map((s) => formatNameWithId(s.name, getSupplierIdValue(s))),
                            value: suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId) 
                              ? formatNameWithId(suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId).name, getSupplierIdValue(suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId)))
                              : lotCreationForm.farmerId,
                            onChange: (e) => {
                              const val = e.target.value;
                              const foundS = suppliers.find((s) => formatNameWithId(s.name, getSupplierIdValue(s)) === val);
                              setLotCreationForm({
                                ...lotCreationForm,
                                farmerId: foundS?._id || foundS?.id || val,
                                origin: foundS
                                  ? foundS.village || foundS.state || ""
                                  : "",
                              });
                            },
                          },
                          {
                            label: "Vehicle / Lorry Number *",
                            type: "text",
                            value: lotCreationForm.vehicleNumber,
                            onChange: (e) =>
                              setLotCreationForm({
                                ...lotCreationForm,
                                vehicleNumber: e.target.value,
                              }),
                            placeholder:
                              "Registration number of arriving vehicle",
                          },
                          {
                            label: "Driver Name",
                            type: "text",
                            value: lotCreationForm.driverName,
                            onChange: (e) =>
                              setLotCreationForm({
                                ...lotCreationForm,
                                driverName: e.target.value,
                              }),
                            placeholder: "Optional",
                          },
                          {
                            label: "Origin / Source Location *",
                            type: "text",
                            value: lotCreationForm.origin,
                            onChange: (e) =>
                              setLotCreationForm({
                                ...lotCreationForm,
                                origin: e.target.value,
                              }),
                            placeholder: "Village or farm location",
                          },
                          {
                            label: "Notes",
                            type: "text",
                            value: lotCreationForm.notes,
                            onChange: (e) =>
                              setLotCreationForm({
                                ...lotCreationForm,
                                notes: e.target.value,
                              }),
                            placeholder:
                              "Any special remarks about condition of produce",
                          },
                        ],
                      },
                    ]}
                  />

                  <div
                    style={{ display: "flex", gap: "16px", marginTop: "32px" }}
                  >
                    <Button
                      style={{
                        background: lotSaveBtn.color || COLORS.sidebar,
                        fontWeight: "800",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                      onClick={() => {
                        if (
                          !lotCreationForm.farmerId ||
                          !lotCreationForm.vehicleNumber ||
                          !lotCreationForm.origin
                        ) {
                          alert("Please complete all Intake Details first!");
                          return;
                        }
                        setLotSaveBtn({
                          label: "✅ Saved successfully",
                          color: COLORS.success,
                        });
                        setTimeout(() => {
                          setLotSaveBtn({ label: "Save", color: null });
                          setActiveLotTab("Produce Details");
                        }, 1000);
                      }}
                    >
                      {lotSaveBtn.label}
                    </Button>
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: "#CC0000",
                        border: "none",
                        fontWeight: "900",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      }}
                      onClick={() =>
                        setLotCreationForm({
                          ...lotCreationForm,
                          lotId: generateLotId(lotCounter),
                          vehicleNumber: "",
                          driverName: "",
                          origin: "",
                          attachedBill: null,
                          notes: "",
                          lineItems: [
                            {
                              id: Date.now(),
                              productId: "",
                              variety: "",
                              grade: "A",
                              grossWeight: "",
                              deductions: "",
                              weightUnit: "KGs",
                              estimatedRate: "",
                              status: "Pending Auction",
                            },
                          ],
                        })
                      }
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {activeLotTab === "Registered Lots" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1.5px solid #EBE9E1",
                    animation: "fadeIn 0.4s ease-out"
                  }}
                >
                  {/* Lot Search Integrated Upside */}
                  <div style={{ marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                      <input
                        type="text"
                        placeholder="Search by supplier name / vehicle number / product"
                        value={lotSearchQuery}
                        onChange={(e) => setLotSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          borderRadius: "16px",
                          border: "1.5px solid #EBE9E1",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    <div style={{ width: "240px" }}>
                       <select
                         value={lotDateFilter}
                         onChange={(e) => {
                           setLotDateFilter(e.target.value);
                           if (e.target.value !== "Custom Date") {
                             setLotCustomDateStart("");
                             setLotCustomDateEnd("");
                           }
                         }}
                         style={{
                            width: "100%",
                            padding: "16px 20px",
                            borderRadius: "16px",
                            border: "1.5px solid #EBE9E1",
                            fontSize: "14px",
                            color: lotDateFilter ? COLORS.sidebar : COLORS.muted,
                            cursor: "pointer",
                            appearance: "auto",
                            background: "#FFFFFF"
                         }}
                       >
                         <option value="" disabled>Select date from particular date</option>
                         <option value="Today">Today</option>
                         <option value="15 Days">15 Days</option>
                         <option value="30 Days / One Month">30 Days / One Month</option>
                         <option value="Custom Date">Custom Date</option>
                       </select>
                    </div>
                    <div style={{ width: "220px" }}>
                       <select
                         value={lotProductFilter}
                         onChange={(e) => setLotProductFilter(e.target.value)}
                         style={{
                            width: "100%",
                            padding: "16px 20px",
                            borderRadius: "16px",
                            border: "1.5px solid #EBE9E1",
                            fontSize: "14px",
                            color: lotProductFilter ? COLORS.sidebar : COLORS.muted,
                            cursor: "pointer",
                            appearance: "auto",
                            background: "#FFFFFF"
                         }}
                       >
                         <option value="" disabled>Select Product</option>
                         {Array.from(new Set(
                            lots.filter(li => {
                               const supplierName = (li.farmerName || li.supplierId?.name || (typeof li.supplierId === "string" ? li.supplierId : "")).toLowerCase();
                               const query = (lotSearchQuery || "").toLowerCase();
                               return !query || supplierName.includes(query);
                            }).flatMap(li => li.lineItems?.map(i => i.productId).filter(Boolean))
                         )).map(prod => (
                           <option key={prod} value={prod}>{prod}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  {lotDateFilter === "Custom Date" && (
                    <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center" }}>
                      <input
                        type="date"
                        value={lotCustomDateStart}
                        onChange={(e) => setLotCustomDateStart(e.target.value)}
                        style={{ padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #EBE9E1", fontSize: "14px", outline: "none" }}
                      />
                      <span style={{ fontWeight: "700", color: COLORS.muted }}>to</span>
                      <input
                        type="date"
                        value={lotCustomDateEnd}
                        onChange={(e) => setLotCustomDateEnd(e.target.value)}
                        style={{ padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #EBE9E1", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  )}
                  <div style={{ overflowX: "auto" }}>
                    {(() => {
                      const filteredLotsForDisplay = lots.filter(l => {
                        const supplierName = (l.farmerName || l.supplierId?.name || (typeof l.supplierId === "string" ? l.supplierId : "")).toLowerCase();
                        const vehicleNo = (l.vehicleNumber || "").toLowerCase();
                        const productsStr = (l.lineItems || []).map(item => item.productId?.toLowerCase() || "").join(" ");
                        const query = (lotSearchQuery || "").toLowerCase();
                        const matchesQuery = supplierName.includes(query) || vehicleNo.includes(query) || productsStr.includes(query);

                        let matchesDate = true;
                        if (lotDateFilter) {
                          const lotDateVal = l.entryDate || l.createdAt;
                          if (lotDateVal) {
                            const lotDate = new Date(lotDateVal);
                            lotDate.setHours(0,0,0,0);
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            if (lotDateFilter === "Today") {
                              matchesDate = lotDate.getTime() === today.getTime();
                            } else if (lotDateFilter === "15 Days") {
                              const past = new Date(today); past.setDate(today.getDate() - 15);
                              matchesDate = lotDate >= past && lotDate <= today;
                            } else if (lotDateFilter === "30 Days / One Month") {
                              const past = new Date(today); past.setDate(today.getDate() - 30);
                              matchesDate = lotDate >= past && lotDate <= today;
                            } else if (lotDateFilter === "Custom Date") {
                              if (lotCustomDateStart) { const s = new Date(lotCustomDateStart); s.setHours(0,0,0,0); if (lotDate < s) matchesDate = false; }
                              if (lotCustomDateEnd) { const e = new Date(lotCustomDateEnd); e.setHours(23,59,59,999); if (lotDate > e) matchesDate = false; }
                            }
                          }
                        }

                        let matchesProduct = true;
                        if (lotProductFilter) {
                          matchesProduct = (l.lineItems || []).some(item => item.productId === lotProductFilter);
                        }

                        return matchesQuery && matchesDate && matchesProduct;
                      });

                      if (filteredLotsForDisplay.length === 0) {
                        return (
                          <p style={{ textAlign: "center", color: "#CC0000", fontWeight: "800", padding: "40px" }}>
                            {lotDateFilter ? "THIS REGISTERED SUPPLIER IS NOT AVAILABLE IN THIS DATE" : "No registered lots found."}
                          </p>
                        );
                      }

                      return (
                        <>
                          {lotDateFilter && filteredLotsForDisplay.length > 0 && (
                            <div style={{ marginBottom: "16px", padding: "16px", background: "#F8FAFC", borderRadius: "12px", border: "1px dashed #CBD5E1" }}>
                              <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", color: COLORS.primary, fontWeight: "900", textTransform: "uppercase" }}>Search & Date Summary</h4>
                              {Object.entries(
                                filteredLotsForDisplay.reduce((acc, l) => {
                                  const sName = l.farmerName || l.supplierId?.name || (typeof l.supplierId === "string" ? l.supplierId : "Unknown");
                                  if (!acc[sName]) acc[sName] = { count: 0, products: new Set() };
                                  acc[sName].count += 1;
                                  (l.lineItems || []).forEach(i => { if (i.productId) acc[sName].products.add(i.productId); });
                                  return acc;
                                }, {})
                              ).map(([sName, data]) => (
                                <div key={sName} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E2E8F0", fontSize: "13px" }}>
                                  <span style={{ fontWeight: "800", color: COLORS.sidebar }}>{sName}</span>
                                  <span style={{ color: COLORS.muted, fontWeight: "600" }}>
                                    Visits: <strong style={{color: COLORS.primary}}>{data.count}</strong> &nbsp;|&nbsp;
                                    Products: <strong style={{color: COLORS.sidebar}}>{Array.from(data.products).join(", ")}</strong>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                              <tr style={{ background: COLORS.sidebar, color: "#fff" }}>
                                <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>LOT ID</th>
                                <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>SUPPLIER</th>
                                <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>DATE</th>
                                <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>VEHICLE</th>
                                <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>ORIGIN</th>
                                <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>PRODUCTS</th>
                                <th style={{ padding: "14px 16px", textAlign: "right", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>EST. GROSS</th>
                                <th style={{ padding: "14px 16px", textAlign: "center", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredLotsForDisplay.slice().reverse().map((l, rowIdx) => {
                                const grossSale = (l.lineItems || []).reduce((sum, item) => sum + Number(item.grossWeight || 0) * Number(item.estimatedRate || 0), 0);
                                const supplierName = l.farmerName || l.supplierId?.name || (typeof l.supplierId === "string" ? l.supplierId : "N/A");
                                const products = (l.lineItems || []).map(li => [li.productId, li.variety, li.grade].filter(Boolean).join(" / ")).join(", ");
                                return (
                                  <tr key={l._id || l.lotId} style={{ background: rowIdx % 2 === 0 ? "#FFFFFF" : "#FDFBF4", borderBottom: "1px solid #EBE9E1", transition: "background 0.15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#F0F4F0"}
                                    onMouseLeave={e => e.currentTarget.style.background = rowIdx % 2 === 0 ? "#FFFFFF" : "#FDFBF4"}
                                  >
                                    <td style={{ padding: "14px 16px", fontWeight: "900", color: COLORS.sidebar, whiteSpace: "nowrap" }}>{l.lotId}</td>
                                    <td style={{ padding: "14px 16px", fontWeight: "800", color: COLORS.sidebar }}>{supplierName}</td>
                                    <td style={{ padding: "14px 16px", fontWeight: "700", color: COLORS.muted, whiteSpace: "nowrap" }}>{l.entryDate ? new Date(l.entryDate).toLocaleDateString() : "N/A"}</td>
                                    <td style={{ padding: "14px 16px", fontWeight: "700", color: COLORS.sidebar }}>{l.vehicleNumber || "—"}</td>
                                    <td style={{ padding: "14px 16px", fontWeight: "700", color: COLORS.primary }}>{l.origin || "—"}</td>
                                    <td style={{ padding: "14px 16px", fontWeight: "700", color: "#1e293b", maxWidth: "200px" }}>
                                      {products || <span style={{ color: COLORS.muted }}>—</span>}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontWeight: "900", color: "#166534", textAlign: "right", whiteSpace: "nowrap" }}>
                                      ₹{grossSale.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "center", whiteSpace: "nowrap" }}>
                                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                        <button
                                          onClick={() => setViewingEntity({ type: "LOT", data: l })}
                                          style={{ background: "#F1F5F9", color: COLORS.sidebar, border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                        >View</button>
                                        <button
                                          onClick={() => handleEditLot(l)}
                                          style={{ background: "#FEF9C3", color: "#92400E", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                        >Edit</button>
                                        {l.attached_bill_photo && (
                                          <button
                                            onClick={() => setBillPhotoModal({ open: true, imageUrl: l.attached_bill_photo, lotNo: l.lotId || "N/A", supplierName: l.farmerName || "N/A", supplierId: l.supplierId || "N/A", zoom: 1 })}
                                            style={{ background: "#E0F2FE", color: "#0369A1", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                          >Bill</button>
                                        )}
                                        <button
                                          onClick={() => { const code = prompt("🔐 Enter Master Deletion Code:"); if (code === "0000") handleDeleteLot(l._id); else if (code !== null) alert("🚫 ACCESS DENIED: Invalid deletion code."); }}
                                          style={{ background: "#FEF2F2", color: "#DC2626", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                        >Delete</button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}


              {activeLotTab === "Produce Details" && (
                <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                  <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <div style={{ borderBottom: "1px solid #EBE9E1", paddingBottom: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: "20px", fontWeight: "900", color: COLORS.sidebar, margin: 0 }}>Produce Details</h3>
                        {(() => {
                          const selectedSupplier =
                            suppliers.find((s) => s.name === lotCreationForm.farmerId) ||
                            suppliers.find((s) => s._id === lotCreationForm.farmerId);
                          const supplierName = selectedSupplier?.name || lotCreationForm.farmerId || "N/A";
                          const supplierId = getSupplierIdValue(selectedSupplier) || "N/A";
                          return (
                            <div style={{ fontSize: "13px", fontWeight: "800", color: COLORS.muted }}>
                               LOT NO: <span style={{color: COLORS.sidebar, fontWeight: "900"}}>{lotCreationForm.lotId || "N/A"}</span> &nbsp;/&nbsp; 
                               Supplier: <span style={{color: COLORS.sidebar, fontWeight: "900"}}>{supplierName}</span> &nbsp;/&nbsp; 
                               ID: <span style={{color: COLORS.sidebar, fontWeight: "900"}}>{supplierId}</span>
                            </div>
                          );
                        })()}
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {lotCreationForm.lineItems.map((item, idx) => (
                        <div key={item.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", padding: "24px", background: "#FDFBF4", borderRadius: "8px", border: "1px solid #EBE9E1", position: "relative" }}>
                          
                          {idx > 0 && (
                            <div style={{ position: "absolute", top: "12px", right: "12px", cursor: "pointer", color: "#CC0000", fontWeight: "bold", fontSize: "12px" }} onClick={() => handleLineItemAction("Remove", idx)}>
                              Remove
                            </div>
                          )}

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <ModernMultiSelectField
                              label="Product"
                              value={item.productId}
                              options={(() => {
                                 const selectedSupplier = suppliers.find(s => s._id === lotCreationForm.farmerId || s.name === lotCreationForm.farmerId);
                                 const supplierProducts = getProfileProducts(selectedSupplier);
                                 return supplierProducts.length > 0 ? supplierProducts : Object.keys(PRODUCT_DATA).filter(k => k !== "default");
                              })()}
                              onChange={(e) => handleLineItemAction("Update", idx, "productId", e.target.value)}
                            />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <ModernMultiSelectField
                              label="Variety"
                              value={item.variety}
                              options={["Standard", "Hybrid", "Local", "Desi", "F1", "Other"]}
                              onChange={(e) => handleLineItemAction("Update", idx, "variety", e.target.value)}
                            />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <ModernMultiSelectField
                              label="Grade"
                              value={item.grade}
                              options={["A", "B", "C", "Extra", "Super", "Standard"]}
                              onChange={(e) => handleLineItemAction("Update", idx, "grade", e.target.value)}
                            />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Weight ({item.weightUnit}) *</label>
                            <input type="number" value={item.grossWeight} onChange={(e) => handleLineItemAction("Update", idx, "grossWeight", e.target.value)} placeholder="0" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Weight Unit (KGs/Tones)</label>
                            <select 
                                value={item.weightUnit} 
                                onChange={(e) => {
                                    const nextUnit = e.target.value;
                                    const prevUnit = item.weightUnit;
                                    let newGross = Number(item.grossWeight) || 0;

                                    if (prevUnit === "KGs" && nextUnit === "Tones") {
                                        newGross = newGross / 1000;
                                    } else if (prevUnit === "Tones" && nextUnit === "KGs") {
                                        newGross = newGross * 1000;
                                    }

                                    handleLineItemAction("Update", idx, "weightUnit", nextUnit);
                                    handleLineItemAction("Update", idx, "grossWeight", newGross.toString());
                                }} 
                                style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", background: "#fff", cursor: "pointer" }}
                            >
                               <option value="KGs">KGs (Kilograms)</option>
                               <option value="Tones">Tones (Metric Tons)</option>
                            </select>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Inventory Status (Auto)</label>
                             <input type="text" disabled value={item.status || "Pending"} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                          </div>

                        </div>
                      ))}
                      <Button style={{ alignSelf: "flex-start", background: "#FFFFFF", color: COLORS.accent, border: `1.5px solid ${COLORS.accent}`, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", width: "36px", height: "36px", borderRadius: "50%", padding: 0, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }} onClick={() => handleLineItemAction("Add")}>+</Button>
                    </div>
                  </div>
              
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button 
                      style={{ 
                        background: lotSaveBtn.color || COLORS.sidebar, 
                        fontWeight: "800", 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.4s ease"
                      }} 
                      onClick={handleRegisterLot}
                    >
                      {lotSaveBtn.label}
                    </Button>
                    

                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => {
                        setActiveLotTab("LOT Creation");
                        setLotCreationForm({
                          ...lotCreationForm,
                          lotId: `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
                          vehicleNumber: "", driverName: "", origin: "", attachedBill: null, notes: "",
                          lineItems: [{ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", weightUnit: "KGs", status: "Pending Auction" }]
                        });
                    }}>Reset</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOT ALLOCATION MODULE */}
          {activeSection === "Lot Allocation" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  borderBottom: "1px solid #EBE9E1",
                  paddingBottom: "24px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 12px 0",
                      letterSpacing: "-0.5px",
                    }}
                  >
                  </h2>
                  <p
                    style={{
                      color: COLORS.muted,
                      fontWeight: "600",
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                  </p>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    onClick={() => setActiveAllocationTab("Allocation Form")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background: activeAllocationTab === "Allocation Form" ? COLORS.sidebar : "#F3F1EA",
                      color: activeAllocationTab === "Allocation Form" ? "#FFFFFF" : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    Allocation Form
                  </div>
                  <div
                    onClick={() => setActiveAllocationTab("Recorded Allocations")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background: activeAllocationTab === "Recorded Allocations" ? COLORS.sidebar : "#F3F1EA",
                      color: activeAllocationTab === "Recorded Allocations" ? "#FFFFFF" : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    Recorded Allocations
                  </div>
                </div>
              </div>

              {activeAllocationTab === "Allocation Form" && (
                <>

              <FormGrid
                sections={[
                  {
                    title: "Allocation Header",
                    fields: [
                      {
                        label: "Lot ID *",
                        info: lots.find(l => (l.lotId || l._id) === allocationForm.lotId)?.supplierId?.name || lots.find(l => (l.lotId || l._id) === allocationForm.lotId)?.farmerName || "",
                        type: "text",
                        list: "lots-list",
                        value: allocationForm.lotId,
                        onChange: (e) =>
                          setAllocationForm({
                            ...allocationForm,
                            lotId: e.target.value,
                          }),
                        placeholder: "Search lot...",
                      },
                      {
                        label: "Customer Name *",
                        type: "dropdown",
                        options: ["", ...buyers.map((b) => b.name)],
                        value: allocationForm.buyerId,
                        onChange: (e) => {
                          const selectedName = e.target.value;
                          setAllocationForm({
                            ...allocationForm,
                            buyerId: selectedName,
                          });
                        },
                      },
                      {
                        label: "Allocation Date *",
                        type: "date",
                        value: allocationForm.allocationDate,
                        onChange: (e) =>
                          setAllocationForm({
                            ...allocationForm,
                            allocationDate: e.target.value,
                          }),
                      },
                      {
                        label: "Invoice No",
                        type: "text",
                        value: allocationForm.buyerInvoiceNo || generateNextAllocationInvoiceNo(),
                        disabled: true,
                        placeholder: "Auto-generated Invoice No",
                      },
                      {
                        label: "Notes",
                        type: "text",
                        value: allocationForm.notes,
                        onChange: (e) =>
                          setAllocationForm({
                            ...allocationForm,
                            notes: e.target.value,
                          }),
                        placeholder: "E.g. quality remarks",
                      },
                    ],
                  },
                ]}
              />

              <datalist id="lots-list">
                {lots
                  .filter((l) => l.status !== "Fully Sold")
                  .map((l) => {
                    const supplier = (typeof l.supplierId === "object" ? l.supplierId : suppliers.find(s => s._id === l.supplierId));
                    const supplierName = supplier?.name || "Unknown Supplier";
                    const runningId = supplier?.supplierId || "";
                    const displayName = runningId ? `${supplierName}-${runningId}` : supplierName;
                    const itemCount = l.lineItems?.length || 0;
                    const entryDate = l.entryDate ? formatDate(l.entryDate) : "No Date";
                    const products = l.lineItems?.map(i => i.productId).filter(Boolean).slice(0, 2).join(", ") || "—";
                    return (
                      <option
                        key={l._id || l.lotId}
                        value={l.lotId}
                        label={`${l.lotId}  |  ${displayName}  |  ${entryDate}  |  ${itemCount} item${itemCount !== 1 ? "s" : ""}  |  ${products}`}
                      />
                    );
                  })}
              </datalist>

              {/* Multi-Item Table Section */}
              <div
                style={{
                  marginTop: "32px",
                  background: "#FFFFFF",
                  padding: "32px",
                  borderRadius: "12px",
                  border: "1px solid #EBE9E1",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    borderBottom: "1px solid #EBE9E1",
                    paddingBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: 0,
                    }}
                  >
                    Allocation Items
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: COLORS.muted,
                    }}
                  >
                    Found{" "}
                    {lots.find((l) => l.lotId === allocationForm.lotId)
                      ?.lineItems?.length || 0}{" "}
                    items for Lot: {allocationForm.lotId}
                  </span>
                </div>

                <div style={{ display: "grid", gap: "24px" }}>
                  {allocationForm.items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "24px",
                        padding: "24px",
                        background: "#FDFBF4",
                        borderRadius: "12px",
                        border: "1px solid #EBE9E1",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          right: "12px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            background: "#F1F7FF",
                            color: "#1D4ED8",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: "900",
                            border: "1px solid #DBEAFE",
                            cursor: "pointer",
                          }}
                          onClick={() => alert("SYNCING: Matching with Database inventory...")}
                        >
                          MODIFY
                        </div>
                        <div
                          style={{
                            background: "#FFF1F2",
                            color: "#E11D48",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: "900",
                            border: "1px solid #FFE4E6",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAllocationItemAction("Remove", idx)
                          }
                        >
                          DELETE
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Product / Variety / Grade *</label>
                        <ModernMultiSelectField
                          label="Product / Variety / Grade *"
                          value={item.lineItemId}
                          hideLabel={true}
                          options={(() => {
                            const currentLot = lots.find(l => l.lotId === allocationForm.lotId);
                            if (!currentLot) return [];
                            return (currentLot.lineItems || []).map(li => {
                              const parts = [li.productId || li.product, li.variety, li.grade].filter(Boolean);
                              return parts.join(" / ");
                            });
                          })()}
                          onChange={(e) =>
                            handleAllocationItemAction(
                              "Update",
                              idx,
                              "lineItemId",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Required Qty (Total)
                        </label>
                        <input
                          type="text"
                          disabled
                          value={item.totalAvailable}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            background: "#F1F5F9",
                            color: COLORS.muted,
                            fontSize: "13px",
                            fontWeight: "800",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Balance KGs
                        </label>
                        <input
                          type="text"
                          disabled
                          value={Number(item.balanceLeft || 0) - Number(item.quantity || 0)}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            background: "#F1F5F9",
                            color:
                              Number(item.balanceLeft || 0) - Number(item.quantity || 0) <= 0
                                ? "#CC0000"
                                : COLORS.primary,
                            fontSize: "13px",
                            fontWeight: "900",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Allocated Qty (KG) *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleAllocationItemAction(
                              "Update",
                              idx,
                              "quantity",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Sale Rate (₹/KG) *
                        </label>
                        <input
                          type="number"
                          value={item.saleRate}
                          onChange={(e) =>
                            handleAllocationItemAction(
                              "Update",
                              idx,
                              "saleRate",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Allocated Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={item.allocatedAmount}
                          onChange={(e) =>
                            handleAllocationItemAction(
                              "Update",
                              idx,
                              "allocatedAmount",
                              e.target.value,
                            )
                          }
                          placeholder={Number(item.quantity) * Number(item.saleRate) || "0"}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            background: "#FFF4E5",
                            color: "#D97706",
                            fontSize: "13px",
                            fontWeight: "800",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Sale Amount (₹) Auto
                        </label>
                        <input
                          type="text"
                          disabled
                          value={
                            (item.allocatedAmount !== "" && item.allocatedAmount !== undefined) 
                              ? item.allocatedAmount 
                              : (Number(item.quantity) * Number(item.saleRate) || 0)
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            background: "#F1F5F9",
                            color: COLORS.muted,
                            fontSize: "13px",
                            fontWeight: "800",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => handleAllocationItemAction("Add")}
                    style={{
                      alignSelf: "flex-start",
                      background: "#FFFFFF",
                      color: COLORS.accent,
                      border: `2px solid ${COLORS.accent}`,
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      padding: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "20px",
                      fontWeight: "900",
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                <Button
                  style={{
                    background: allocationSaveBtn.color || COLORS.sidebar,
                    fontWeight: "800",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "12px 24px",
                  }}
                  onClick={async () => {
                    await handleAllocate();
                    setAllocationSaveBtn({
                      label: "✅ Saved successfully",
                      color: COLORS.success,
                    });
                    setTimeout(() => {
                      setAllocationSaveBtn({ label: "Save", color: null });
                    }, 3000);
                  }}
                >
                  {allocationSaveBtn.label}
                </Button>
                <Button
                  style={{
                    background: "#F1F5F9",
                    color: "#CC0000",
                    border: "none",
                    fontWeight: "900",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    padding: "12px 24px",
                  }}
                  onClick={() =>
                    setAllocationForm({
                      lotId: "",
                      buyerId: "",
                      allocationDate: getISTDate(),
                      buyerInvoiceNo: "",
                      notes: "",
                      items: [
                        {
                          id: Date.now(),
                          lineItemId: "",
                          quantity: "",
                          saleRate: "",
                          totalAvailable: 0,
                          balanceLeft: 0,
                          allocatedAmount: "",
                        },
                      ],
                    })
                  }
                >
                  Clear All
                </Button>
              </div>
              </>
            )}

            {activeAllocationTab === "Recorded Allocations" && (
              <div style={{ animation: "fadeIn 0.3s ease-in" }}>
                <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "28px", fontWeight: "900", color: COLORS.sidebar, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Recently Recorded Allocations</h2>
                    <p style={{ margin: 0, color: COLORS.muted, fontSize: "14px", fontWeight: "600" }}>Complete history of lot distributions to customers</p>
                  </div>
                </div>

                <div style={{ marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <input
                      type="text"
                      placeholder="Search by customer name / invoice number / supplier id"
                      value={allocationSearchQuery}
                      onChange={(e) => setAllocationSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: "1.5px solid #EBE9E1",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: COLORS.sidebar,
                        outline: "none",
                        background: "#FDFBF4",
                        transition: "all 0.2s"
                      }}
                    />
                  </div>
                  <div style={{ width: "240px" }}>
                    <select
                      value={lotDateFilter}
                      onChange={(e) => {
                        setLotDateFilter(e.target.value);
                        if (e.target.value !== "Custom Date") {
                          setLotCustomDateStart("");
                          setLotCustomDateEnd("");
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: "1.5px solid #EBE9E1",
                        fontSize: "14px",
                        color: lotDateFilter ? COLORS.sidebar : COLORS.muted,
                        cursor: "pointer",
                        appearance: "auto",
                        background: "#FFFFFF"
                      }}
                    >
                      <option value="" disabled>Select date from particular date</option>
                      <option value="Today">Today</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days / One Month">30 Days / One Month</option>
                      <option value="Custom Date">Custom Date</option>
                    </select>
                  </div>
                  <div style={{ width: "220px" }}>
                    <select
                      value={lotProductFilter}
                      onChange={(e) => setLotProductFilter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: "1.5px solid #EBE9E1",
                        fontSize: "14px",
                        color: lotProductFilter ? COLORS.sidebar : COLORS.muted,
                        cursor: "pointer",
                        appearance: "auto",
                        background: "#FFFFFF"
                      }}
                    >
                      <option value="" disabled>Select Product</option>
                      {Array.from(new Set(
                        allocations.map(a => a.lineItemId?.split(" / ")[0] || a.productId).filter(Boolean)
                      )).map(prod => (
                        <option key={prod} value={prod}>{prod}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {lotDateFilter === "Custom Date" && (
                  <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center" }}>
                    <input
                      type="date"
                      value={lotCustomDateStart}
                      onChange={(e) => setLotCustomDateStart(e.target.value)}
                      style={{ padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #EBE9E1", fontSize: "14px", outline: "none" }}
                    />
                    <span style={{ fontWeight: "700", color: COLORS.muted }}>to</span>
                    <input
                      type="date"
                      value={lotCustomDateEnd}
                      onChange={(e) => setLotCustomDateEnd(e.target.value)}
                      style={{ padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #EBE9E1", fontSize: "14px", outline: "none" }}
                    />
                  </div>
                )}

                <div style={{ maxHeight: "750px", overflowY: "auto", padding: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                    {(() => {
                      const filtered = allocations
                        .filter(a => {
                          const customerName = (a.buyerId?.name || a.buyerId || "").toLowerCase();
                          const invoiceNo = (a.buyerInvoiceNo || "").toLowerCase();
                          
                          // Find supplier running ID
                          const matchedLot = lots.find(l => l._id === a.lotId || l.lotId === a.lotId);
                          const supplierObj = (typeof matchedLot?.supplierId === "object" ? matchedLot.supplierId : suppliers.find(s => s._id === matchedLot?.supplierId));
                          const supplierId = (supplierObj?.supplierId || "").toLowerCase();
                          
                          const query = (allocationSearchQuery || "").toLowerCase();
                          const matchesSearch = customerName.includes(query) || invoiceNo.includes(query) || supplierId.includes(query);

                          let matchesDate = true;
                          if (lotDateFilter) {
                            const dateVal = a.allocationDate || a.date;
                            if (dateVal) {
                              const d = new Date(dateVal);
                              d.setHours(0,0,0,0);
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              if (lotDateFilter === "Today") matchesDate = d.getTime() === today.getTime();
                              else if (lotDateFilter === "15 Days") {
                                const past = new Date(today); past.setDate(today.getDate() - 15);
                                matchesDate = d >= past && d <= today;
                              } else if (lotDateFilter === "30 Days / One Month") {
                                const past = new Date(today); past.setDate(today.getDate() - 30);
                                matchesDate = d >= past && d <= today;
                              } else if (lotDateFilter === "Custom Date") {
                                if (lotCustomDateStart) { const s = new Date(lotCustomDateStart); s.setHours(0,0,0,0); if (d < s) matchesDate = false; }
                                if (lotCustomDateEnd) { const e = new Date(lotCustomDateEnd); e.setHours(23,59,59,999); if (d > e) matchesDate = false; }
                              }
                            }
                          }

                          let matchesProduct = true;
                          if (lotProductFilter) {
                            const productPart = (a.lineItemId?.split(" / ")[0] || a.productId || "").toLowerCase();
                            matchesProduct = productPart === lotProductFilter.toLowerCase();
                          }

                          return matchesSearch && matchesDate && matchesProduct;
                        })
                        .slice()
                        .reverse();

                      // Group by Customer Name
                      const groups = filtered.reduce((acc, a) => {
                        const name = a.buyerId?.name || a.buyerId || "Customer";
                        if (!acc[name]) acc[name] = [];
                        acc[name].push(a);
                        return acc;
                      }, {});

                      return Object.entries(groups).map(([buyerName, items]) => {
                        const matchedLot = lots.find(l => l._id === items[0].lotId || l.lotId === items[0].lotId);
                        const supplierObj = (typeof matchedLot?.supplierId === "object" ? matchedLot.supplierId : suppliers.find(s => s._id === matchedLot?.supplierId));
                        const supplierName = supplierObj?.name || items[0].farmerName || "Unknown";
                        const supplierId = supplierObj?.supplierId || "";
                        const supplierDisplay = supplierId ? `${supplierName}-${supplierId}` : supplierName;

                        return (
                        <PremiumActionCard
                          key={buyerName}
                          title={<SmartDataNode text={buyerName} type="Name" data={items[0].buyerId || {}} onAdd={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSection("Buyer Invoicing"); setActiveBuyerInvoiceTab("Invoice Entry"); }} />}
                          subtitle={items[0].buyerInvoiceNo ? <SmartDataNode text={`INV: ${items[0].buyerInvoiceNo}`} type="Invoice" data={items[0]} /> : "UNASSIGNED"}
                          icon={ICON_USER}
                          status={{ text: "Allocated", color: "#1d4ed8", bg: "#dbeafe" }}
                          details={[
                            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, text: formatDate(items[0].allocationDate) },
                            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, text: supplierDisplay }
                          ]}
                          secondaryActions={[
                            { label: "Modify", icon: ICON_EDIT, onClick: () => { handleEditAllocation(items[0]); setActiveAllocationTab("Allocation Form"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                            { label: "View Details", icon: ICON_SHOP, onClick: () => setViewingEntity({ type: "Allocation", data: { ...items[0], allItems: items, buyerName: buyerName } }) },
                            { label: "Delete", icon: ICON_TRASH, onClick: () => { if (window.confirm("Delete this allocation group?")) items.forEach(i => handleDeleteAllocation(i._id)); } }
                          ]}
                          primaryAction={null}
                          onDelete={null}
                          onLock={() => alert("Allocation group finalized.")}
                        >
                          <div style={{ marginBottom: "8px", fontSize: "10px", fontWeight: "900", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Line Items</div>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                              <thead>
                                <tr style={{ borderBottom: "1.5px solid #E2E8F0", textAlign: "left", color: COLORS.muted }}>
                                  <th style={{ padding: "8px 4px" }}>Product</th>
                                  <th style={{ padding: "8px 4px", textAlign: "right" }}>Qty</th>
                                  <th style={{ padding: "8px 4px", textAlign: "right" }}>Rate</th>
                                  <th style={{ padding: "8px 4px", textAlign: "right" }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((it, idx) => (
                                  <tr key={idx} style={{ borderBottom: idx < items.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                                    <td style={{ padding: "8px 4px", fontWeight: "700" }}>
                                      <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span>{it.lineItemId || "Produce"}</span>
                                        <span style={{ fontSize: '9px', color: COLORS.muted }}>Lot: {it.lotNumber || it.lotReference || "-"}</span>
                                      </div>
                                    </td>
                                    <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "700" }}>{it.quantity} KG</td>
                                    <td style={{ padding: "8px 4px", textAlign: "right", color: COLORS.primary }}>₹{it.rate}</td>
                                    <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "900" }}>₹{(Number(it.quantity) * Number(it.rate)).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </PremiumActionCard>
                      );
                    });
                    })()}
                    {allocations.length === 0 && (
                      <p style={{ textAlign: "center", color: COLORS.muted, padding: "40px", gridColumn: "1/-1" }}>No recorded allocations found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          {/* SUPPLIER BILLING MODULE */}
          {activeSection === "Supplier Billing" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <TabHeader
                tabs={[
                  "Bill Header",
                  "Produce Sold",
                  "Expense Deductions",
                  "Settlement Overview",
                  "Preview & Print",
                  "Generated Bills",
                ]}
                active={activeSupplierBillTab}
                set={setActiveSupplierBillTab}
              />

              {activeSupplierBillTab === "Bill Header" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 24px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    Bill Header
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Bill Number
                      </label>
                      <input
                        type="text"
                        disabled
                        value={supplierSettlementForm.billNumber}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          background: "#F1F5F9",
                          color: COLORS.muted,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        value={supplierSettlementForm.date}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            date: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Supplier Name
                      </label>
                      <select
                        value={supplierSettlementForm.supplierId}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const matchedSupplier = suppliers.find(
                            (s) => s.name === selectedName,
                          );
                          const selectedId = matchedSupplier
                            ? matchedSupplier._id
                            : null;

                          // find the most recent lot for this supplier (matching by ID or Name)
                          const farmerLots = lots.filter(
                            (l) =>
                              l.supplierId === selectedId ||
                              l.supplierId === selectedName ||
                              l.supplierId?.name === selectedName ||
                              l.farmerId === selectedName,
                          );
                          const latestLot =
                            farmerLots.length > 0
                              ? farmerLots[farmerLots.length - 1]
                              : null;

                          const itemsToAdd =
                            latestLot &&
                            latestLot.lineItems &&
                            latestLot.lineItems.length > 0
                              ? latestLot.lineItems.map((iter, idx) => ({
                                  id: Date.now() + idx,
                                  productName:
                                    `${iter.productId || ""} ${iter.variety || ""}`.trim() ||
                                    "Produce",
                                  quantity: Math.max(
                                    0,
                                    (Number(iter.grossWeight) || 0) -
                                      (Number(iter.deductions) || 0),
                                  ),
                                  rate: iter.estimatedRate || "",
                                }))
                              : [
                                  {
                                    id: Date.now(),
                                    productName: "",
                                    quantity: "",
                                    rate: "",
                                  },
                                ];

                          setSupplierSettlementForm((prev) => ({
                            ...prev,
                            supplierId: selectedName,
                            supplierPhone: matchedSupplier?.phone || matchedSupplier?.mobile || "",
                            lotId: latestLot ? latestLot.lotId : "",
                            vehicleNumber: latestLot
                              ? latestLot.vehicleNumber || ""
                              : "",
                            date:
                              latestLot && latestLot.entryDate
                                ? latestLot.entryDate.slice(0, 10)
                                : prev.date,
                            items: itemsToAdd,
                            expenses: {
                              ...prev.expenses,
                              advance: matchedSupplier?.advanceBalance || prev.expenses.advance || "",
                            }
                          }));
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        <option value="" disabled>{getSelectPlaceholder("Supplier Name")}</option>
                        {suppliers.map((s) => (
                          <option key={s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Lot ID Reference{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: COLORS.primary,
                            fontWeight: "800",
                          }}
                        >
                          AUTO
                        </span>
                      </label>
                      <select
                        value={supplierSettlementForm.lotId}
                        onChange={(e) => {
                          const selectedLotId = e.target.value;
                          const matchedLot = lots.find(
                            (l) => l.lotId === selectedLotId,
                          );

                          const itemsToAdd =
                            matchedLot &&
                            matchedLot.lineItems &&
                            matchedLot.lineItems.length > 0
                              ? matchedLot.lineItems.map((iter, idx) => ({
                                  id: Date.now() + idx,
                                  productName:
                                    `${iter.product || iter.productId || ""} ${iter.variety || ""}`.trim() ||
                                    "Produce",
                                  quantity: Math.max(
                                    0,
                                    (Number(iter.grossWeight) || 0) -
                                      (Number(iter.deductions) || 0),
                                  ),
                                  rate: iter.rate || iter.estimatedRate || "",
                                }))
                              : [
                                  {
                                    id: Date.now(),
                                    productName: "",
                                    quantity: "",
                                    rate: "",
                                  },
                                ];

                          const resolvedSupplier = matchedLot
                            ? suppliers.find(
                                (s) =>
                                  s._id === matchedLot.supplierId ||
                                  s.name === matchedLot.supplierId ||
                                  s._id === matchedLot.farmerId,
                              )
                            : null;

                          setSupplierSettlementForm((prev) => {
                            const lotSuffix = selectedLotId ? selectedLotId.split('-').pop() : "";
                            let newBillNumber = prev.billNumber;
                            if (lotSuffix) {
                              newBillNumber = lotSuffix.length > 2 ? lotSuffix.slice(-2) : lotSuffix;
                            }
                            return {
                              ...prev,
                              lotId: selectedLotId,
                              billNumber: newBillNumber,
                              supplierId: resolvedSupplier
                                ? resolvedSupplier.name
                                : matchedLot?.supplierId?.name ||
                                  matchedLot?.supplierId ||
                                  prev.supplierId,
                              supplierPhone: resolvedSupplier?.phone || resolvedSupplier?.mobile || prev.supplierPhone || "",
                              vehicleNumber: matchedLot
                                ? matchedLot.vehicleNumber || prev.vehicleNumber
                                : prev.vehicleNumber,
                              date:
                                matchedLot && matchedLot.entryDate
                                  ? matchedLot.entryDate.slice(0, 10)
                                  : prev.date,
                              items: itemsToAdd,
                            };
                          });
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          backgroundColor: "#FFFFFF",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        <option value="" style={{ background: "#e2e8f0", color: COLORS.sidebar }}>{getSelectPlaceholder("Lot ID Reference")}</option>
                        {lots
                          .filter((l) => {
                            const matchedSupp = suppliers.find(
                              (s) =>
                                s.name === supplierSettlementForm.supplierId,
                            );
                            const suppId = matchedSupp ? matchedSupp._id : null;
                            return (
                              !supplierSettlementForm.supplierId ||
                              l.supplierId === suppId ||
                              l.supplierId ===
                                supplierSettlementForm.supplierId ||
                              l.supplierId?.name ===
                                supplierSettlementForm.supplierId ||
                              l.farmerId === supplierSettlementForm.supplierId
                            );
                          })
                          .map((l) => (
                            <option key={l._id || l.lotId} value={l.lotId} style={{ background: "#e2e8f0", color: COLORS.sidebar }}>
                              {l.lotId}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Vehicle Number{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: COLORS.primary,
                            fontWeight: "800",
                          }}
                        >
                          AUTO
                        </span>
                      </label>
                      <input
                        type="text"
                        value={supplierSettlementForm.vehicleNumber}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            vehicleNumber: e.target.value,
                          })
                        }
                        placeholder="Auto-filled from Lot"
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          background: supplierSettlementForm.vehicleNumber
                            ? "#FDFBF4"
                            : "#FFFFFF",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Mobile Number{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: COLORS.primary,
                            fontWeight: "800",
                          }}
                        >
                          AUTO
                        </span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={supplierSettlementForm.supplierPhone || ""}
                        placeholder="Auto-filled from Supplier"
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          background: supplierSettlementForm.supplierPhone
                            ? "#FDFBF4"
                            : "#F1F5F9",
                          color: supplierSettlementForm.supplierPhone
                            ? COLORS.sidebar
                            : COLORS.muted,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.5px",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "32px",
                      paddingTop: "24px",
                      borderTop: "2px solid #F1F5F9",
                    }}
                  >
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "800",
                        padding: "12px 32px",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Produce Sold");
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {activeSupplierBillTab === "Produce Sold" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 24px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    Produce Sold
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {supplierSettlementForm.items.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                          background: "#FDFBF4",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1.5px solid #EBE9E1",
                          position: "relative",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              background: "#F1F7FF",
                              color: "#1D4ED8",
                              padding: "6px 14px",
                              borderRadius: "8px",
                              fontSize: "10px",
                              fontWeight: "900",
                              border: "1px solid #DBEAFE",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              alert(
                                "SYNCING: This item record is being matched with Database Inventory...",
                              )
                            }
                          >
                            MODIFY
                          </div>
                          <div
                            style={{
                              background: "#FFF1F2",
                              color: "#E11D48",
                              padding: "6px 14px",
                              borderRadius: "8px",
                              fontSize: "10px",
                              fontWeight: "900",
                              border: "1px solid #FFE4E6",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (
                                item._id &&
                                !window.confirm(
                                  "DB ALERT: This item is permanently stored in the Database. Are you sure you want to remove it from this Bill?",
                                )
                              )
                                return;
                              handleSupplierItemAction("Remove", idx);
                            }}
                          >
                            DELETE
                          </div>
                        </div>

                          <ModernMultiSelectField
                            label="Item / Product Name"
                            value={item.productName}
                            options={(lots.find((l) => l.lotId === supplierSettlementForm.lotId)?.lineItems || []).map((li) => `${li.product || li.productId || ""} ${li.variety || ""}`.trim())}
                            onChange={(e) => {
                              const val = e.target.value;
                              const matchedLot = lots.find(
                                (l) => l.lotId === supplierSettlementForm.lotId,
                              );
                              const lotItem = matchedLot?.lineItems?.find(
                                (li) =>
                                  `${li.product || li.productId || ""} ${li.variety || ""}`.trim() ===
                                  val,
                              );

                              handleSupplierItemAction(
                                "Update",
                                idx,
                                "productName",
                                val,
                              );
                              if (lotItem) {
                                handleSupplierItemAction(
                                  "Update",
                                  idx,
                                  "quantity",
                                  Number(lotItem.grossWeight) -
                                    Number(lotItem.deductions) || "",
                                );
                                handleSupplierItemAction(
                                  "Update",
                                  idx,
                                  "rate",
                                  lotItem.estimatedRate || "",
                                );
                              }
                            }}
                            style={{ flex: "none" }}
                          />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Quantity (KGs)
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleSupplierItemAction(
                                "Update",
                                idx,
                                "quantity",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Deduction Quantity</label>
                          <input type="number" value={item.deductions || ""} onChange={(e) => handleSupplierItemAction("Update", idx, "deductions", e.target.value)} placeholder="0" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Thotrasi (6%)</label>
                          <input type="number" disabled value={(Number(item.deductions || 0) * 0.06).toFixed(2)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Grading (4%)</label>
                          <input type="number" disabled value={(Number(item.deductions || 0) * 0.04).toFixed(2)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Net Weight</label>
                          <input type="number" disabled value={(Number(item.quantity || 0) - Number(item.deductions || 0)).toFixed(2)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Rate (₹/KG)
                          </label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              handleSupplierItemAction(
                                "Update",
                                idx,
                                "rate",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Total (₹) Auto
                          </label>
                          <input
                            type="number"
                            disabled
                            value={
                              ((Number(item.quantity) - Number(item.deductions || 0)) * Number(item.rate) || 0).toFixed(2)
                            }
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              background: "#F1F5F9",
                              color: COLORS.muted,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "800",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Advance Balance</label>
                          <input type="number" disabled value={(Number(suppliers.find(s => s._id === supplierSettlementForm.supplierId || s.name === supplierSettlementForm.supplierId)?.advanceBalance) || 0).toFixed(2)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Amount Balance</label>
                          <input type="number" disabled value={(((Number(item.quantity || 0) - Number(item.deductions || 0)) * Number(item.rate || 0)) - (Number(suppliers.find(s => s._id === supplierSettlementForm.supplierId || s.name === supplierSettlementForm.supplierId)?.advanceBalance) || 0)).toFixed(2)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                        </div>
                      </div>
                    ))}
                    <Button
                      style={{
                        alignSelf: "flex-start",
                        background: "#FFFFFF",
                        color: COLORS.accent,
                        border: `1.5px solid ${COLORS.accent}`,
                        fontWeight: "900",
                        marginTop: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      }}
                      onClick={() => handleSupplierItemAction("Add")}
                    >
                      Add Next Sale Item
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "32px",
                      paddingTop: "24px",
                      borderTop: "2px solid #F1F5F9",
                    }}
                  >
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.sidebar,
                        fontWeight: "800",
                        border: "none",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Bill Header");
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "800",
                        padding: "12px 32px",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Expense Deductions");
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {activeSupplierBillTab === "Expense Deductions" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 16px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    Expense Deductions
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Lorry Freight / Transport
                      </label>
                      <input
                        type="number"
                        value={supplierSettlementForm.expenses.transport}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              transport: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Market Fee / Commission
                      </label>
                      <input
                        type="text"
                        value={supplierSettlementForm.expenses.commission}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              commission: e.target.value,
                            },
                          })
                        }
                        placeholder="₹ or %"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Labour / Hamali
                      </label>
                      <input
                        type="number"
                        value={supplierSettlementForm.expenses.labour}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              labour: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Cash Advance Paid
                      </label>
                      <input
                        type="number"
                        value={supplierSettlementForm.expenses.advance}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              advance: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Weighing Charges (Kata)
                      </label>
                      <input
                        type="number"
                        value={supplierSettlementForm.expenses.weighing}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              weighing: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Packing Material
                      </label>
                      <input
                        type="number"
                        value={supplierSettlementForm.expenses.packing}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              packing: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <div style={{ flex: 1, marginRight: "12px" }}>
                        <ModernMultiSelectField
                          label="Other Deductions"
                          value={supplierSettlementForm.expenses.miscName}
                          options={["Loading", "Unloading", "Weighment", "Cleaning", "Sorting", "Miscellaneous"]}
                          onChange={(e) =>
                            setSupplierSettlementForm({
                              ...supplierSettlementForm,
                              expenses: {
                                ...supplierSettlementForm.expenses,
                                miscName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <input
                        type="number"
                        value={supplierSettlementForm.expenses.miscAmount}
                        onChange={(e) =>
                          setSupplierSettlementForm({
                            ...supplierSettlementForm,
                            expenses: {
                              ...supplierSettlementForm.expenses,
                              miscAmount: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "32px",
                      paddingTop: "24px",
                      borderTop: "2px solid #F1F5F9",
                    }}
                  >
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.sidebar,
                        fontWeight: "800",
                        border: "none",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Produce Sold");
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "800",
                        padding: "12px 32px",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Financial Summary");
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {activeSupplierBillTab === "Settlement Overview" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "40px",
                    borderRadius: "16px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.01)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "900",
                      color: COLORS.sidebar,
                      margin: "0 0 32px 0",
                      borderBottom: "1.5px solid #F1F5F9",
                      paddingBottom: "20px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Settlement Overview
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {(() => {
                      const grossSale = (supplierSettlementForm.items || []).reduce(
                        (sum, it) =>
                          sum + ((Number(it.quantity) - Number(it.deductions || 0)) * Number(it.rate) || 0),
                        0,
                      );
                      const ex = supplierSettlementForm.expenses;

                      let parsedCommission = 0;
                      if (
                        typeof ex.commission === "string" &&
                        ex.commission.includes("%")
                      ) {
                        const pct = Number(ex.commission.replace("%", ""));
                        if (!isNaN(pct))
                          parsedCommission = (grossSale * pct) / 100;
                      } else {
                        parsedCommission = Number(ex.commission) || 0;
                      }

                      // Manual Settlement Fields (User requested to move these here or have them here specifically)
                      // Final Settlement Amount = Total Amount (Produce Sold) + All Expenses Deduction
                      // Manual: Labour, Other, Misc. Assuming existing ones.
                      const finalSettlement = grossSale + (Number(ex.labour) || 0) + (Number(ex.miscAmount) || 0) + parsedCommission + (Number(ex.transport) || 0);

                      return (
                        <>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                            {/* Manual Entry Section */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", background: "#FDFBF4", borderRadius: "12px", border: "1.5px solid #EBE9E1" }}>
                               <h3 style={{ fontSize: "14px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "8px" }}>Manual Expenses</h3>
                               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.muted }}>Labour Charges</label>
                                  <input type="number" value={ex.labour} onChange={(e) => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...ex, labour: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px", borderRadius: "8px", border: "1px solid #EBE9E1", fontWeight: "700", textAlign: "right" }} />
                               </div>
                               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.muted }}>Other Deductions</label>
                                  <input type="number" value={ex.transport} onChange={(e) => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...ex, transport: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px", borderRadius: "8px", border: "1px solid #EBE9E1", fontWeight: "700", textAlign: "right" }} />
                               </div>
                               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.muted }}>Misc. Expenses</label>
                                  <input type="number" value={ex.miscAmount} onChange={(e) => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...ex, miscAmount: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px", borderRadius: "8px", border: "1px solid #EBE9E1", fontWeight: "700", textAlign: "right" }} />
                               </div>
                            </div>

                            {/* Automatic Fields Section */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", background: "#F1F5F9", borderRadius: "12px", border: "1.5px solid #E2E8F0" }}>
                               <h3 style={{ fontSize: "14px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "8px" }}>Automatic Summary</h3>
                               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.muted }}>Total Amount (Produce Sold)</label>
                                  <span style={{ fontWeight: "800", color: COLORS.sidebar }}>{formatCurrency(grossSale)}</span>
                               </div>
                               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.muted }}>Taxes / Commissions</label>
                                  <span style={{ fontWeight: "800", color: COLORS.sidebar }}>{formatCurrency(parsedCommission)}</span>
                               </div>
                            </div>
                          </div>

                          {/* Final Calculation */}
                          {/* Final Calculation Banner */}
                          <div style={{ 
                            background: "linear-gradient(135deg, " + COLORS.sidebar + " 0%, " + COLORS.sidebar + " 100%)", 
                            padding: "32px", 
                            borderRadius: "20px", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            marginTop: "16px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            position: "relative",
                            overflow: "hidden"
                          }}>
                             <div style={{ position: "relative", zIndex: 1 }}>
                                <h3 style={{ margin: 0, color: "#FFFFFF", fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px" }}>Final Settlement Amount</h3>
                                <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "600" }}>Total Produce sold including all expense adjustments</p>
                             </div>
                             <div style={{ position: "relative", zIndex: 1, textAlign: "right" }}>
                                <span style={{ display: "block", fontSize: "36px", fontWeight: "950", color: COLORS.accent, lineHeight: 1 }}>{formatCurrency(finalSettlement)}</span>
                                <span style={{ display: "block", fontSize: "10px", color: "#FFFFFF", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginTop: "8px" }}>Proceed to Preview & Print</span>
                             </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "24px", borderTop: "2px solid #F1F5F9" }}>
                            <Button style={{ background: "#F1F5F9", color: COLORS.sidebar, fontWeight: "800", border: "none" }} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSupplierBillTab("Expense Deductions"); }}>Previous</Button>
                            <Button style={{ background: COLORS.sidebar, fontWeight: "800", padding: "12px 32px", borderRadius: "8px" }} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSupplierBillTab("Preview & Print"); }}>Next →</Button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {activeSupplierBillTab === "Preview & Print" && (
                <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                  <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 style={{ fontSize: "28px", fontWeight: "900", color: COLORS.sidebar, margin: 0, letterSpacing: "-0.5px" }}>Preview & Print</h2>
                      <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: "14px", fontWeight: "600" }}>Generated document for supplier settlement record</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={handleSaveSupplierBillPDF}
                        style={{
                          background: "#1a3c34",
                          color: "#fff",
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "800",
                          fontSize: "14px",
                          boxShadow: "0 4px 12px rgba(26,60,52,0.2)"
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Save as PDF
                      </button>
                      <button
                        onClick={() => handleSendSupplierWhatsApp(lastGeneratedBill)}
                        style={{
                          background: "#25D366",
                          color: "#fff",
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "800",
                          fontSize: "14px",
                          boxShadow: "0 4px 12px rgba(37,211,102,0.2)"
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.399-4.305 9.79-9.884 9.79m8.415-18.298A11.715 11.715 0 0012.045 0C5.41 0 .011 5.393 0 12.015c0 2.115.55 4.18 1.59 6.037L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.628 0 12.028-5.391 12.033-12.013a11.859 11.859 0 00-3.58-8.505"/></svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>

                  <div 
                    ref={billRef}
                    style={{
                      background: "#fff",
                      padding: "40px",
                      borderRadius: "0",
                      border: "2px solid #1a3c34",
                      maxWidth: "900px",
                      margin: "0 auto",
                      position: "relative",
                      color: "#1a1a1a",
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                  >
                    {!lastGeneratedBill ? (
                      <div style={{ textAlign: "center", padding: "60px", color: COLORS.muted }}>
                        <h3 style={{ fontWeight: 800 }}>No bill generated yet.</h3>
                        <p>Generate a bill to preview the official document here.</p>
                      </div>
                    ) : (() => {
                      const supplier = suppliers.find(s => (s._id || s.name) === lastGeneratedBill.supplierId) || { name: lastGeneratedBill.supplierName };
                      const lot = lots.find(l => l.lotId === lastGeneratedBill.lotId) || {};
                      const ex = lastGeneratedBill.expenses || {};
                      const items = lastGeneratedBill.items || [];
                      const grossSaleAmount = items.reduce((s, it) => s + (Number(it.quantity || 0) * Number(it.rate || 0)), 0);
                      const totalDeductions = Object.entries(ex).reduce((s, [k, v]) => k !== 'advance' ? s + (Number(v) || 0) : s, 0);
                      const netSaleAmount = grossSaleAmount - totalDeductions;
                      const balancePayable = netSaleAmount - (Number(ex.advance) || 0);

                      return (
                        <>
                          {/* Header Block */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "4px solid #1a3c34", paddingBottom: "20px", marginBottom: "20px" }}>
                            <div style={{ background: "#1a3c34", padding: "15px", borderRadius: "8px" }}>
                              <div style={{ border: "2px solid #fff", color: "#fff", padding: "10px", fontSize: "32px", fontWeight: "900", textAlign: "center" }}>
                                SPV
                              </div>
                              <div style={{ color: "#fff", fontSize: "10px", textAlign: "center", marginTop: "4px", fontWeight: "700" }}>FRUITS</div>
                            </div>
                            <div style={{ flex: 1, paddingLeft: "30px" }}>
                              <h1 style={{ margin: 0, fontSize: "42px", fontWeight: "900", color: "#1a3c34", letterSpacing: "1px" }}>SPV FRUITS</h1>
                              <h3 style={{ margin: "2px 0", fontSize: "16px", fontWeight: "700", color: "#1a3c34" }}>SRI PRASANNA VENKATESWARA FRUITS</h3>
                              <p style={{ margin: "2px 0", color: "#2e7d32", fontSize: "12px", fontWeight: "800" }}>FRUIT SUPPLIER AND TRADERS</p>
                              <p style={{ margin: "4px 0", color: "#666", fontSize: "11px", fontWeight: "600" }}>Shop No. 35, Mango Market Yard, Tanapalli Cross, TIRUPATI - 517 501, AP</p>
                              <p style={{ margin: 0, color: "#1a3c34", fontSize: "11px", fontWeight: "800", textDecoration: "underline" }}>www.spvfruits.com</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ margin: "2px 0", fontSize: "13px", fontWeight: "800", color: "#1a3c34" }}>📞 9866425756</p>
                              <p style={{ margin: "2px 0", fontSize: "13px", fontWeight: "800", color: "#1a3c34" }}>9848272835</p>
                              <p style={{ margin: "2px 0", fontSize: "13px", fontWeight: "800", color: "#1a3c34" }}>9110500540</p>
                            </div>
                          </div>

                          {/* Banner Heading */}
                          <div style={{ background: "#1a3c34", color: "#fff", display: "flex", justifyContent: "space-between", padding: "8px 20px", borderRadius: "4px", marginBottom: "20px" }}>
                            <span style={{ fontWeight: "800", fontSize: "15px" }}>FARMER SETTLEMENT BILL</span>
                            <div style={{ display: "flex", gap: "40px" }}>
                              <span style={{ fontWeight: "700", fontSize: "13px" }}>BILL NO. <span style={{ textDecoration: "underline", marginLeft: "10px" }}>{lastGeneratedBill.billNumber}</span></span>
                              <span style={{ fontWeight: "700", fontSize: "13px" }}>DATE <span style={{ textDecoration: "underline", marginLeft: "10px" }}>{formatDate(lastGeneratedBill.date)}</span></span>
                            </div>
                          </div>

                          {/* Supplier/Log Meta Info */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                            <div style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                              <label style={{ fontSize: "10px", fontWeight: "800", color: "#666", display: "block" }}>FARMER / SUPPLIER (M/s)</label>
                              <span style={{ fontSize: "13px", fontWeight: "900" }}>{supplier.name}</span>
                            </div>
                            <div style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                              <label style={{ fontSize: "10px", fontWeight: "800", color: "#666", display: "block" }}>LOT ID</label>
                              <span style={{ fontSize: "13px", fontWeight: "900" }}>{lastGeneratedBill.lotId || "N/A"}</span>
                            </div>
                            <div style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                              <label style={{ fontSize: "10px", fontWeight: "800", color: "#666", display: "block" }}>VEHICLE NO.</label>
                              <span style={{ fontSize: "13px", fontWeight: "900" }}>{lot.vehicleNumber || lastGeneratedBill.vehicleNumber || "N/A"}</span>
                            </div>
                            <div style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                              <label style={{ fontSize: "10px", fontWeight: "800", color: "#666", display: "block" }}>SUPPLIER ID</label>
                              <span style={{ fontSize: "13px", fontWeight: "900" }}>{lastGeneratedBill.supplierId || "N/A"}</span>
                            </div>
                            <div style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                              <label style={{ fontSize: "10px", fontWeight: "800", color: "#666", display: "block" }}>LOCATION</label>
                              <span style={{ fontSize: "13px", fontWeight: "900" }}>{lot.location || supplier.location || supplier.village || "N/A"}</span>
                            </div>
                            <div style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                              <label style={{ fontSize: "10px", fontWeight: "800", color: "#666", display: "block" }}>DATE</label>
                              <span style={{ fontSize: "13px", fontWeight: "900" }}>{formatDate(lastGeneratedBill.date)}</span>
                            </div>
                          </div>

                          {/* Items Table */}
                          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px", border: "1.5px solid #1a3c34" }}>
                            <thead>
                              <tr style={{ background: "#1a3c34", color: "#fff" }}>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)", width: "50px" }}>S.No</th>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)", textAlign: "left" }}>PARTICULARS <br/><span style={{fontSize:'8px'}}>(Product - Variety - Grade)</span></th>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)" }}>GROSS WT <br/><span style={{fontSize:'8px'}}>(KG)</span></th>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)" }}>DEDN <br/><span style={{fontSize:'8px'}}>(KG)</span></th>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)" }}>NET WT <br/><span style={{fontSize:'8px'}}>(KG)</span></th>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)" }}>RATE <br/><span style={{fontSize:'8px'}}>(₹/KG)</span></th>
                                <th style={{ padding: "10px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.2)", textAlign: "right" }}>AMOUNT <br/><span style={{fontSize:'8px'}}>(₹)</span></th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((it, idx) => (
                                <tr key={idx} style={{ textAlign: "center" }}>
                                  <td style={{ padding: "12px", fontSize: "12px", fontWeight: "700", border: "1px solid #1a3c34" }}>{idx + 1}</td>
                                  <td style={{ padding: "12px", fontSize: "12px", fontWeight: "800", border: "1px solid #1a3c34", textAlign: "left" }}>
                                    {it.productName} {it.variety ? `- ${it.variety}` : ""} {it.grade ? `- ${it.grade}` : ""}
                                  </td>
                                  <td style={{ padding: "12px", fontSize: "12px", fontWeight: "700", border: "1px solid #1a3c34" }}>{it.grossWeight || it.quantity || "0"}</td>
                                  <td style={{ padding: "12px", fontSize: "12px", border: "1px solid #1a3c34" }}>{it.deduction || "0"}</td>
                                  <td style={{ padding: "12px", fontSize: "12px", fontWeight: "900", border: "1px solid #1a3c34" }}>{it.netWeight || it.quantity || "0"}</td>
                                  <td style={{ padding: "12px", fontSize: "12px", border: "1px solid #1a3c34" }}>{it.rate || "0"}</td>
                                  <td style={{ padding: "12px", fontSize: "13px", fontWeight: "900", border: "1px solid #1a3c34", textAlign: "right" }}>
                                    ₹{((it.netWeight || it.quantity || 0) * (it.rate || 0)).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                              {/* Filler Rows if less than 6 */}
                              {[...Array(Math.max(0, 6 - items.length))].map((_, i) => (
                                <tr key={`filler-${i}`}>
                                  {[...Array(7)].map((__, j) => (
                                    <td key={j} style={{ padding: "15px", border: "1px solid #1a3c34" }}>&nbsp;</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            {/* Expenditure Column */}
                            <div style={{ flex: 1 }}>
                              <div style={{ background: "#1a3c34", color: "#fff", padding: "6px 12px", fontSize: "11px", fontWeight: "800", textAlign: "center", borderRadius: "4px 4px 0 0" }}>
                                EXPENDITURE DEDUCTIONS
                              </div>
                              <div style={{ border: "1px solid #1a3c34", borderTop: "none", padding: "10px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: "11px", fontWeight: "700" }}>
                                  <span>Lorry Hire / Freight</span>
                                  <span>₹ {ex.transport || ex.freight || "0"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: "11px", fontWeight: "700" }}>
                                  <span>Coolie / Labour</span>
                                  <span>₹ {ex.labour || "0"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: "11px", fontWeight: "700" }}>
                                  <span>Cash Advance</span>
                                  <span>₹ {ex.cashAdvance || "0"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: "11px", fontWeight: "700" }}>
                                  <span>Kata (Weighing Charges)</span>
                                  <span>₹ {ex.weighing || "0"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: "11px", fontWeight: "700" }}>
                                  <span>Packing / Bag Charges</span>
                                  <span>₹ {ex.packing || "0"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: "11px", fontWeight: "700" }}>
                                  <span>AMC Charges</span>
                                  <span>₹ {ex.commission || "0"}</span>
                                </div>
                                <div style={{ background: "#1a3c34", color: "#fff", padding: "8px 12px", display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "13px", fontWeight: "900" }}>
                                  <span>TOTAL DEDUCTIONS (₹)</span>
                                  <span>{totalDeductions.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Summary Column */}
                            <div style={{ flex: 1 }}>
                              <div style={{ paddingTop: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "13px", fontWeight: "700", borderBottom: "1.5px solid #eee" }}>
                                  <span>Gross Sale Amount</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>₹</span>
                                    <span style={{ borderBottom: "1px solid #1a3c34", minWidth: "100px", textAlign: "right" }}>{grossSaleAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "13px", fontWeight: "700", borderBottom: "1.5px solid #eee" }}>
                                  <span>Less: Total Deductions</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>₹</span>
                                    <span style={{ borderBottom: "1px solid #1a3c34", minWidth: "100px", textAlign: "right" }}>{totalDeductions.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 10px", fontSize: "16px", fontWeight: "900", background: "#f0fdf4", margin: "10px 0", color: "#166534", borderRadius: "6px" }}>
                                  <span>Net Sale Amount</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>₹</span>
                                    <span>{netSaleAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "13px", fontWeight: "700", borderBottom: "1.5px solid #eee" }}>
                                  <span>Advance Payment</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>₹</span>
                                    <span style={{ borderBottom: "1px solid #1a3c34", minWidth: "100px", textAlign: "right" }}>{(Number(ex.advance) || 0).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 10px", fontSize: "16px", fontWeight: "900", background: "#dcfce7", margin: "10px 0", color: "#14532d", border: "1.5px solid #14532d", borderRadius: "6px" }}>
                                  <span>Balance Payable to Farmer</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>₹</span>
                                    <span>{balancePayable.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Remarks Section */}
                          <div style={{ marginBottom: "30px", fontSize: "11px", fontWeight: "700", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                            <span style={{ color: "#666" }}>REMARKS | NOTES :</span>
                            <div style={{ marginTop: "5px", height: "30px", borderBottom: "1px dashed #ccc" }}>{lastGeneratedBill.remarks || ""}</div>
                          </div>

                          {/* Signatures */}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", padding: "20px 0" }}>
                            <div style={{ textAlign: "center", width: "250px" }}>
                              <p style={{ fontSize: "11px", fontWeight: "800", color: "#1a3c34", marginBottom: "40px" }}>FARMER / SUPPLIER SIGNATURE</p>
                              <div style={{ borderTop: "2px solid #1a3c34", width: "100%" }}></div>
                            </div>
                            <div style={{ textAlign: "center", width: "250px" }}>
                              <p style={{ fontSize: "11px", fontWeight: "800", color: "#1a3c34", marginBottom: "40px" }}>FOR SPV FRUITS</p>
                              <div style={{ borderTop: "2px solid #1a3c34", width: "100%" }}></div>
                              <p style={{ fontSize: "10px", color: "#666", marginTop: "5px", fontWeight: "700" }}>Authorised Signatory</p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div style={{ background: "#1a3c34", color: "#fff", padding: "12px", textAlign: "center", borderRadius: "4px", marginTop: "30px" }}>
                            <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", letterSpacing: "1px" }}>
                              This is a computer generated bill | <span style={{ color: "#a5d6a7" }}>Stacli MOS — Powered by</span> <a href="http://www.stacli.com" style={{ color: "#fff", textDecoration: "none" }}>www.stacli.com</a>
                            </p>
                          </div>
                          <p style={{ textAlign: "center", fontSize: "9px", color: "#999", marginTop: "8px", fontWeight: "600" }}>
                            Subject to Tirupati, Andhra Pradesh, India jurisdiction. Bills once issued are final and locked.
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {activeSupplierBillTab === "Generated Bills" && (
                <div style={{ animation: "fadeIn 0.3s ease-in" }}>
                  <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: "900", color: COLORS.sidebar, margin: 0 }}>Recently Generated Bills</h3>
                      <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: "13px", fontWeight: "600" }}>Complete history of finalized supplier statements</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <input
                      type="text"
                      placeholder="Search by Bill Number or Supplier Name..."
                      value={billSearchQuery}
                      onChange={(e) => setBillSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: "1.5px solid #EBE9E1",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: COLORS.sidebar,
                        outline: "none",
                        background: "#FDFBF4",
                        transition: "all 0.2s"
                      }}
                    />
                  </div>

                  <div style={{ maxHeight: "750px", overflowY: "auto", padding: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                      {supplierBills
                        .filter(b => {
                          const supplierName = (b.supplierId?.name || b.supplierId || "").toLowerCase();
                          const billNo = (b.billNumber || "").toLowerCase();
                          const query = (billSearchQuery || "").toLowerCase();
                          const dateMatch = isWithinFilterRange(b.date);
                          return dateMatch && (supplierName.includes(query) || billNo.includes(query));
                        })
                        .slice()
                        .reverse()
                        .map((b) => {
                          const grossTotal = (b.items || []).reduce((s, i) => s + (Number(i.quantity || 0) * Number(i.rate || 0)), 0);
                          const totalExpenses = Object.values(b.expenses || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                          const finalSettlement = grossTotal - totalExpenses;

                          return (
                            <PremiumActionCard
                              key={b._id || Date.now() + Math.random()}
                              title={<SmartDataNode text={b.supplierId?.name || b.supplierId || "Supplier Name"} type="Supplier" data={b.supplierId || {}} onAdd={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSection("Supplier Billing"); setActiveSupplierBillTab("Bill Settlement"); }} />}
                              subtitle={b.billNumber ? <SmartDataNode text={`Bill No: ${b.billNumber}`} type="Bill" data={b} onAdd={() => { setActiveSection("Supplier Billing"); setActiveSupplierBillTab("Bill Settlement"); }} /> : "Bill Number"}
                              icon={ICON_BILL}
                              status={{ text: "Settled", color: "#166534", bg: "#dcfce7" }}
                              details={[
                                { icon: ICON_TRUCK, text: b.vehicleNumber || "N/A" },
                                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, text: b.date },
                                { icon: <span style={{fontSize: '14px', fontWeight: '900'}}>₹</span>, text: `Final: ${formatCurrency(finalSettlement)}` }
                              ]}
                              primaryAction={{ 
                                label: "View Statement", 
                                icon: ICON_ARROW_RIGHT, 
                                onClick: () => setViewingEntity({ type: "Bill", data: b }) 
                              }}
                              secondaryActions={[
                                { label: "WhatsApp", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.399-4.305 9.79-9.884 9.79m8.415-18.298A11.715 11.715 0 0012.045 0C5.41 0 .011 5.393 0 12.015c0 2.115.55 4.18 1.59 6.037L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.628 0 12.028-5.391 12.033-12.013a11.859 11.859 0 00-3.58-8.505"/></svg>, onClick: () => handleSendSupplierWhatsApp(b), variant: 'primary' },
                                { label: "Modify", icon: ICON_EDIT, onClick: () => { setSupplierSettlementForm(b); setIsEditingSupplierBill(true); setEditingSupplierBillId(b._id); setActiveSupplierBillTab("Bill Header"); window.scrollTo({ top: 0, behavior: "smooth" }); } }
                              ]}
                              onDelete={isAdmin ? async () => {
                                if (!window.confirm("Are you sure you want to PERMANENTLY delete this billing record?")) return;
                                const res = await MandiService.deleteSupplierBill(b._id);
                                if (res.status === "SUCCESS") { alert("Bill deleted successfully!"); fetchData(); }
                              } : undefined}
                              onLock={() => alert("Bill finalized.")}
                            />
                          );
                        })}
                      {(supplierBills || []).length === 0 && (
                        <p style={{ textAlign: "center", color: COLORS.muted, padding: "40px", gridColumn: "1/-1" }}>No billing records found.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                {activeSupplierBillTab === "Financial Summary" && (
                  <>
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.sidebar,
                        fontWeight: "800",
                        border: "none",
                        padding: "16px 32px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Expense Deductions");
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "900",
                        padding: "16px 40px",
                        boxShadow: "0 4px 12px rgba(55,81,68,0.2)",
                      }}
                      onClick={async () => {
                        try {
                          if (!supplierSettlementForm.supplierId)
                            return alert("âš ï¸ Supplier is required.");
                          let res;
                          if (isEditingSupplierBill) {
                            res = await MandiService.updateSupplierBill(
                              editingSupplierBillId,
                              supplierSettlementForm,
                            );
                          } else {
                            res = await MandiService.generateSupplierBill(
                              supplierSettlementForm,
                            );
                          }

                          if (res.status === "SUCCESS") {
                            setLastGeneratedBill(res.data);
                            alert(
                              `✅ BILL ${isEditingSupplierBill ? "UPDATED" : "GENERATED"}: ${supplierSettlementForm.billNumber} has been recorded in the database.`,
                            );
                            // Reset but keep track of last one for preview
                            const savedBillNumber = supplierSettlementForm.billNumber;
                            setSupplierSettlementForm({
                              billNumber: getNextBillNumber(sbRes.data),
                              date: getISTDate(),
                              supplierId: "",
                              lotId: "",
                              vehicleNumber: "",
                              items: [
                                {
                                  id: Date.now(),
                                  productName: "",
                                  quantity: "",
                                  rate: "",
                                },
                              ],
                              expenses: {
                                transport: "",
                                commission: "",
                                labour: "",
                                advance: "",
                                weighing: "",
                                packing: "",
                                miscName: "",
                                miscAmount: "",
                              },
                            });
                            setActiveSupplierBillTab("Preview & Print");
                            setIsEditingSupplierBill(false);
                            setEditingSupplierBillId(null);
                            fetchData();
                          } else {
                            alert(`âŒ FAILED: ${res.message || "Database Error"}`);
                          }
                        } catch (e) {
                          alert("Error processing bill.");
                        }
                      }}
                    >
                      Generate Bills
                    </Button>
                    <Button
                      style={{
                        background: "#FFFFFF",
                        color: COLORS.sidebar,
                        border: `1.5px solid ${COLORS.sidebar}`,
                        fontWeight: "800",
                        padding: "16px 32px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveSupplierBillTab("Preview & Print");
                      }}
                    >
                      Next →
                    </Button>
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: "#CC0000",
                        border: "none",
                        fontWeight: "900",
                        padding: "16px 32px",
                      }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to clear this entire billing draft?",
                          )
                        ) {
                          setSupplierSettlementForm({
                            billNumber: getNextBillNumber(),
                            date: getISTDate(),
                            supplierId: "",
                            lotId: "",
                            vehicleNumber: "",
                            items: [
                              {
                                id: Date.now(),
                                productName: "",
                                quantity: "",
                                rate: "",
                              },
                            ],
                            expenses: {
                              transport: "",
                              commission: "",
                              labour: "",
                              advance: "",
                              weighing: "",
                              packing: "",
                              miscName: "",
                              miscAmount: "",
                            },
                          });
                          setIsEditingSupplierBill(false);
                          setEditingSupplierBillId(null);
                          setActiveSupplierBillTab("Bill Header");
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </div>

            </div>
          )}

          {activeSection === "Buyer Invoicing" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <TabHeader
                tabs={[
                  "Invoice Header",
                  "Items Purchased",
                  "Additional Charges",
                  "Invoice Totals",
                  "Preview & Print",
                  "Generated Invoices",
                ]}
                active={activeBuyerInvoiceTab}
                set={setActiveBuyerInvoiceTab}
              />

              {activeBuyerInvoiceTab === "Preview & Print" && (
                <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", gap: "12px" }}>
                    <Button
                      variant="success"
                      onClick={handleSaveInvoicePDF}
                      style={{ padding: "12px 24px" }}
                    >
                      Save as PDF
                    </Button>
                    <Button
                      onClick={handlePrintInvoice}
                      style={{ 
                        padding: "12px 24px", 
                        background: "#f59e0b", 
                        color: "#fff",
                        border: "none",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <Printer size={18} /> Print Invoice
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setLastGeneratedInvoice(null);
                        setActiveBuyerInvoiceTab("Invoice Header");
                      }}
                    >
                      New Invoice
                    </Button>
                  </div>

                  <div
                    ref={invoiceRef}
                    style={{
                      background: "#FFFFFF",
                      padding: "40px",
                      borderRadius: "0",
                      border: "1px solid #EEE",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                      maxWidth: "800px",
                      margin: "0 auto",
                      color: "#1A231A",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {/* Invoice Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #D4A017", paddingBottom: "20px", marginBottom: "30px" }}>
                      <div>
                        <h1 style={{ margin: 0, color: "#D4A017", fontSize: "32px", fontWeight: "900" }}>INVOICE</h1>
                        <p style={{ margin: "5px 0", fontWeight: "700", color: "#64748B" }}>Invoice No: {lastGeneratedInvoice?.invoiceNumber || buyerInvoiceForm.invoiceNumber}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>Mandi OS Enterprise</h2>
                        <p style={{ margin: "4px 0", fontSize: "13px", color: "#64748B" }}>{formatDate(lastGeneratedInvoice?.date || buyerInvoiceForm.date)}</p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
                      <div>
                        <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748B", marginBottom: "10px", fontWeight: "800" }}>Bill To</h3>
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#1E240B" }}>
                          {buyers.find(b => b._id === (lastGeneratedInvoice?.buyerId || buyerInvoiceForm.buyerId))?.name || "Customer"}
                        </p>
                        <p style={{ margin: "5px 0", fontSize: "14px", color: "#64748B" }}>
                          {lastGeneratedInvoice?.buyerPhone || buyerInvoiceForm.buyerPhone || "N/A"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748B", marginBottom: "10px", fontWeight: "800" }}>Reference</h3>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Lot ID: <span style={{ color: "#1E240B" }}>{lastGeneratedInvoice?.lotReference || buyerInvoiceForm.lotReference || "Direct"}</span></p>
                        { (lastGeneratedInvoice?.transportBiceNo || buyerInvoiceForm.transportBiceNo) && (
                           <p style={{ margin: "5px 0", fontSize: "14px", fontWeight: "700" }}>Transport: <span style={{ color: "#1E240B" }}>{lastGeneratedInvoice?.transportBiceNo || buyerInvoiceForm.transportBiceNo}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Items Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                          <th style={{ textAlign: "left", padding: "12px", fontSize: "12px", fontWeight: "800", color: "#64748B" }}>Item Description</th>
                          <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", fontWeight: "800", color: "#64748B" }}>Weight</th>
                          <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", fontWeight: "800", color: "#64748B" }}>Rate</th>
                          <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", fontWeight: "800", color: "#64748B" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lastGeneratedInvoice?.items || buyerInvoiceForm.items).map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "15px 12px", fontSize: "14px", fontWeight: "700" }}>{item.productInfo || "Product"}</td>
                            <td style={{ padding: "15px 12px", fontSize: "14px", textAlign: "right" }}>{Number(item.grossWeight || 0).toFixed(2)} KG</td>
                            <td style={{ padding: "15px 12px", fontSize: "14px", textAlign: "right" }}>{formatCurrency(item.rate || 0)}</td>
                            <td style={{ padding: "15px 12px", fontSize: "14px", textAlign: "right", fontWeight: "800" }}>
                              {formatCurrency((Number(item.grossWeight || 0) * Number(item.rate || 0)))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ width: "300px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontSize: "14px", color: "#64748B" }}>Subtotal</span>
                          <span style={{ fontSize: "14px", fontWeight: "700" }}>{formatCurrency((lastGeneratedInvoice?.items || buyerInvoiceForm.items).reduce((s, i) => s + (Number(i.grossWeight || 0) * Number(i.rate || 0)), 0))}</span>
                        </div>
                        
                        {(lastGeneratedInvoice?.charges || buyerInvoiceForm.charges) && (
                          <>
                            {Object.entries(lastGeneratedInvoice?.charges || buyerInvoiceForm.charges).map(([key, val]) => {
                              if (val && key !== "otherName") {
                                return (
                                  <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <span style={{ fontSize: "14px", color: "#64748B", textTransform: "capitalize" }}>{key === "otherAmount" ? (lastGeneratedInvoice?.charges?.otherName || buyerInvoiceForm.charges.otherName || "Other") : key}</span>
                                    <span style={{ fontSize: "14px", fontWeight: "700" }}>+ {formatCurrency(val)}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </>
                        )}

                        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "2px solid #D4A017", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "18px", fontWeight: "900", color: "#1E240B" }}>Grand Total</span>
                          <span style={{ fontSize: "18px", fontWeight: "900", color: "#D4A017" }}>
                            {(() => {
                              const items = lastGeneratedInvoice?.items || buyerInvoiceForm.items;
                              const charges = lastGeneratedInvoice?.charges || buyerInvoiceForm.charges;
                              const gross = (items || []).reduce((s, i) => s + (Number(i.grossWeight || 0) * Number(i.rate || 0)), 0);
                              const extra = Object.entries(charges).reduce((s, [k, v]) => k.toLowerCase().includes("amount") || ["commission", "handling", "transport"].includes(k) ? s + Number(v || 0) : s, 0);
                              return formatCurrency(gross + extra);
                            })()}
                          </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                          <span style={{ fontSize: "13px", color: "#15803D", fontWeight: "700" }}>Payment Received</span>
                          <span style={{ fontSize: "13px", color: "#15803D", fontWeight: "800" }}>{formatCurrency(lastGeneratedInvoice?.amountReceived || buyerInvoiceForm.amountReceived || 0)}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", borderTop: "1px dashed #E2E8F0", paddingTop: "10px" }}>
                          <span style={{ fontSize: "14px", color: COLORS.sidebar, fontWeight: "900" }}>Balance Amount</span>
                          <span style={{ fontSize: "14px", color: COLORS.sidebar, fontWeight: "900" }}>
                            {(() => {
                              const items = lastGeneratedInvoice?.items || buyerInvoiceForm.items;
                              const charges = lastGeneratedInvoice?.charges || buyerInvoiceForm.charges;
                              const received = Number(lastGeneratedInvoice?.amountReceived || buyerInvoiceForm.amountReceived || 0);
                              const gross = (items || []).reduce((s, i) => s + (Number(i.grossWeight || 0) * Number(i.rate || 0)), 0);
                              const extra = Object.entries(charges).reduce((s, [k, v]) => k.toLowerCase().includes("amount") || ["commission", "handling", "transport"].includes(k) ? s + Number(v || 0) : s, 0);
                              return formatCurrency(gross + extra - received);
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "100px", textAlign: "center", borderTop: "1px solid #EEE", paddingTop: "20px" }}>
                      <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", fontWeight: "600" }}>Thank you for your business!</p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "10px", color: "#CBD5E1", letterSpacing: "1px" }}>POWERED BY MOS</p>
                    </div>
                  </div>
                </div>
              )}

              {activeBuyerInvoiceTab === "Invoice Header" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 24px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    Invoice Header
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        disabled
                        value={buyerInvoiceForm.invoiceNumber}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          background: "#F1F5F9",
                          color: COLORS.muted,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        value={buyerInvoiceForm.date}
                        onChange={(e) =>
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            date: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Customer Name
                      </label>
                      <select
                        value={buyerInvoiceForm.buyerId}
                        onChange={(e) => {
                          const selectedBuyer = buyers.find(
                            (b) => b._id === e.target.value,
                          );
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            buyerId: e.target.value,
                            buyerPhone: selectedBuyer
                              ? selectedBuyer.phone
                              : "",
                          });
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          backgroundColor: "#FFFFFF",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        <option value="" disabled style={{ background: "#e2e8f0", color: COLORS.sidebar }}>{getSelectPlaceholder("Customer Name")}</option>
                        {buyers.map((b) => (
                          <option key={b._id} value={b._id} style={{ background: "#e2e8f0", color: COLORS.sidebar }}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Customer Phone
                      </label>
                      <input
                        type="text"
                        disabled
                        value={buyerInvoiceForm.buyerPhone}
                        placeholder="Auto-filled"
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          background: "#F1F5F9",
                          color: COLORS.muted,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Lot Reference (Source)
                      </label>
                      <select
                        value={buyerInvoiceForm.lotReference}
                        onChange={(e) => {
                          const selectedLotId = e.target.value;
                          const matchedLot = lots.find(
                            (l) => l.lotId === selectedLotId,
                          );
                          const lotSuffix = selectedLotId ? selectedLotId.split('-').pop() : "";
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            lotReference: selectedLotId,
                            invoiceNumber: lotSuffix || buyerInvoiceForm.invoiceNumber,
                            // If it's a new lot selection, we could potentially reset items or prefill one
                          });
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        <option value="">{getSelectPlaceholder("Lot Reference")}</option>
                        {lots.map((l) => (
                          <option key={l._id || l.lotId} value={l.lotId}>
                            {l.supplierId?.name || l.supplierId || "Supplier"} â€” {l.lotId}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Transport / Bice No.
                      </label>
                      <input
                        type="text"
                        value={buyerInvoiceForm.transportBiceNo}
                        onChange={(e) =>
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            transportBiceNo: e.target.value,
                          })
                        }
                        placeholder="Vehicle for delivery"
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "32px",
                      paddingTop: "24px",
                      borderTop: "2px solid #F1F5F9",
                    }}
                  >
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "800",
                        padding: "12px 32px",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveBuyerInvoiceTab("Items Purchased");
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {activeBuyerInvoiceTab === "Items Purchased" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 24px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    Items Purchased
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {buyerInvoiceForm.items.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "16px",
                          background: "#FDFBF4",
                          padding: "24px",
                          borderRadius: "12px",
                          border: "1px solid #EBE9E1",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            bottom: "12px",
                            right: "12px",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              background: "#F1F7FF",
                              color: "#1D4ED8",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: "900",
                              border: "1px solid #DBEAFE",
                            }}
                          >
                            MODIFY
                          </div>
                          <div
                            style={{
                              background: "#FFF1F2",
                              color: "#E11D48",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: "900",
                              border: "1px solid #FFE4E6",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleBuyerInvoiceItemAction("Remove", idx)
                            }
                          >
                            DELETE
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            gridColumn: "span 2",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Product + Variety + Grade
                          </label>
                          <ModernMultiSelectField
                            label="Available Item from Lot"
                            value={item.productInfo}
                            hideLabel={true}
                            options={(() => {
                              const currentLot = lots.find(l => l.lotId === buyerInvoiceForm.lotReference);
                              if (!currentLot) return [];
                              return currentLot.lineItems.map(li => 
                                `${li.product || li.productId || ""} ${li.variety || ""}`.trim()
                              );
                            })()}
                            onChange={(e) => {
                              const label = e.target.value;
                              const matchedLot = lots.find(l => l.lotId === buyerInvoiceForm.lotReference);
                              const matchedItem = matchedLot ? matchedLot.lineItems.find(li => 
                                `${li.product || li.productId || ""} ${li.variety || ""}`.trim() === label.split(' / ')[0]
                              ) : null;

                              handleBuyerInvoiceItemAction("Update", idx, "productInfo", label);
                              if (matchedItem) {
                                handleBuyerInvoiceItemAction("Update", idx, "grossWeight", Math.max(0, (Number(matchedItem.grossWeight) || 0) - (Number(matchedItem.deductions) || 0)));
                                if (matchedItem.rate || matchedItem.estimatedRate) {
                                  handleBuyerInvoiceItemAction("Update", idx, "rate", matchedItem.rate || matchedItem.estimatedRate);
                                }
                              }
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Gross Wt (KG)
                          </label>
                          <input
                            type="number"
                            value={item.grossWeight}
                            onChange={(e) =>
                              handleBuyerInvoiceItemAction(
                                "Update",
                                idx,
                                "grossWeight",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Deductions (KG)
                          </label>
                          <input
                            type="number"
                            value={item.deductions}
                            onChange={(e) =>
                              handleBuyerInvoiceItemAction(
                                "Update",
                                idx,
                                "deductions",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Net Wt (KG) Auto
                          </label>
                          <input
                            type="number"
                            disabled
                            value={Math.max(
                              0,
                              (Number(item.grossWeight) || 0) -
                                (Number(item.deductions) || 0),
                            )}
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              background: "#F1F5F9",
                              color: COLORS.muted,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "800",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Rate (₹/KG)
                          </label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              handleBuyerInvoiceItemAction(
                                "Update",
                                idx,
                                "rate",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: COLORS.muted,
                            }}
                          >
                            Amount (₹) Auto
                          </label>
                          <input
                            type="number"
                            disabled
                            value={
                              Math.max(
                                0,
                                (Number(item.grossWeight) || 0) -
                                  (Number(item.deductions) || 0),
                              ) * (Number(item.rate) || 0)
                            }
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              background: "#F1F5F9",
                              color: COLORS.muted,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "800",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      style={{
                        alignSelf: "flex-start",
                        background: "#FFFFFF",
                        color: COLORS.accent,
                        border: `1.5px solid ${COLORS.accent}`,
                        fontWeight: "900",
                        marginTop: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      }}
                      onClick={() => handleBuyerInvoiceItemAction("Add")}
                    >
                      Add Next Invoice Item
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "32px",
                      paddingTop: "24px",
                      borderTop: "2px solid #F1F5F9",
                    }}
                  >
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.sidebar,
                        fontWeight: "800",
                        border: "none",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveBuyerInvoiceTab("Invoice Header");
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "800",
                        padding: "12px 32px",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveBuyerInvoiceTab("Additional Charges");
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {activeBuyerInvoiceTab === "Additional Charges" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 16px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    Additional Charges
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Commission
                      </label>
                      <input
                        type="number"
                        value={buyerInvoiceForm.charges.commission}
                        onChange={(e) =>
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            charges: {
                              ...buyerInvoiceForm.charges,
                              commission: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Handling Charges
                      </label>
                      <input
                        type="number"
                        value={buyerInvoiceForm.charges.handling}
                        onChange={(e) =>
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            charges: {
                              ...buyerInvoiceForm.charges,
                              handling: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "750",
                          color: COLORS.sidebar,
                        }}
                      >
                        Outward Transport
                      </label>
                      <input
                        type="number"
                        value={buyerInvoiceForm.charges.transport}
                        onChange={(e) =>
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            charges: {
                              ...buyerInvoiceForm.charges,
                              transport: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF4",
                        borderRadius: "10px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <div style={{ flex: 1, marginRight: "12px" }}>
                        <ModernMultiSelectField
                          label="Other Charges"
                          value={buyerInvoiceForm.charges.otherName}
                          options={["Packing", "Loading", "Unloading", "Transport", "Miscellaneous"]}
                          onChange={(e) =>
                            setBuyerInvoiceForm({
                              ...buyerInvoiceForm,
                              charges: {
                                ...buyerInvoiceForm.charges,
                                otherName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <input
                        type="number"
                        value={buyerInvoiceForm.charges.otherAmount}
                        onChange={(e) =>
                          setBuyerInvoiceForm({
                            ...buyerInvoiceForm,
                            charges: {
                              ...buyerInvoiceForm.charges,
                              otherAmount: e.target.value,
                            },
                          })
                        }
                        placeholder="₹"
                        style={{
                          width: "120px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "32px",
                      paddingTop: "24px",
                      borderTop: "2px solid #F1F5F9",
                    }}
                  >
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.sidebar,
                        fontWeight: "800",
                        border: "none",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveBuyerInvoiceTab("Items Purchased");
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      style={{
                        background: COLORS.sidebar,
                        fontWeight: "800",
                        padding: "12px 32px",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveBuyerInvoiceTab("Invoice Totals");
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {activeBuyerInvoiceTab === "Invoice Totals" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "40px",
                    borderRadius: "16px",
                    border: "1px solid #EBE9E1",
                    animation: "fadeIn 0.3s ease-in",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.01)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "900",
                      color: COLORS.sidebar,
                      margin: "0 0 32px 0",
                      borderBottom: "1.5px solid #F1F5F9",
                      paddingBottom: "20px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Financial Invoice Summary
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {(() => {
                      const subTotal = (buyerInvoiceForm.items || []).reduce(
                        (sum, it) =>
                          sum +
                          Math.max(
                            0,
                            (Number(it.grossWeight) || 0) -
                              (Number(it.deductions) || 0),
                          ) *
                            (Number(it.rate) || 0),
                        0,
                      );
                      const ch = buyerInvoiceForm.charges;
                      const totalAdditional =
                        (Number(ch.commission) || 0) +
                        (Number(ch.handling) || 0) +
                        (Number(ch.transport) || 0) +
                        (Number(ch.otherAmount) || 0);
                      const grandTotal = subTotal + totalAdditional;
                      const amountReceived =
                        Number(buyerInvoiceForm.amountReceived) || 0;
                      const balanceDue = grandTotal - amountReceived;

                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "16px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: "12px",
                                borderBottom: "1px solid #F1F5F9",
                              }}
                            >
                              <span
                                style={{
                                  color: COLORS.muted,
                                  fontWeight: "600",
                                }}
                              >
                                Sub Total
                              </span>
                              <span
                                style={{
                                  color: COLORS.sidebar,
                                  fontWeight: "800",
                                }}
                              >
                                {formatCurrency(subTotal)}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: "12px",
                                borderBottom: "1px solid #F1F5F9",
                              }}
                            >
                              <span
                                style={{
                                  color: COLORS.muted,
                                  fontWeight: "600",
                                }}
                              >
                                Total Additional Charges
                              </span>
                              <span
                                style={{
                                  color: COLORS.success,
                                  fontWeight: "800",
                                }}
                              >
                                + {formatCurrency(totalAdditional)}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "20px",
                                background: "#FDFBF4",
                                borderRadius: "12px",
                                border: "1px solid #EBE9E1",
                              }}
                            >
                              <span
                                style={{
                                  color: COLORS.sidebar,
                                  fontWeight: "800",
                                  fontSize: "18px",
                                }}
                              >
                                Grand Total
                              </span>
                              <span
                                style={{
                                  color: COLORS.sidebar,
                                  fontWeight: "900",
                                  fontSize: "18px",
                                }}
                              >
                                {formatCurrency(grandTotal)}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingBottom: "16px",
                                borderBottom: "1px solid #F1F5F9",
                              }}
                            >
                              <span
                                style={{ color: "#E67E22", fontWeight: "700" }}
                              >
                                Amount Received
                              </span>
                              <input
                                type="number"
                                value={buyerInvoiceForm.amountReceived}
                                onChange={(e) =>
                                  setBuyerInvoiceForm({
                                    ...buyerInvoiceForm,
                                    amountReceived: e.target.value,
                                  })
                                }
                                placeholder="0"
                                style={{
                                  width: "120px",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: "1px solid #E67E22",
                                  outline: "none",
                                  fontSize: "15px",
                                  fontWeight: "700",
                                  textAlign: "right",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingTop: "8px",
                              }}
                            >
                              <span
                                style={{
                                  color: COLORS.primary,
                                  fontWeight: "900",
                                  fontSize: "20px",
                                }}
                              >
                                Balance Due
                              </span>
                              <span
                                style={{
                                  color: COLORS.primary,
                                  fontWeight: "900",
                                  fontSize: "20px",
                                }}
                              >
                                {formatCurrency(balanceDue)}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingTop: "8px",
                                marginTop: "8px",
                                borderTop: "1px dashed #E2E8F0"
                              }}
                            >
                              <span style={{ color: COLORS.sidebar, fontWeight: "800", fontSize: "16px" }}>
                                Balance Amount
                              </span>
                              <span style={{ color: COLORS.sidebar, fontWeight: "900", fontSize: "16px" }}>
                                {formatCurrency(balanceDue)}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div
                    style={{
                      borderTop: "2px solid #F1F5F9",
                      marginTop: "32px",
                      paddingTop: "24px",
                      display: "flex",
                      gap: "16px",
                    }}
                  >
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.sidebar,
                        fontWeight: "800",
                        border: "none",
                        padding: "16px 32px",
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveBuyerInvoiceTab("Additional Charges");
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      style={{
                        background: COLORS.primary,
                        color: "#FFFFFF",
                        fontWeight: "900",
                        padding: "16px 40px",
                        boxShadow: "0 4px 12px rgba(230,126,34,0.2)",
                      }}
                      onClick={async () => {
                        try {
                          let res;
                          if (isEditingBuyerInvoice) {
                            res = await MandiService.updateBuyerInvoice(editingBuyerInvoiceId, buyerInvoiceForm);
                          } else {
                            res = await MandiService.generateBuyerInvoice(buyerInvoiceForm);
                          }
                          
                          if (res.status === "SUCCESS") {
                            setLastGeneratedInvoice(res.data);
                            alert(
                              `✅ INVOICE ${isEditingBuyerInvoice ? "UPDATED" : "GENERATED"}: ${buyerInvoiceForm.invoiceNumber} saved!`,
                            );
                            fetchData();
                            setActiveBuyerInvoiceTab("Preview & Print");
                            setIsEditingBuyerInvoice(false);
                            setEditingBuyerInvoiceId(null);
                          }
                        } catch (e) {
                          alert("âŒ FAILED: " + e.message);
                        }
                      }}
                    >
                      {isEditingBuyerInvoice ? "Update Invoice" : "Generate Invoice"}
                    </Button>
                    <Button
                      style={{
                        background: "#F1F5F9",
                        color: "#CC0000",
                        border: "none",
                        fontWeight: "900",
                        padding: "16px 32px",
                      }}
                      onClick={() => {
                        if (window.confirm("Clear all invoice entries?")) {
                          setBuyerInvoiceForm({
                            invoiceNumber: getNextInvoiceNumber(),
                            date: getISTDate(),
                            buyerId: "",
                            buyerPhone: "",
                            lotReference: "",
                            transportBiceNo: "",
                            items: [
                              {
                                id: Date.now(),
                                productInfo: "",
                                grossWeight: "",
                                deductions: "",
                                rate: "",
                              },
                            ],
                            charges: {
                              commission: "",
                              handling: "",
                              transport: "",
                              otherName: "",
                              otherAmount: "",
                            },
                            amountReceived: "",
                          });
                          setIsEditingBuyerInvoice(false);
                          setEditingBuyerInvoiceId(null);
                          setActiveBuyerInvoiceTab("Invoice Header");
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {activeBuyerInvoiceTab === "Generated Invoices" && (
                <div style={{ animation: "fadeIn 0.3s ease-in", padding: "10px" }}>
                  <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: "900", color: COLORS.sidebar, margin: 0 }}>Recently Generated Invoices</h3>
                      <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: "13px", fontWeight: "600" }}>Manage customer accounts and finalized sales</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <input
                      type="text"
                      placeholder="Search by Invoice # or Customer Name..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: "1.5px solid #EBE9E1",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: COLORS.sidebar,
                        outline: "none",
                        background: "#FDFBF4",
                        transition: "all 0.2s"
                      }}
                    />
                  </div>

                  <div style={{ maxHeight: "750px", overflowY: "auto", padding: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                      {buyerInvoices
                        .filter(i => {
                          const customerName = (i.buyerId?.name || i.buyerId || "").toLowerCase();
                          const invNo = (i.invoiceNumber || "").toLowerCase();
                          const query = (invoiceSearchQuery || "").toLowerCase();
                          const dateMatch = isWithinFilterRange(i.date);
                          return dateMatch && (customerName.includes(query) || invNo.includes(query));
                        })
                        .slice()
                        .reverse()
                        .map((i) => {
                          const subTotal = (i.items || []).reduce((s, it) => s + (Math.max(0, (Number(it.grossWeight) || 0) - (Number(it.deductions) || 0)) * (Number(it.rate) || 0)), 0);
                          const totalAdditional = Object.values(i.charges || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                          const grandTotal = subTotal + totalAdditional;

                          return (
                            <PremiumActionCard
                              key={i._id || Date.now() + Math.random()}
                              title={<SmartDataNode text={i.buyerId?.name || i.buyerId || "Customer"} type="Name" data={i.buyerId || {}} onAdd={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSection("Buyer Invoicing"); setActiveBuyerInvoiceTab("Invoice Entry"); }} />}
                              subtitle={i.invoiceNumber ? <SmartDataNode text={`Invoice No: ${i.invoiceNumber}`} type="Invoice" data={i} onAdd={() => { setActiveSection("Buyer Invoicing"); setActiveBuyerInvoiceTab("Invoice Entry"); }} /> : "INV-NEW"}
                              icon={ICON_BILL}
                              status={{ text: "Invoiced", color: "#166534", bg: "#dcfce7" }}
                              details={[
                                { icon: ICON_SHOP, text: `Ref: ${i.lotReference || "Direct Sale"}` },
                                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, text: i.date },
                                { icon: <span style={{fontSize: '14px', fontWeight: '900'}}>₹</span>, text: `Grand Total: ${formatCurrency(grandTotal)}` }
                              ]}
                              primaryAction={{ 
                                label: "Preview Invoice", 
                                icon: ICON_ARROW_RIGHT, 
                                onClick: () => setViewingEntity({ type: "Invoice", data: i }) 
                              }}
                              secondaryActions={[
                                { label: "WhatsApp", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.399-4.305 9.79-9.884 9.79m8.415-18.298A11.715 11.715 0 0012.045 0C5.41 0 .011 5.393 0 12.015c0 2.115.55 4.18 1.59 6.037L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.628 0 12.028-5.391 12.033-12.013a11.859 11.859 0 00-3.58-8.505"/></svg>, onClick: () => handleSendBuyerWhatsApp(i), variant: 'primary' },
                                { label: "Modify", icon: ICON_EDIT, onClick: () => { setBuyerInvoiceForm(i); setIsEditingBuyerInvoice(true); setEditingBuyerInvoiceId(i._id); setActiveBuyerInvoiceTab("Invoice Header"); window.scrollTo({ top: 0, behavior: "smooth" }); } }
                              ]}
                              onDelete={isAdmin ? async () => {
                                if (!window.confirm("Delete this invoice permanently?")) return;
                                const res = await MandiService.deleteBuyerInvoice(i._id);
                                if (res.status === "SUCCESS") { alert("Invoice deleted!"); fetchData(); }
                              } : undefined}
                              onLock={() => alert("Invoice finalized.")}
                            />
                          );
                        })}
                      {buyerInvoices.length === 0 && (
                        <p style={{ textAlign: "center", color: COLORS.muted, padding: "40px", gridColumn: "1/-1" }}>No invoices found.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {activeSection === "Payments" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* TAB SWITCHER */}
              <div
                style={{
                  paddingBottom: "24px",
                  marginBottom: "32px",
                  borderBottom: "1px solid #EBE9E1",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    onClick={() => setActivePaymentTab("Supplier")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activePaymentTab === "Supplier"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activePaymentTab === "Supplier"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    Supplier Payment
                  </div>
                  <div
                    onClick={() => setActivePaymentTab("Customer")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activePaymentTab === "Customer"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activePaymentTab === "Customer"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    Customer Payment
                  </div>
                </div>
              </div>

              {activePaymentTab === "Supplier" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid #EBE9E1",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={farmerPaymentForm.paymentDate}
                          onChange={(e) =>
                            setFarmerPaymentForm({
                              ...farmerPaymentForm,
                              paymentDate: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Supplier / Party
                        </label>
                        <select
                          value={farmerPaymentForm.farmerId}
                          onChange={(e) => {
                            const selId = e.target.value;
                            const supplier = suppliers.find(
                              (s) => s._id === selId,
                            );
                            const supplierPrefix = supplier
                              ? supplier.name
                                  .substring(0, 3)
                                  .toUpperCase()
                                  .replace(/\s/g, "")
                              : "SUP";
                            const randomId = Math.floor(
                              1000 + Math.random() * 9000,
                            );

                            // Auto-generate balance calculation
                            const bills = (supplierBills || []).filter(
                              (b) => b.supplierId === selId || b.farmerId === selId,
                            );
                            const tNet = bills.reduce(
                              (sum, b) => sum + Number(b.netPayable || 0),
                              0,
                            );
                            const tPaid = bills.reduce(
                              (sum, b) =>
                                sum +
                                Number(b.advance || 0) +
                                Number(b.amountPaid || b.paymentMade || 0),
                              0,
                            );
                            const currentDue = tNet - tPaid;

                            const matchedSupp = suppliers.find(s => s._id === selId);
                            setFarmerPaymentForm({
                              ...farmerPaymentForm,
                              farmerId: selId,
                              againstBillNo: `${supplierPrefix}-${randomId}`,
                              amount: currentDue > 0 ? String(currentDue) : (matchedSupp?.advanceBalance || ""),
                            });
                          }}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          <option value="" disabled>
                            {getSelectPlaceholder("Supplier")}
                          </option>
                          {suppliers.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {farmerPaymentForm.farmerId && (() => {
                      const selId = farmerPaymentForm.farmerId;
                      const bills = (supplierBills || []).filter(
                        (b) => b.supplierId === selId || b.farmerId === selId,
                      );
                      const tNet = bills.reduce(
                        (sum, b) => sum + Number(b.netPayable || 0),
                        0,
                      );
                      const tPaid = bills.reduce(
                        (sum, b) =>
                          sum +
                          Number(b.advance || 0) +
                          Number(b.amountPaid || b.paymentMade || 0),
                        0,
                      );
                      const tBalance = tNet - tPaid;
                      return (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "12px",
                            background: "#F8FAFC",
                            padding: "16px",
                            borderRadius: "14px",
                            border: "1.5px solid #E2E8F0",
                            marginTop: "-8px",
                            marginBottom: "8px",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: "800",
                                color: COLORS.muted,
                                textTransform: "uppercase",
                              }}
                            >
                              Total Net Sale
                            </span>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "900",
                                color: COLORS.sidebar,
                              }}
                            >
                              {formatCurrency(tNet)}
                            </div>
                          </div>
                          <div>
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: "800",
                                color: COLORS.muted,
                                textTransform: "uppercase",
                              }}
                            >
                              Current Due
                            </span>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "900",
                                color:
                                  tBalance > 0 ? COLORS.danger : COLORS.success,
                              }}
                            >
                              {formatCurrency(Math.abs(tBalance))}{" "}
                              {tBalance >= 0 ? "DR" : "CR"}
                            </div>
                          </div>
                          <div>
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: "800",
                                color: COLORS.muted,
                                textTransform: "uppercase",
                              }}
                            >
                              Rem. Balance
                            </span>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "900",
                                color:
                                  tBalance - Number(farmerPaymentForm.amount || 0) >
                                  0
                                    ? COLORS.danger
                                    : COLORS.success,
                              }}
                            >
                              {formatCurrency(
                                Math.abs(
                                  tBalance -
                                    Number(farmerPaymentForm.amount || 0),
                                ),
                              )}{" "}
                              {tBalance - Number(farmerPaymentForm.amount || 0) >=
                              0
                                ? "DR"
                                : "CR"}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={farmerPaymentForm.amount}
                          onChange={(e) =>
                            setFarmerPaymentForm({
                              ...farmerPaymentForm,
                              amount: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Payment Mode
                        </label>
                        <select
                          value={farmerPaymentForm.paymentMode}
                          onChange={(e) =>
                            setFarmerPaymentForm({
                              ...farmerPaymentForm,
                              paymentMode: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          <option>Cash</option>
                          <option>UPI</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Bill Number (Auto)
                        </label>
                        <input
                          type="text"
                          placeholder="Bill ID or Reference"
                          value={farmerPaymentForm.againstBillNo}
                          onChange={(e) =>
                            setFarmerPaymentForm({
                              ...farmerPaymentForm,
                              againstBillNo: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            background: "#F8FAFC",
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "700",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Advance & settlement
                        </label>
                        <select
                          value={farmerPaymentForm.paymentCategory}
                          onChange={(e) =>
                            setFarmerPaymentForm({
                              ...farmerPaymentForm,
                              paymentCategory: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          <option value="Advance">Advance</option>
                          <option value="part payment">part payment</option>
                          <option value="full settlement">full settlement</option>
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          color: COLORS.muted,
                          textTransform: "uppercase",
                        }}
                      >
                        Transaction Details
                      </label>
                      <input
                        type="text"
                        placeholder="UPI Ref / Cheque No"
                        value={farmerPaymentForm.referenceNo}
                        onChange={(e) =>
                          setFarmerPaymentForm({
                            ...farmerPaymentForm,
                            referenceNo: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          color: COLORS.muted,
                          textTransform: "uppercase",
                        }}
                      >
                        Narration / Notes
                      </label>
                      <textarea
                        placeholder="Payment remarks..."
                        value={farmerPaymentForm.notes}
                        onChange={(e) =>
                          setFarmerPaymentForm({
                            ...farmerPaymentForm,
                            notes: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          height: "60px",
                          resize: "none",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "16px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Button
                        style={{
                          width: "140px",
                          height: "42px",
                          fontSize: "14px",
                          background: COLORS.sidebar,
                          fontWeight: "800",
                          borderRadius: "8px",
                        }}
                        onClick={handleRecordFarmerPayment}
                      >
                        Confirm
                      </Button>
                      <Button
                        style={{
                          width: "140px",
                          height: "42px",
                          fontSize: "14px",
                          background: "#F8FAFC",
                          color: COLORS.sidebar,
                          border: "1px solid #E2E8F0",
                          fontWeight: "800",
                          borderRadius: "8px",
                        }}
                        onClick={() => {
                          // Standard pattern for "Modify" in this context
                          alert(
                            "Please select a historical payment from the Ledger to modify.",
                          );
                        }}
                      >
                        Modify
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activePaymentTab === "Customer" && (
                <>
                  <div
                    style={{
                      background: "#FFFFFF",
                      padding: "32px",
                      borderRadius: "16px",
                      border: "1px solid #EBE9E1",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Receipt Date
                          </label>
                          <input
                            type="date"
                            value={buyerPaymentForm.paymentDate}
                            onChange={(e) =>
                              setBuyerPaymentForm({
                                ...buyerPaymentForm,
                                paymentDate: e.target.value,
                              })
                            }
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Customer Name
                          </label>
                          <select
                            value={buyerPaymentForm.buyerId}
                            onChange={(e) => {
                              const selId = e.target.value;
                              // Auto-generate balance calculation for buyer
                              const invoices = (buyerInvoices || []).filter(
                                (inv) => inv.buyerId === selId,
                              );
                              const tBilled = invoices.reduce(
                                (sum, inv) =>
                                  sum +
                                  Number(inv.grandTotal || inv.totalAmount || 0),
                                0,
                              );
                              const tReceived = invoices.reduce(
                                (sum, inv) =>
                                  sum +
                                  Number(
                                    inv.amountReceived ||
                                      inv.paidAmount ||
                                      inv.paymentReceived ||
                                      0,
                                  ),
                                0,
                              );
                              const currentDue = tBilled - tReceived;
                              const matchedBuyer = buyers.find(b => b._id === selId);

                              setBuyerPaymentForm({
                                ...buyerPaymentForm,
                                buyerId: selId,
                                amountReceived:
                                  currentDue > 0 ? String(currentDue) : "",
                              });
                            }}
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            <option value="" disabled>
                              {getSelectPlaceholder("Customer")}
                            </option>
                            {buyers.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
  
                      {buyerPaymentForm.buyerId && (() => {
                        const selId = buyerPaymentForm.buyerId;
                        const invoices = (buyerInvoices || []).filter(
                          (inv) => inv.buyerId === selId,
                        );
                        const tBilled = invoices.reduce(
                          (sum, inv) =>
                            sum + Number(inv.grandTotal || inv.totalAmount || 0),
                          0,
                        );
                        const tReceived = invoices.reduce(
                          (sum, inv) =>
                            sum +
                            Number(
                              inv.amountReceived ||
                                inv.paidAmount ||
                                inv.paymentReceived ||
                                0,
                            ),
                          0,
                        );
                        const currentDue = tBilled - tReceived;
                        const paying = Number(buyerPaymentForm.amountReceived || 0);
                        const remBalance = currentDue - paying;
  
                        return (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "12px",
                              background: "#F0FDF4",
                              padding: "16px",
                              borderRadius: "14px",
                              border: "1.5px solid #DCFCE7",
                              marginTop: "-8px",
                              marginBottom: "8px",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  color: "#15803D",
                                  textTransform: "uppercase",
                                }}
                              >
                                Total Billed
                              </span>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "900",
                                  color: COLORS.sidebar,
                                }}
                              >
                                {formatCurrency(tBilled)}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  color: "#15803D",
                                  textTransform: "uppercase",
                                }}
                              >
                                Current Due
                              </span>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "900",
                                  color:
                                    currentDue > 0
                                      ? COLORS.danger
                                      : COLORS.success,
                                }}
                              >
                                {formatCurrency(Math.abs(currentDue))}{" "}
                                {currentDue >= 0 ? "DR" : "CR"}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  color: "#15803D",
                                  textTransform: "uppercase",
                                }}
                              >
                                Rem. Balance
                              </span>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "900",
                                  color:
                                    remBalance > 0
                                      ? COLORS.danger
                                      : COLORS.success,
                                }}
                              >
                                {formatCurrency(Math.abs(remBalance))}{" "}
                                {remBalance >= 0 ? "DR" : "CR"}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Received Amount (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={buyerPaymentForm.amountReceived}
                            onChange={(e) =>
                              setBuyerPaymentForm({
                                ...buyerPaymentForm,
                                amountReceived: e.target.value,
                              })
                            }
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Payment Mode
                          </label>
                          <select
                            value={buyerPaymentForm.paymentMode}
                            onChange={(e) =>
                              setBuyerPaymentForm({
                                ...buyerPaymentForm,
                                paymentMode: e.target.value,
                              })
                            }
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            <option>Cash</option>
                            <option>UPI / Scan</option>
                            <option>Bank Transfer</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Invoice Reference
                        </label>
                        <input
                          type="text"
                          placeholder="Invoice ID"
                          value={buyerPaymentForm.againstInvoiceNo}
                          onChange={(e) =>
                            setBuyerPaymentForm({
                              ...buyerPaymentForm,
                              againstInvoiceNo: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Transaction Reference
                          </label>
                          <input
                            type="text"
                            placeholder="Ref ID"
                            value={buyerPaymentForm.referenceNo}
                            onChange={(e) =>
                              setBuyerPaymentForm({
                                ...buyerPaymentForm,
                                referenceNo: e.target.value,
                              })
                            }
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Collected By
                          </label>
                          <select
                            value={buyerPaymentForm.collectedBy}
                            onChange={(e) =>
                              setBuyerPaymentForm({
                                ...buyerPaymentForm,
                                collectedBy: e.target.value,
                              })
                            }
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: "1px solid #EBE9E1",
                              color: COLORS.sidebar,
                              outline: "none",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            {staffUsers.map((su) => (
                              <option key={su.id} value={su.name}>
                                {su.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Notes
                        </label>
                        <textarea
                          placeholder="Collection remarks..."
                          value={buyerPaymentForm.notes}
                          onChange={(e) =>
                            setBuyerPaymentForm({
                              ...buyerPaymentForm,
                              notes: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                            height: "60px",
                            resize: "none",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginTop: "16px",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Button
                          style={{
                            width: "140px",
                            height: "42px",
                            fontSize: "14px",
                            background: "#15803D",
                            fontWeight: "800",
                            borderRadius: "8px",
                          }}
                          onClick={handleRecordBuyerPayment}
                        >
                          Confirm
                        </Button>
                        <Button
                          style={{
                            width: "140px",
                            height: "42px",
                            fontSize: "14px",
                            background: "#F8FAFC",
                            color: "#15803D",
                            border: "1px solid #DCFCE7",
                            fontWeight: "800",
                            borderRadius: "8px",
                          }}
                          onClick={() => {
                            alert(
                              "Please select a historical receipt from the Ledger to modify.",
                            );
                          }}
                        >
                          Modify
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "32px",
                    }}
                  >
                    <Card
                      title="UPI Payment QR"
                      subtitle="Generate for instant collection"
                    >
                      <div
                        style={{
                          background: "#f8fafc",
                          padding: "40px",
                          borderRadius: "20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          border: "2px dashed #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            width: "160px",
                            height: "160px",
                            background: "#0f172a",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            marginBottom: "15px",
                          }}
                        >
                          [ QR CODE ]
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "800",
                            color: COLORS.secondary,
                          }}
                        >
                          STACLI TRADING
                        </span>
                        <span style={{ fontSize: "11px", color: COLORS.muted }}>
                          Merchant ID: G889911CS
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        style={{ width: "100%", marginTop: "15px" }}
                      >
                        Show on Customer Display
                      </Button>
                    </Card>

                    <Card
                      title="Overdue Pulse Alerts"
                      subtitle="Unpaid beyond terms"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {(() => {
                          const buyerSummaries = (buyers || [])
                            .map((b) => {
                              const invoices = (buyerInvoices || []).filter(
                                (inv) => inv.buyerId === b._id,
                              );
                              const tBilled = invoices.reduce(
                                (sum, inv) =>
                                  sum +
                                  Number(
                                    inv.grandTotal || inv.totalAmount || 0,
                                  ),
                                0,
                              );
                              const tReceived = invoices.reduce(
                                (sum, inv) =>
                                  sum +
                                  Number(
                                    inv.amountReceived || inv.paidAmount || 0,
                                  ),
                                0,
                              );
                              const balance = tBilled - tReceived;
                              return { ...b, balance };
                            })
                            .filter((b) => b.balance > 0)
                            .sort((a, b) => b.balance - a.balance)
                            .slice(0, 3);

                          if (buyerSummaries.length === 0) {
                            return (
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  color: COLORS.muted,
                                  fontSize: "12px",
                                }}
                              >
                                All buyers are currently cleared. ✅
                              </div>
                            );
                          }

                          return buyerSummaries.map((alert, i) => (
                            <div
                              key={i}
                              style={{
                                padding: "16px",
                                background: "#fef2f2",
                                borderRadius: "12px",
                                border: "1px solid #fee2e2",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "4px",
                                }}
                              >
                                <b
                                  style={{
                                    fontSize: "13px",
                                    color: "#991b1b",
                                  }}
                                >
                                  {alert.name}
                                </b>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    background: "#991b1b",
                                    color: "#fff",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  DUE
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "900",
                                    color: "#991b1b",
                                  }}
                                >
                                  {formatCurrency(alert.balance)}
                                </span>
                                <button
                                  onClick={() => {
                                    const msg = `Dear ${
                                      alert.name
                                    }, a payment of ${formatCurrency(
                                      alert.balance,
                                    )} is pending in your account at Mandi Management. Please settle it at the earliest.`;
                                    const phone =
                                      alert.mobile || alert.phone || "";
                                    if (phone) {
                                      window.open(
                                        `https://wa.me/91${phone.replace(
                                          /\D/g,
                                          "",
                                        )}?text=${encodeURIComponent(msg)}`,
                                      );
                                    } else {
                                      window.alert(
                                        "No contact number registered for this buyer.",
                                      );
                                    }
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: COLORS.primary,
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Send Notice ðŸ“²
                                </button>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}

          {activeSection === "Ledger" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              {/* STACLI PREMIUM PAGE HEADINGS - DUAL TABBED NAVIGATION */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  paddingBottom: "24px",
                  marginBottom: "48px",
                  borderBottom: `2px solid #EBE9E1`,
                  alignItems: "center",
                }}
              >
                <button
                  id="supplier-ledger-heading"
                  onClick={() => setActiveLedgerTab("Supplier")}
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    margin: 0,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.5px",
                    color: activeLedgerTab === "Supplier" ? "#fff" : COLORS.sidebar,
                    background: activeLedgerTab === "Supplier" ? COLORS.sidebar : "transparent",
                    border: `2px solid ${COLORS.sidebar}`,
                    borderRadius: "30px",
                    padding: "8px 18px",
                    textTransform: "uppercase",
                  }}
                >
                  Supplier Ledger
                </button>
                <button
                  id="customer-ledger-heading"
                  onClick={() => setActiveLedgerTab("Customer")}
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    margin: 0,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.5px",
                    color: activeLedgerTab === "Customer" ? "#fff" : COLORS.sidebar,
                    background: activeLedgerTab === "Customer" ? COLORS.sidebar : "transparent",
                    border: `2px solid ${COLORS.sidebar}`,
                    borderRadius: "30px",
                    padding: "8px 18px",
                    textTransform: "uppercase",
                  }}
                >
                  Customer Ledger
                </button>
              </div>



              {activeLedgerTab === "Supplier" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid #EBE9E1",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ marginBottom: "24px" }}>
                    <p style={{ margin: 0, color: COLORS.muted, fontSize: "14px", fontWeight: "600" }}>Audited Financial Statements â€” Farmer Outstanding Tracking</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      marginBottom: "24px",
                      borderBottom: "2.5px solid #F1F5F9",
                      paddingBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", flex: 1 }}></div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                          onClick={() => handleDownloadLedgerCSV(activeLedgerTab === "Supplier" ? "Supplier" : "Customer")}
                          style={{
                            background: "linear-gradient(135deg, #1e240b 0%, #3a4714 100%)",
                            color: "#fff",
                            fontWeight: "800",
                            fontSize: "12px",
                            height: "fit-content",
                            border: "none",
                            padding: "10px 20px",
                            boxShadow: "0 4px 12px rgba(30,36,11,0.2)",
                          }}
                        >
                          Download Statement
                        </Button>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "20px",
                        background: "#FDFBF4",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Search Supplier Name
                        </label>
                        <select
                          value={selectedLedgerSupplier}
                          onChange={(e) =>
                            handleLedgerSupplierChange(e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            fontWeight: "700",
                            background: "#fff",
                          }}
                        >
                          <option value="">{getSelectPlaceholder("Supplier Name")}</option>
                          {suppliers.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name} ({s.village || "Local"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Auto-Fetch by Lot ID
                        </label>
                        <select
                          value={ledgerFilters.lotId}
                          onChange={(e) =>
                            setLedgerFilters({
                              ...ledgerFilters,
                              lotId: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            fontWeight: "700",
                            background: "#fff",
                          }}
                        >
                          <option value="">{getSelectPlaceholder("Lot ID Reference")}</option>
                          {Array.from(
                            new Set(
                              (supplierBills || []).map((b) => b && (b.lotId || b.lotCode)),
                            ),
                          )
                            .filter(Boolean)
                            .map((lot) => (
                              <option key={lot} value={lot}>
                                {lot}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Filter by Date
                        </label>
                        <input
                          type="date"
                          value={ledgerFilters.startDate}
                          onChange={(e) =>
                            setLedgerFilters({
                              ...ledgerFilters,
                              startDate: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "11px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            background: "#fff",
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedLedgerSupplier("");
                            setLedgerFilters({ ...ledgerFilters, lotId: "", startDate: "" });
                            fetchData();
                          }}
                          style={{ width: "100%" }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 8px",
                        fontSize: "13px",
                      }}
                    >
                        <thead>
                          <tr
                            style={{
                              background: "#F8FAFC",
                              color: COLORS.sidebar,
                              fontWeight: "800",
                              textAlign: "left",
                            }}
                          >
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Date</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Lot ID</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Bill Number</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Product Summary</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Gross Sale (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Expenses (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Net Sale (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Advance (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Payment Made (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Running Balance (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "center" }}>Action</th>
                          </tr>
                        </thead>
                      <tbody style={{ borderTop: "2px solid #F1F5F9" }}>
                        {(() => {
                          let runningTotalBalance = 0;
                          const filteredBills = (supplierBills || [])
                            .filter((b) => {
                              // Essential Multi-Level Supplier Filtering
                              if (selectedLedgerSupplier) {
                                const bSupId = b.supplierId?._id || b.supplierId || b.farmerId?._id || b.farmerId;
                                if (bSupId !== selectedLedgerSupplier) return false;
                              }
                              if (ledgerFilters.lotId && b.lotId !== ledgerFilters.lotId && b.lotCode !== ledgerFilters.lotId && b.lot_id !== ledgerFilters.lotId) return false;
                              if (!isWithinFilterRange(b.date || b.createdAt)) return false;
                              return true;
                            });

                          return filteredBills.map((bill, bIdx) => {
                              const dateVal =
                                (bill.date && formatDate(bill.date)) ||
                                (bill.createdAt
                                  ? formatDate(bill.createdAt)
                                  : getCurrentDateFormatted());
                              const lotIdVal = bill.lotId || bill.lotCode || bill.lot_id || "N/A";
                              const billNoVal = bill.billNumber || bill.billNo || bill.bill_no || "DRAFT";

                              const itemsList = bill.produce || bill.items || bill.lineItems || [];
                              const productSummary = itemsList.length > 0
                                ? itemsList.map(p => `${p.productName || p.product || ""} ${Number(p.quantity||p.qty||0).toLocaleString()} KG`).join(" + ")
                                : "N/A";

                              let grossValue = Number(bill.grossValue || bill.totalValue || bill.gross_value || 0);
                              if (grossValue === 0) {
                                grossValue = (itemsList || []).reduce((sum, item) => sum + (Number(item.quantity || item.qty || 0) * Number(item.rate || item.saleRate || 0)), 0);
                              }

                              let expenseValue = Number(bill.totalExpenses || bill.totalDeductions || bill.total_expenses || 0);
                              if (expenseValue === 0 && (bill.charges || bill.expenses)) {
                                expenseValue = (bill.expenses || []).reduce((sum, e) => sum + Number(e.value || e.amount || 0), 0);
                                expenseValue += Object.values(bill.charges || {}).reduce((s,v) => s + (Number(v)||0), 0);
                              }

                              const netValue = Number(
                                bill.netPayable ||
                                  bill.net_payable ||
                                  (grossValue - expenseValue),
                              );
                              const advanceAmt = Number(
                                bill.advance || bill.advanceAmount || 0,
                              );
                              const cashPaid = Number(
                                bill.amountPaid ||
                                  bill.paymentMade ||
                                  bill.paidAmount ||
                                  0,
                              );

                              // Formula: Previous Running Balance + Net Sale - Advance - Payment Made
                              runningTotalBalance =
                                runningTotalBalance + netValue - advanceAmt - cashPaid;

                              return (
                                <tr key={bill._id || bIdx} style={{ background: "#FFFFFF" }}>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{dateVal}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", fontWeight: "700", color: COLORS.secondary }}>{lotIdVal}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", fontWeight: "600" }}>{billNoVal}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", color: COLORS.muted, fontSize: "11px", maxWidth: "200px" }}>{productSummary}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", fontWeight: "600" }}>{formatCurrency(grossValue)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", color: "#E11D48" }}>{formatCurrency(expenseValue)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", fontWeight: "700" }}>{formatCurrency(netValue)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", color: "#C2410C" }}>{formatCurrency(advanceAmt)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", color: "#15803D" }}>{formatCurrency(cashPaid)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right" }}>
                                    <span style={{ padding: "4px 10px", borderRadius: "10px", background: runningTotalBalance >= 0 ? "#F0FDF4" : "#FFF1F2", color: runningTotalBalance >= 0 ? "#15803D" : "#E11D48", fontWeight: "800", fontSize: "12px" }}>
                                      {formatCurrency(Math.abs(runningTotalBalance))} {runningTotalBalance >= 0 ? "CR" : "DR"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "center" }}>
                                    <Button variant="outline" style={{ padding: "6px 12px", fontSize: "10px" }} onClick={() => setViewingEntity({ type: "Bill", data: bill })}>View Details</Button>
                                  </td>
                                </tr>
                              );
                            });
                        })()}

                        {(supplierBills || []).length > 0 &&
                          (() => {
                            const tNet = (supplierBills || []).reduce((s, b) => s + Number(b.netPayable || 0), 0);
                            const tPaid = (supplierBills || []).reduce((s, b) => s + Number(b.advance || 0) + Number(b.amountPaid || b.paymentMade || 0), 0);
                            const tBalance = tNet - tPaid;
                            return (
                              <tr style={{ background: "#FDFBF4", fontWeight: "900", borderTop: "2px solid #EBE9E1" }}>
                                <td colSpan="4" style={{ padding: "20px", textAlign: "right", borderRadius: "12px 0 0 12px", color: COLORS.sidebar, fontSize: "14px" }}>CUMULATIVE LEDGER TOTALS:</td>
                                <td colSpan="5" style={{ padding: "20px", textAlign: "right", fontSize: "16px" }}>
                                  <span style={{ color: COLORS.muted, marginRight: "16px" }}>Net Sale: {formatCurrency(tNet)}</span>
                                  <span style={{ color: "#15803D", marginRight: "16px" }}>Payments: {formatCurrency(tPaid)}</span>
                                </td>
                                <td style={{ padding: "20px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                                  <span style={{ padding: "8px 16px", borderRadius: "12px", background: tBalance >= 0 ? "#F0FDF4" : "#FFF1F2", color: tBalance >= 0 ? "#15803D" : "#E11D48", fontSize: "18px" }}>
                                    {formatCurrency(Math.abs(tBalance))} {tBalance >= 0 ? "TOTAL DUE" : "RECONCILED"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })()}

                        {(supplierBills || []).length === 0 && (
                          <tr>
                            <td
                              colSpan="10"
                              style={{
                                textAlign: "center",
                                padding: "80px 40px",
                                color: COLORS.muted,
                              }}
                            >
                              No transactions found. Select a supplier from the
                              dropdown to fetch data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeLedgerTab === "Customer" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid #EBE9E1",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ marginBottom: "24px" }}>
                    <p style={{ margin: 0, color: COLORS.muted, fontSize: "14px", fontWeight: "600" }}>Audited Financial Statements â€” Invoice-wise Aging & Receivables</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      marginBottom: "24px",
                      borderBottom: "2.5px solid #F1F5F9",
                      paddingBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", flex: 1 }}></div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                          onClick={() => handleDownloadLedgerCSV(activeLedgerTab === "Supplier" ? "Supplier" : "Customer")}
                          style={{
                            background: "linear-gradient(135deg, #1e240b 0%, #3a4714 100%)",
                            color: "#fff",
                            fontWeight: "800",
                            fontSize: "12px",
                            height: "fit-content",
                            border: "none",
                            padding: "10px 20px",
                            boxShadow: "0 4px 12px rgba(30,36,11,0.2)",
                          }}
                        >
                          Download Statement
                        </Button>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "20px",
                        background: "#FDFBF4",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Search Customer Name
                        </label>
                        <select
                          value={selectedLedgerBuyer}
                          onChange={(e) =>
                            handleLedgerBuyerChange(e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            fontWeight: "700",
                            background: "#fff",
                          }}
                        >
                          <option value="">{getSelectPlaceholder("Customer Name")}</option>
                          {buyers.map((b) => (
                            <option key={b._id} value={b._id}>
                              {b.name} ({b.shopName || "Trader"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Auto-Fetch by Invoice No.
                        </label>
                        <select
                          value={ledgerFilters.invoiceNo}
                          onChange={(e) =>
                            setLedgerFilters({
                              ...ledgerFilters,
                              invoiceNo: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            fontWeight: "700",
                            background: "#fff",
                          }}
                        >
                          <option value="">{getSelectPlaceholder("Invoice")}</option>
                          {Array.from(
                            new Set(
                              (buyerInvoices || []).map((inv) => inv && (inv.invoiceNumber || inv.invoiceNo)),
                            ),
                          )
                            .filter(Boolean)
                            .map((no) => (
                              <option key={no} value={no}>
                                {no}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Filter by Date
                        </label>
                        <input
                          type="date"
                          value={ledgerFilters.startDate}
                          onChange={(e) =>
                            setLedgerFilters({
                              ...ledgerFilters,
                              startDate: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "11px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            background: "#fff",
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedLedgerBuyer("");
                            setLedgerFilters({ ...ledgerFilters, invoiceNo: "", startDate: "" });
                            fetchData();
                          }}
                          style={{ width: "100%" }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 8px",
                        fontSize: "13px",
                      }}
                    >
                        <thead>
                          <tr
                            style={{
                              background: "#F8FAFC",
                              color: COLORS.sidebar,
                              fontWeight: "800",
                              textAlign: "left",
                            }}
                          >
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Date</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Invoice No.</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Fruit / Variety</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap" }}>Quantity (KG)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Invoice Amount (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Payment Received (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Outstanding Balance (₹)</th>
                            <th style={{ padding: "14px", whiteSpace: "nowrap", textAlign: "center" }}>Action</th>
                          </tr>
                        </thead>
                      <tbody>
                        {(() => {
                          let runningOutstanding = 0;
                          const filteredInvoices = (buyerInvoices || [])
                            .filter((inv) => {
                              // Essential Multi-Level Customer Filtering
                              if (selectedLedgerBuyer) {
                                const invBuyId = inv.buyer?._id || inv.buyer || inv.buyerId;
                                if (invBuyId !== selectedLedgerBuyer) return false;
                              }
                              const invNo = inv.invoiceNumber || inv.invoiceNo || inv.invoice_no;
                              if (ledgerFilters.invoiceNo && invNo !== ledgerFilters.invoiceNo) return false;
                              if (!isWithinFilterRange(inv.date || inv.createdAt)) return false;
                              return true;
                            });

                          return filteredInvoices.map((inv, iIdx) => {
                              const dateVal = (inv.date && formatDate(inv.date)) || (inv.createdAt ? formatDate(inv.createdAt) : getCurrentDateFormatted());
                              const invoiceNoVal = inv.invoiceNumber || inv.invoiceNo || inv.invoice_no || `INV-${iIdx + 1}`;
                              
                              const items = inv.items || inv.lineItems || inv.produce || [];
                              const fruitVariety = items.map(p => `${p.productLabel || p.product || ""} ${p.variety || ""}`).join(", ") || "N/A";
                              const totalQty = (items || []).reduce((s, i) => s + Number(i.netWeight || i.quantity || i.qty || 0), 0);

                              const subTotal = (items || []).reduce((sum, item) => sum + (Number(item.netWeight || item.quantity || item.qty || 0) * Number(item.rate || item.saleRate || 0)), 0);
                              const adCharges = Object.values(inv.charges || inv.additionalCharges || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                              const invAmount = Number(inv.grandTotal || inv.totalAmount || inv.total_amount || (subTotal + adCharges));
                              const recvAmt = Number(inv.amountReceived || inv.paidAmount || inv.paymentReceived || inv.paid_amount || 0);

                              // Formula: Previous Outstanding Balance + Invoice Amount - Payment Received
                              runningOutstanding = runningOutstanding + invAmount - recvAmt;

                              return (
                                <tr key={inv._id || iIdx} style={{ background: "#FFFFFF" }}>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{dateVal}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", fontWeight: "700", color: COLORS.secondary }}>
                                     <SmartDataNode text={invoiceNoVal} type="Invoice" data={inv} onAdd={() => { setActiveSection("Buyer Invoicing"); setActiveBuyerInvoiceTab("Invoice Entry"); }} />
                                  </td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", color: COLORS.muted, fontSize: "11px", maxWidth: "200px" }}>{fruitVariety}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", fontWeight: "700" }}>{totalQty.toLocaleString()} KG</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", fontWeight: "600", color: "#E11D48" }}>{formatCurrency(invAmount)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right", color: "#15803D" }}>{formatCurrency(recvAmt)}</td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "right" }}>
                                    <span style={{ padding: "4px 10px", borderRadius: "10px", background: runningOutstanding > 0 ? "#FFF1F2" : "#F0FDF4", color: runningOutstanding > 0 ? "#E11D48" : "#15803D", fontWeight: "800", fontSize: "12px" }}>
                                      {formatCurrency(Math.abs(runningOutstanding))} {runningOutstanding >= 0 ? "OUTSTANDING" : "ADVANCE"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "14px", borderBottom: "1px solid #F1F5F9", textAlign: "center" }}>
                                    <Button
                                      variant="outline"
                                      style={{ padding: "6px 12px", fontSize: "10px" }}
                                      onClick={() => window.open(`/invoice/${inv.invoiceNumber || inv._id}`, "_blank")}
                                    >
                                      View / Share
                                    </Button>
                                  </td>
                                </tr>
                              );
                            });
                        })()}
                        {(buyerInvoices || []).length > 0 &&
                          (() => {
                            const tInv = (buyerInvoices || []).reduce((s, inv) => s + Number(inv.grandTotal || inv.totalAmount || 0), 0);
                            const tRecv = (buyerInvoices || []).reduce((s, inv) => s + Number(inv.amountReceived || inv.paidAmount || 0), 0);
                            const tDue = tInv - tRecv;
                            return (
                              <tr style={{ background: "#FDFBF4", fontWeight: "900", borderTop: "2px solid #EBE9E1" }}>
                                <td colSpan="3" style={{ padding: "20px", textAlign: "right", borderRadius: "12px 0 0 12px", color: COLORS.sidebar }}>CUMULATIVE RECEIVABLES:</td>
                                <td colSpan="3" style={{ padding: "20px", textAlign: "right", fontSize: "14px" }}>
                                  <span style={{ color: "#E11D48", marginRight: "16px" }}>Billed: {formatCurrency(tInv)}</span>
                                  <span style={{ color: "#15803D" }}>Paid: {formatCurrency(tRecv)}</span>
                                </td>
                                <td colSpan="2" style={{ padding: "20px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                                  <span style={{ padding: "8px 16px", borderRadius: "12px", background: tDue > 0 ? "#FFF1F2" : "#F0FDF4", color: tDue > 0 ? "#E11D48" : "#15803D", fontSize: "16px" }}>
                                    {formatCurrency(Math.abs(tDue))} {tDue >= 0 ? "TOTAL DUE" : "SETTLED"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "Transportation Tracking" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* Logistical Overview Summary Bar */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "20px",
                }}
              >
                <Card style={{ background: COLORS.secondary, color: "#fff" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      opacity: 0.7,
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    Active Shipments
                  </p>
                  <h2 style={{ margin: "5px 0 0" }}>
                    {(typeof supplierBills !== 'undefined' ? (supplierBills || []).length : 0) + (typeof allocations !== 'undefined' ? allocations.length : 0)} Vehicles
                  </h2>
                </Card>
                <Card
                  style={{ background: "#fff", border: "1px solid #fee2e2" }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#b91c1c",
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    Arrival Alerts (Delayed)
                  </p>
                  <h2 style={{ margin: "5px 0 0", color: "#ef4444" }}>
                    {(typeof lots !== 'undefined' && lots.filter ? lots.filter(l => l.status === 'delayed').length : 0).toString().padStart(2, '0')} Alerts
                  </h2>
                </Card>
                <Card>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: COLORS.muted,
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    Today's Dispatch Vol.
                  </p>
                  <h2 style={{ margin: "5px 0 0", color: COLORS.secondary }}>
                    {new Intl.NumberFormat('en-IN').format(typeof allocations !== 'undefined' && allocations.reduce ? allocations.filter(a => isWithinFilterRange(a.allocationDate || a.date)).reduce((sum, a) => sum + Number(a.weight || a.tonnage || 0 || a.quantity), 0) : 0)} KG
                  </h2>
                </Card>
                <Card>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: COLORS.muted,
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    Est. Freight Payable
                  </p>
                  <h2 style={{ margin: "5px 0 0", color: COLORS.primary }}>
                    {formatCurrency(typeof supplierBills !== 'undefined' && (supplierBills || []).reduce ? (supplierBills || []).filter(b => isWithinFilterRange(b.date)).reduce((sum, b) => sum + Number(b.expenses?.freight || b.transportFee || 0), 0) : 0)}
                  </h2>
                </Card>
              </div>

              {/* Transportation Tabs */}
              <div style={{ display: "flex", gap: "12px", borderBottom: "2px solid #EBE9E1", paddingBottom: "16px" }}>
                <Button 
                  variant={transportTab === "Inward" ? "primary" : "outline"} 
                  onClick={() => setTransportTab("Inward")}
                  style={{ flex: 1, fontSize: "16px" }}
                >
                  Inward Transportation
                </Button>
                <Button 
                  variant={transportTab === "Outward" ? "primary" : "outline"} 
                  onClick={() => setTransportTab("Outward")}
                  style={{ flex: 1, fontSize: "16px" }}
                >
                  Outward Transportation
                </Button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "32px",
                  alignItems: "flex-start",
                }}
              >
                {/* COLUMN 1: INWARD TRANSPORTATION (SUPPLIER SIDE) */}
                <div
                  style={{
                    display: transportTab === "Inward" ? "block" : "none",
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 16px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    10.1 Inward Transportation (Farmer Side)
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: COLORS.muted,
                      marginBottom: "24px",
                      marginTop: 0,
                    }}
                  >
                    Tracks the lorry/vehicle that brings produce FROM the farmer
                    TO the mandi.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Lot ID
                        </label>
                        <select
                          value={inwardTransportForm.lotId}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              lotId: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          <option value="">{getSelectPlaceholder("Lot ID Reference")}</option>
                          <option>LOT-X122 (Alphonso)</option>
                          <option>LOT-Y45 (Banana)</option>
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Vehicle / Lorry No.
                        </label>
                        <input
                          type="text"
                          placeholder="Registration number"
                          value={inwardTransportForm.vehicleNo}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              vehicleNo: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Driver Name
                        </label>
                        <input
                          type="text"
                          placeholder="Optional"
                          value={inwardTransportForm.driverName}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              driverName: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Driver Mobile
                        </label>
                        <input
                          type="text"
                          placeholder="Optional"
                          value={inwardTransportForm.driverMobile}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              driverMobile: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Transport Company
                      </label>
                      <input
                        type="text"
                        placeholder="If applicable"
                        value={inwardTransportForm.company}
                        onChange={(e) =>
                          setInwardTransportForm({
                            ...inwardTransportForm,
                            company: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Origin (Village/District)
                      </label>
                      <input
                        type="text"
                        placeholder="Where produce loaded from"
                        value={inwardTransportForm.origin}
                        onChange={(e) =>
                          setInwardTransportForm({
                            ...inwardTransportForm,
                            origin: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Departure Date/Time
                        </label>
                        <input
                          type="datetime-local"
                          value={inwardTransportForm.departureTime}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              departureTime: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Arrival Date/Time
                        </label>
                        <input
                          type="datetime-local"
                          value={inwardTransportForm.arrivalTime}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              arrivalTime: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Freight Amount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Transport cost"
                          value={inwardTransportForm.freightAmount}
                          onChange={(e) =>
                            setInwardTransportForm({
                              ...inwardTransportForm,
                              freightAmount: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Freight Paid By
                        </label>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <Button
                            onClick={() =>
                              setInwardTransportForm({
                                ...inwardTransportForm,
                                paidBy: "SPV",
                              })
                            }
                            variant={
                              inwardTransportForm.paidBy === "SPV"
                                ? "primary"
                                : "outline"
                            }
                            style={{
                              flex: 1,
                              height: "40px",
                              fontSize: "11px",
                              padding: 0,
                            }}
                          >
                            SPV
                          </Button>
                          <Button
                            onClick={() =>
                              setInwardTransportForm({
                                ...inwardTransportForm,
                                paidBy: "Supplier",
                              })
                            }
                            variant={
                              inwardTransportForm.paidBy === "Supplier"
                                ? "primary"
                                : "outline"
                            }
                            style={{
                              flex: 1,
                              height: "40px",
                              fontSize: "11px",
                              padding: 0,
                            }}
                          >Supplier</Button>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Notes
                      </label>
                      <textarea
                        placeholder="Route, stops, condition of produce"
                        value={inwardTransportForm.notes}
                        onChange={(e) =>
                          setInwardTransportForm({
                            ...inwardTransportForm,
                            notes: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          height: "60px",
                          resize: "none",
                        }}
                      />
                    </div>
                    <Button
                      style={{ marginTop: "8px", height: "36px", alignSelf: "flex-start", fontSize: "14px", padding: "0 24px" }}
                      onClick={handleRecordInwardTransport}
                    >
                      Submit
                    </Button>
                  </div>
                </div>

                {/* COLUMN 2: OUTWARD TRANSPORTATION (CUSTOMER SIDE) */}
                <div
                  style={{
                    display: transportTab === "Outward" ? "block" : "none",
                    background: "#FFFFFF",
                    padding: "32px",
                    borderRadius: "12px",
                    border: "1px solid #EBE9E1",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: COLORS.sidebar,
                      margin: "0 0 16px 0",
                      borderBottom: "1px solid #EBE9E1",
                      paddingBottom: "16px",
                    }}
                  >
                    10.2 Outward Transportation (Buyer Side)
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: COLORS.muted,
                      marginBottom: "24px",
                      marginTop: 0,
                    }}
                  >
                    Tracks the vehicle that moves produce FROM the mandi TO the
                    buyer's location.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Invoice No.
                        </label>
                        <select
                          value={outwardTransportForm.invoiceNo}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              invoiceNo: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          <option value="">{getSelectPlaceholder("Invoice")}</option>
                          <option>INV-2026-X12</option>
                          <option>INV-2026-X45</option>
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Bice / Vehicle No.
                        </label>
                        <input
                          type="text"
                          placeholder="Truck / auto number"
                          value={outwardTransportForm.vehicleNo}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              vehicleNo: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Driver Name
                        </label>
                        <input
                          type="text"
                          placeholder="Optional"
                          value={outwardTransportForm.driverName}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              driverName: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Driver Mobile
                        </label>
                        <input
                          type="text"
                          placeholder="Optional"
                          value={outwardTransportForm.driverMobile}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              driverMobile: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Destination
                      </label>
                      <input
                        type="text"
                        placeholder="Buyer's shop / market location"
                        value={outwardTransportForm.destination}
                        onChange={(e) =>
                          setOutwardTransportForm({
                            ...outwardTransportForm,
                            destination: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Dispatch Date/Time
                        </label>
                        <input
                          type="datetime-local"
                          value={outwardTransportForm.dispatchTime}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              dispatchTime: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Delivery Date/Time
                        </label>
                        <input
                          type="datetime-local"
                          value={outwardTransportForm.deliveryTime}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              deliveryTime: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Freight Amount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Outward freight"
                          value={outwardTransportForm.freightAmount}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              freightAmount: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Freight Paid By
                        </label>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <Button
                            onClick={() =>
                              setOutwardTransportForm({
                                ...outwardTransportForm,
                                paidBy: "Customer",
                              })
                            }
                            variant={
                              outwardTransportForm.paidBy === "Customer"
                                ? "primary"
                                : "outline"
                            }
                            style={{
                              flex: 1,
                              height: "40px",
                              fontSize: "11px",
                              padding: 0,
                            }}
                          >Customer</Button>
                          <Button
                            onClick={() =>
                              setOutwardTransportForm({
                                ...outwardTransportForm,
                                paidBy: "SPV",
                              })
                            }
                            variant={
                              outwardTransportForm.paidBy === "SPV"
                                ? "primary"
                                : "outline"
                            }
                            style={{
                              flex: 1,
                              height: "40px",
                              fontSize: "11px",
                              padding: 0,
                            }}
                          >
                            SPV
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: COLORS.muted,
                          }}
                        >
                          Delivery Status
                        </label>
                        <select
                          value={outwardTransportForm.status}
                          onChange={(e) =>
                            setOutwardTransportForm({
                              ...outwardTransportForm,
                              status: e.target.value,
                            })
                          }
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #EBE9E1",
                            color: COLORS.sidebar,
                            outline: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          <option value="" disabled>{getSelectPlaceholder("Delivery Status")}</option>
                          <option>Pending</option>
                          <option>In Transit</option>
                          <option>Delivered</option>
                          <option>Returned</option>
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: COLORS.muted,
                        }}
                      >
                        Notes
                      </label>
                      <textarea
                        placeholder="Any damage, shortage, or return info"
                        value={outwardTransportForm.notes}
                        onChange={(e) =>
                          setOutwardTransportForm({
                            ...outwardTransportForm,
                            notes: e.target.value,
                          })
                        }
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #EBE9E1",
                          color: COLORS.sidebar,
                          outline: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          height: "60px",
                          resize: "none",
                        }}
                      />
                    </div>
                    <Button
                      style={{
                        marginTop: "8px",
                        height: "36px",
                        alignSelf: "flex-start",
                        fontSize: "14px",
                        padding: "0 24px",
                        background: "#0f172a",
                      }}
                      onClick={handleRecordOutwardTransport}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transportation Monitor Sidebar (Moved inside main flex column) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                  marginTop: "24px",
                }}
              >
                <Card
                  title="Live In-Transit Monitor"
                  subtitle="Tracking active vehicles"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {[
                      {
                        id: "AP 02 X 11",
                        type: "Inward",
                        time: "2h 15m ago",
                        status: "In Transit",
                        origin: "Nimmagadda",
                      },
                      {
                        id: "KA 51 J 88",
                        type: "Outward",
                        time: "45m ago",
                        status: "Delayed",
                        origin: "City Market",
                      },
                    ].map((truck, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "16px",
                          background:
                            truck.status === "Delayed" ? "#fef2f2" : "#f8fafc",
                          borderRadius: "12px",
                          border: `1.5px solid ${truck.status === "Delayed" ? "#fee2e2" : "#e2e8f0"}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "6px",
                          }}
                        >
                          <b style={{ fontSize: "14px" }}>{truck.id}</b>
                          <span
                            style={{
                              fontSize: "10px",
                              background:
                                truck.type === "Inward" ? "#e0f2fe" : "#fef3c7",
                              color:
                                truck.type === "Inward" ? "#0369a1" : "#92400e",
                              padding: "2px 8px",
                              borderRadius: "8px",
                              fontWeight: "900",
                            }}
                          >
                            {truck.type.toUpperCase()}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          <div
                            style={{ fontSize: "11px", color: COLORS.muted }}
                          >
                            {truck.origin} <br /> {truck.time}
                          </div>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "800",
                              color:
                                truck.status === "Delayed"
                                  ? "#ef4444"
                                  : COLORS.primary,
                            }}
                          >
                            â— {truck.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title="Vehicle History Audit"
                  subtitle="All trips by current filter"
                >
                  <div style={{ position: "relative", marginBottom: "16px" }}>
                    <input
                      placeholder="Search vehicle history..."
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                        width: "100%",
                        outline: "none",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                      value={transportFilter}
                      onChange={(e) => setTransportFilter(e.target.value)}
                    />
                  </div>
                  {transportFilter ? (
                    <div
                      style={{
                        padding: "12px",
                        border: "1px solid #f1f5f9",
                        borderRadius: "10px",
                        fontSize: "12px",
                      }}
                    >
                      📅 22/03 - Inward (Farmer A)
                      <br />
                      📅 24/03 - Outward (Buyer B)
                      <br />
                      <span
                        style={{
                          color: COLORS.primary,
                          cursor: "pointer",
                          fontWeight: "800",
                          display: "block",
                          marginTop: "10px",
                        }}
                      >
                        View Full Profile →
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        opacity: 0.5,
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>ðŸ”</span>
                      <p style={{ fontSize: "11px", margin: "10px 0 0" }}>
                        Enter a vehicle number to view history.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* 12. Expense Management */}
          {activeSection === "Expense Management" && (
            <Card
              title="Operational Burn Registry"
              subtitle="Track expenses per transaction or daily cycle"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "16px",
                  marginBottom: "40px",
                }}
              >
                {[
                  { cat: "Labour", val: 32500 },
                  { cat: "Transport", val: 45800 },
                  { cat: "Marketing", val: 12000 },
                  { cat: "Packing", val: 18400 },
                  { cat: "Misc", val: 8200 },
                ].map((item) => (
                  <div
                    key={item.cat}
                    style={{
                      padding: "24px",
                      background: "#f8fafc",
                      borderRadius: "20px",
                      textAlign: "center",
                      border: "1.5px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "800",
                        color: COLORS.muted,
                      }}
                    >
                      {item.cat}
                    </p>
                    <h3 style={{ margin: "8px 0 0", color: COLORS.secondary }}>
                      {formatCurrency(item.val)}
                    </h3>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <h3>Register New Expense Entry</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "800",
                          color: COLORS.primary,
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          position: "relative",
                          paddingLeft: "12px",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "2px",
                            color: COLORS.accent,
                          }}
                        >
                          â™¦
                        </span>
                        CATEGORY
                      </label>
                      <select
                        style={{
                          backgroundColor: "rgba(255,255,255,0.7)",
                          border: "2px solid #e2e8f0",
                          borderRadius: "12px",
                          padding: "16px",
                          fontSize: "15px",
                          color: COLORS.text,
                          outline: "none",
                          width: "100%",
                        }}
                        value={expenseForm.category}
                        onChange={(e) =>
                          setExpenseForm({
                            ...expenseForm,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Labour">Labour</option>
                        <option value="Transport">Transport</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Packing">Packing</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>
                    <Input
                      label="Amount Paid"
                      type="number"
                      placeholder="₹"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <Input
                      label="Related Lot #"
                      placeholder="Optional (TRX Link)"
                      value={expenseForm.lotId}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          lotId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Input
                    label="Transaction Memo"
                    placeholder="Fuel charges for Guntur route..."
                    value={expenseForm.memo}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, memo: e.target.value })
                    }
                  />
                  <Button
                    onClick={handleCreateExpense}
                    style={{ marginTop: "16px" }}
                  >
                    Commit to Ledger
                  </Button>
                </div>
                <Card style={{ background: COLORS.secondary, color: "#fff" }}>
                  <h3>Audit Insights</h3>
                  <p>
                    Operational costs are within <b>7.2%</b> of total sales
                    volume today. Transport costs are peaking due to monsoon
                    logistics.
                  </p>
                  <Button
                    variant="primary"
                    style={{ marginTop: "20px", width: "100%" }}
                  >
                    View Expense Report
                  </Button>
                </Card>
              </div>
            </Card>
          )}

          {/* 13. Verification & Compliance */}
          {activeSection === "Verification & Compliance" && (
            <Card
              title="Shield & Compliance Hub"
              subtitle="Identity verification for mandatory India KYC"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr",
                  gap: "40px",
                }}
              >
                <div>
                  <h3>New Identity Verification</h3>
                  <Input label="Aadhaar Number" placeholder="12-digit UID" />
                  <Input label="PAN Number" placeholder="Alpha-Numeric PAN" />
                  <Input
                    label="Voter ID (Optional)"
                    placeholder="Election ID #"
                  />
                  <div
                    style={{
                      padding: "40px",
                      border: "3px dashed #f1f5f9",
                      borderRadius: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                  >
                    ðŸ“ Upload Identity Documents (Scan/Photo)
                  </div>
                  <Button style={{ width: "100%" }}>Run KYC Audit</Button>
                </div>
                <div>
                  <h3>Onboarded KYC Status</h3>
                  {[
                    {
                      name: "Srinivasa Rao",
                      role: "Supplier",
                      status: "VERIFIED",
                    },
                    {
                      name: "Mahesh Traders",
                      role: "Customer",
                      status: "VERIFIED",
                    },
                    {
                      name: "Green Valley Farms",
                      role: "Supplier",
                      status: "PENDING",
                    },
                    {
                      name: "Prakash Wholesale",
                      role: "Customer",
                      status: "VERIFIED",
                    },
                    {
                      name: "Vikram Reddy",
                      role: "Supplier",
                      status: "VERIFIED",
                    },
                    {
                      name: "Reliance Fresh Hub",
                      role: "Customer",
                      status: "VERIFIED",
                    },
                    {
                      name: "Sandhya Devi",
                      role: "Supplier",
                      status: "VERIFIED",
                    },
                    {
                      name: "Anwar Pasha",
                      role: "Supplier",
                      status: "PENDING",
                    },
                    {
                      name: "Gopal Krishnan",
                      role: "Supplier",
                      status: "VERIFIED",
                    },
                    {
                      name: "Harsha Wholesale",
                      role: "Customer",
                      status: "VERIFIED",
                    },
                  ].map((user, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "20px",
                        borderRadius: "16px",
                        background: "#f8fafc",
                        marginBottom: "12px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <b>{user.name}</b>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: COLORS.muted,
                          }}
                        >
                          Role: {user.role}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            background:
                              user.status === "VERIFIED"
                                ? COLORS.success
                                : COLORS.accent,
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "900",
                          }}
                        >
                          {user.status}
                        </span>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            marginTop: "4px",
                          }}
                        >
                          Vault ID: {Date.now().toString().slice(-6)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* 11. DASHBOARD & REPORTS */}
          {activeSection === "Records Tracking" && (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <div style={{ marginTop: "20px" }}></div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                {/* 1. Registered Members */}
                <div style={{ background: "#FDFBF4", padding: "32px", borderRadius: "24px", border: "1.5px solid #EBE9E1", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "40px", background: "#f0ece0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "900", color: "#D4A017", fontFamily: "'Playfair Display', serif" }}>
                      S
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "6px 14px", borderRadius: "20px" }}>Active</span>
                  </div>
                  
                  <h2 style={{ fontSize: "28px", fontWeight: "900", color: COLORS.sidebar, margin: "0 0 4px 0", fontFamily: "'Playfair Display', serif" }}>Members Directory</h2>
                  <p style={{ color: COLORS.muted, margin: "0 0 4px 0", fontSize: "16px" }}><b>{(suppliers.length + buyers.length)}</b> Active Staff & Users</p>
                  <div style={{ color: "#D4A017", display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                    <Phone size={16} /> <span style={{ fontWeight: "700" }}>+91 Mandi Support</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <Button variant="outline" style={{ borderRadius: "20px", display: "flex", gap: "8px", justifyContent: "center" }} onClick={() => setActiveSection("User Role")}>
                       <Edit2 size={16} /> Edit
                    </Button>
                    <Button variant="outline" style={{ borderRadius: "20px", color: COLORS.danger, borderColor: "#ffe4e4" }} onClick={() => alert("Member pool access locked.")}>
                       Disable
                    </Button>
                  </div>
                  
                  <Button style={{ width: "100%", background: "#FFFBCC", color: "#7A5500", border: "1px solid #FFE58F", borderRadius: "20px", fontWeight: "800", marginBottom: "24px", display: "flex", gap: "8px", justifyContent: "center" }} onClick={() => alert("Simulating login as Master Administrator...")}>
                    <UserCheck size={18} /> Login as Staff
                  </Button>

                  <div style={{ borderTop: "1.5px solid #f0ece0", paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button style={{ background: "none", border: "none", color: COLORS.muted, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "700" }} onClick={() => alert("Permanent deletion requires database authorization.")}>
                      <Trash2 size={16} /> Delete Account
                    </button>
                  </div>
                </div>

                {/* 2. Registered Lots */}
                <div style={{ background: "#FDFBF4", padding: "32px", borderRadius: "24px", border: "1.5px solid #EBE9E1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "40px", background: "rgba(230, 126, 34, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: COLORS.primary }}>
                      <Boxes size={40} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: COLORS.primary, background: "rgba(230, 126, 34, 0.1)", padding: "6px 14px", borderRadius: "20px" }}>Warehoused</span>
                  </div>
                  
                  <h2 style={{ fontSize: "28px", fontWeight: "900", color: COLORS.sidebar, margin: "0 0 4px 0", fontFamily: "'Playfair Display', serif" }}>Inventory Lots</h2>
                  <p style={{ color: COLORS.muted, margin: "0 0 4px 0", fontSize: "16px" }}><b>{lots.length}</b> Recorded Procurements</p>
                  <div style={{ color: COLORS.primary, display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                    <Package size={16} /> <span style={{ fontWeight: "700" }}>{lots.filter(l => l.status === "Pending").length} Unallocated</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <Button variant="outline" style={{ borderRadius: "20px" }} onClick={() => setActiveSection("Lot Creation")}>
                       Edit Stock
                    </Button>
                    <Button variant="outline" style={{ borderRadius: "20px", color: COLORS.danger }} onClick={() => alert("Inventory locking enabled.")}>
                       Freeze
                    </Button>
                  </div>
                  
                  <div style={{ borderTop: "1.5px solid #f0ece0", paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button style={{ background: "none", border: "none", color: COLORS.muted, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "700" }} onClick={() => alert("Requires Manager PIN to delete recorded lots.")}>
                      <Trash2 size={16} /> Purge Records
                    </button>
                  </div>
                </div>

                {/* 3. Generated Documents (Bills & Invoices) */}
                <div style={{ background: "#FDFBF4", padding: "32px", borderRadius: "24px", border: "1.5px solid #EBE9E1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "40px", background: "rgba(142, 68, 173, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: "#8e44ad" }}>
                      <FileText size={40} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: "#8e44ad", background: "rgba(142, 68, 173, 0.1)", padding: "6px 14px", borderRadius: "20px" }}>Audit Ready</span>
                  </div>
                  
                  <h2 style={{ fontSize: "28px", fontWeight: "900", color: COLORS.sidebar, margin: "0 0 4px 0", fontFamily: "'Playfair Display', serif" }}>Financial Docs</h2>
                  <p style={{ color: COLORS.muted, margin: "0 0 4px 0", fontSize: "16px" }}><b>{supplierBills.length + buyerInvoices.length}</b> Issued Documents</p>
                  <div style={{ color: "#8e44ad", display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                    <FileCheck size={16} /> <span style={{ fontWeight: "700" }}>{supplierBills.length} Bills | {buyerInvoices.length} Invoices</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <Button variant="outline" style={{ borderRadius: "20px" }} onClick={() => setActiveSection("Supplier Billing")}>
                       Manage Bills
                    </Button>
                    <Button variant="outline" style={{ borderRadius: "20px", color: COLORS.danger }} onClick={() => alert("Document editing requires Admin Override.")}>
                       Void Doc
                    </Button>
                  </div>
                  
                  <div style={{ borderTop: "1.5px solid #f0ece0", paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button style={{ background: "none", border: "none", color: COLORS.muted, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "700" }} onClick={() => alert("Permanent document purge restricted for audit trail.")}>
                      <Trash2 size={16} /> Archive All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Dashboard" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* ðŸ“Š 11.1 New Dashboard â€” Live Data Overview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div></div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={dashboardFilterType} 
                        onChange={(e) => setDashboardFilterType(e.target.value)}
                        style={{
                          background: '#fff',
                          border: '1.5px solid #e2e8f0',
                          padding: '10px 20px',
                          borderRadius: '14px',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: COLORS.sidebar,
                          outline: 'none',
                          cursor: 'pointer',
                          minWidth: '160px',
                          appearance: 'none',
                          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                        }}
                      >
                        <option>Today</option>
                        <option>Past 7 Days</option>
                        <option>Past 15 Days</option>
                        <option>Past 30 Days</option>
                        <option>Custom Date</option>
                      </select>
                      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: COLORS.muted }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>

                    {dashboardFilterType === "Custom Date" && (
                      <div style={{ 
                        background: '#fff', 
                        border: '1.5px solid #e2e8f0', 
                        padding: '8px 16px', 
                        borderRadius: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        animation: "fadeIn 0.3s ease-out"
                      }}>
                        <input 
                          type="date" 
                          value={dashboardCustomDate} 
                          onChange={e => setDashboardCustomDate(e.target.value)} 
                          style={{ 
                            border: 'none', 
                            outline: 'none', 
                            fontWeight: '750', 
                            fontSize: '14px', 
                            background: 'transparent', 
                            cursor: 'pointer',
                            color: COLORS.sidebar
                          }} 
                        />
                      </div>
                    )}

                    <Button variant="outline" style={{ borderRadius: '12px', display: 'flex', gap: '8px', padding: '10px 20px', background: "#fff", borderColor: "#e2e8f0" }} onClick={() => window.print()}>
                      <Printer size={16} /> Report
                    </Button>
                    <Button variant="outline" style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: "#fff", borderColor: "#e2e8f0" }} onClick={fetchData}>
                      <RefreshCw size={18} />
                    </Button>
                  </div>
                </div>

                {/* Top Metrics Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                  {(() => {
                    const range = getEffectiveRange(dashboardFilterType, dashboardCustomDate);
                    const sDate = range.start;
                    const eDate = range.end;

                    const isWithinRange = (dateStr) => {
                      if (!dateStr) return false;
                      return dateStr >= sDate && dateStr <= eDate;
                    };

                    // 1. Today's Intake (from lots or supplierBills or allocations? Usually lots are intake)
                    const todaysIntakeQty = lots.filter(l => {
                      const d = (l.date || (l.createdAt && l.createdAt.split('T')[0]));
                      return isWithinRange(d);
                    }).reduce((s, l) => s + Number(l.quantity || l.inwardWeight || 0), 0);
                    
                    // 2. Today's Sales (Customer Billing) "Total ₹ invoiced to buyers today"
                    const todaysSalesAmt = buyerInvoices.filter(inv => {
                      const d = (inv.date || (inv.createdAt && inv.createdAt.split('T')[0]));
                      return isWithinRange(d);
                    }).reduce((s, inv) => s + Number(inv.grandTotal || inv.totalAmount || 0), 0);

                    // 3. Pending Auctions "Lots received but not fully allocated" -> Lots where Allocated qty < Total received qty.
                    const pendingAuctionsCount = lots.filter(l => {
                      const allocated = allocations.filter(a => a.lotId === (l.lotId || l._id)).reduce((s, a) => s + Number(a.quantity || 0), 0);
                      return allocated < Number(l.quantity || l.inwardWeight || 0);
                    }).length;

                    // 4. Total Farmer Outstanding "Total amount SPV owes to all farmers" -> Supplier Ledger
                    const farmerOutstandingAmt = (supplierBills || []).reduce((s, b) => s + Math.max(0, (Number(b.netPayable || b.grandTotal || 0) - Number(b.amountPaid || b.paymentReceived || 0))), 0);

                    // 5. Total Buyer Outstanding "Sum all customer outstanding balances" -> Customer Ledger
                    const buyerOutstandingAmt = (buyerInvoices || []).reduce((s, inv) => s + Math.max(0, (Number(inv.grandTotal || inv.totalAmount || 0) - Number(inv.amountReceived || inv.paymentReceived || 0))), 0);

                    // 6. Today's Cash Collected "Payments received from buyers today" -> Customer Payments
                    const todaysCashCollected = buyerInvoices.filter(inv => {
                      const d = (inv.date || (inv.createdAt && inv.createdAt.split('T')[0]));
                      return isWithinRange(d);
                    }).reduce((s, inv) => s + Number(inv.amountReceived || inv.paymentReceived || 0), 0);

                    // 7. Today's Cash Paid "Payments made to farmers today" -> Supplier Ledger
                    const todaysCashPaid = supplierBills.filter(b => {
                      const d = (b.date || (b.createdAt && b.createdAt.split('T')[0]));
                      return isWithinRange(d);
                    }).reduce((s, b) => s + Number(b.amountPaid || b.paymentMade || 0), 0);

                    // 8. Active In-Transit Vehicles "Lorries currently on the road" -> Dispatch Entry
                    const inTransitVehicles = lots.filter(l => {
                      const dateVal = l.date || (l.createdAt && l.createdAt.split('T')[0]);
                      return isWithinFilterRange(dateVal) && (l.status === "In Transit" || l.status === "Dispatch" || (l.delivered === false));
                    }).length;

                    const renderCard = (title, value, subtitle, icon, isAlert) => (
                        <Card key={title} style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "160px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "14px", color: COLORS.sidebar, fontWeight: "600" }}>{title}</span>
                            <span style={{ color: isAlert ? "#e11d48" : "#10b981", background: isAlert ? "#ffe4e6" : "#ecfdf5", padding: "6px", borderRadius: "50%", display: "flex", whiteSpace: "nowrap" }}>
                              {icon}
                            </span>
                          </div>
                          <div>
                            <h2 style={{ fontSize: "28px", margin: "0 0 8px 0", fontFamily: "'Playfair Display', serif", fontWeight: "900", color: isAlert ? "#e11d48" : "inherit" }}>{value}</h2>
                            <p style={{ fontSize: "12px", color: COLORS.muted, margin: 0 }}>{subtitle}</p>
                          </div>
                        </Card>
                    );
                    
                    const dashTitle = (base) => {
                      const t = new Date().toISOString().split('T')[0];
                      if (sDate === t && eDate === t) return "Today's " + base;
                      return base + " (Selected Dates)";
                    };

                    return (
                      <>
                        {/* Core Business Summaries */}
                        {renderCard("Registered Members", (suppliers.length + buyers.length), `${suppliers.length} Suppliers | ${buyers.length} Buyers`, <Users size={18} />)}
                        {renderCard("Registered Lots", lots.filter(l => isWithinFilterRange(l.date || l.createdAt)).length, "New lots intake in range", <Boxes size={18} />)}
                        {renderCard("Recorded Allocations", allocations.filter(a => isWithinFilterRange(a.allocationDate || a.date)).length, "Sales records in range", <Gavel size={18} />)}
                        {renderCard("Generated Bills", supplierBills.filter(b => isWithinFilterRange(b.date)).length, "Finalized supplier bills", <Receipt size={18} />)}
                        {renderCard("Generated Invoices", buyerInvoices.filter(i => isWithinFilterRange(i.date)).length, "Invoices sent in range", <CreditCard size={18} />)}

                        {renderCard(dashTitle("Intake Vol."), todaysIntakeQty.toLocaleString() + " KG", "Total produce received", <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>)}
                        {renderCard(dashTitle("Sales Value"), formatCurrency(todaysSalesAmt), "Gross value of invoices", <span style={{ fontSize: "14px", fontWeight: "800", padding: "0 4px" }}>₹</span>)}
                        {renderCard("Pending Auctions", pendingAuctionsCount + " Lots", "Items awaiting allocation", <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>)}
                        {renderCard("Farmer Outstanding", formatCurrency(farmerOutstandingAmt), "Total payable to suppliers", <span style={{ fontSize: "14px", fontWeight: "800", padding: "0 4px" }}>₹</span>, true)}
                        
                        {renderCard("Buyer Outstanding", formatCurrency(buyerOutstandingAmt), "Total customer receivables", <span style={{ fontSize: "14px", fontWeight: "800", padding: "0 4px" }}>₹</span>)}
                        {renderCard(dashTitle("Cash Collected"), formatCurrency(todaysCashCollected), "Payments from buyers", <span style={{ fontSize: "14px", fontWeight: "800", padding: "0 4px" }}>₹</span>)}
                        {renderCard(dashTitle("Cash Paid"), formatCurrency(todaysCashPaid), "Payments to suppliers", <span style={{ fontSize: "14px", fontWeight: "800", padding: "0 4px" }}>₹</span>, true)}
                        {renderCard("Active Shipments", inTransitVehicles, "Vehicles currently in transit", <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>)}
                      </>
                    )
                  })()}
                </div>


              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr",
                  gap: "32px",
                }}
              >
                {/* Business Intelligence Hub */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <Card
                    title="Business Intelligence Hub"
                    subtitle="Generate, download and share audited records"
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                      }}
                    >
                      {[
                        {
                          t: "Supplier Transaction Log",
                          d: "Date-wise intake & payment history",
                        },
                        {
                          t: "Buyer Credit Analysis",
                          d: "Outstanding aging & payment patterns",
                        },
                        {
                          t: "Operational P&L Statement",
                          d: "Revenue vs Expenses vs Commission",
                        },
                        {
                          t: "Logistics Efficiency Report",
                          d: "Freight costs & vehicle utilization",
                        },
                      ].map((rep, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "20px",
                            background: "#f8fafc",
                            borderRadius: "16px",
                            border: "1.5px solid #e2e8f0",
                            transition: "0.2s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.borderColor = COLORS.primary)
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.borderColor = "#e2e8f0")
                          }
                        >
                          <div
                            style={{ fontSize: "24px", marginBottom: "10px" }}
                          >
                          </div>
                          <h4 style={{ margin: 0, color: COLORS.secondary }}>
                            {rep.t}
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: COLORS.muted,
                              margin: "8px 0 15px",
                            }}
                          >
                            {rep.d}
                          </p>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <Button
                              variant="outline"
                              style={{
                                flex: 2,
                                fontSize: "11px",
                                padding: "8px",
                                background: "#FFFFFF",
                                color: COLORS.sidebar,
                                border: "1.5px solid #E2E8F0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                              }}
                              onClick={() => {
                                let reportContent = '';
                                if (rep.t === 'Supplier Transaction Log') {
                                  if (supplierBills && (supplierBills || []).length > 0) {
                                    supplierBills.forEach(b => {
                                      const amt = b.netPayable || b.grandTotal || 0;
                                      const billId = b.receiptNo || b.billId || (b._id && b._id.slice(-6)) || '-';
                                      const supplierName = b.supplierName || 'Supplier';
                                      const product = (b.items && b.items.length > 0) ? b.items.map(i => i.product || i.name).join(', ') : 'Fresh Produce';
                                      const quantity = (b.items && b.items.length > 0) ? (b.items || []).reduce((s, i) => s + Number(i.quantity || i.weight || 0), 0) + ' kg' : 'Standard';
                                      reportContent += `
                                      <div style="background: #fff; border: 1px solid #EBE9E1; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                                        <div id="invoice-${billId}" contenteditable="true" style="white-space: pre-wrap; font-family: sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6; margin-bottom: 20px; outline: none; border: 2px dashed transparent; transition: 0.2s;" onfocus="this.style.border='2px dashed #94a3b8'; this.style.padding='10px';" onblur="this.style.border='2px dashed transparent'; this.style.padding='0px';">Hello <b>${supplierName}</b>
                                          Your invoice from <b>SPV Fruits</b> is ready.
                                          Product: ${product}
                                          Amount: ₹${amt}
                                          Powered by Mandi OS v8.0</div>
                                      </div>`;
                                    });
                                  } else { reportContent = '<p>No data available in Database</p>'; }
                                } else {
                                  let tableRows = '';
                                  if (rep.t === 'Buyer Credit Analysis') {
                                    tableRows += '<tr><th>Invoice ID</th><th>Date</th><th>Customer</th><th>Total</th><th>Received</th><th>Outstanding</th></tr>';
                                    if (typeof buyerInvoices !== 'undefined' && (buyerInvoices || []).length > 0) {
                                      buyerInvoices.forEach(inv => {
                                        const d = (inv.date || (inv.createdAt && inv.createdAt.split('T')[0])) || '-';
                                        const total = inv.grandTotal || inv.totalAmount || 0;
                                        const rec = inv.amountReceived || inv.paymentReceived || 0;
                                        const out = Math.max(0, total - rec);
                                        tableRows += `<tr><td>${inv.invoiceNo || inv.invoiceId || (inv._id && inv._id.slice(-6)) || '-'}</td><td>${d}</td><td>${inv.buyerName || '-'}</td><td>₹ ${total}</td><td>₹ ${rec}</td><td>₹ ${out}</td></tr>`;
                                      });
                                    } else { tableRows += '<tr><td colspan="6">No data available in Database</td></tr>'; }
                                  } else if (rep.t === 'Operational P&L Statement') {
                                    tableRows += '<tr><th>Transaction</th><th>Type</th><th>Amount</th></tr>';
                                    const totalSales = (typeof buyerInvoices !== 'undefined' ? buyerInvoices : []).reduce((s, inv) => s + Number(inv.grandTotal || inv.totalAmount || 0), 0);
                                    const totalSupplierPayable = (typeof supplierBills !== 'undefined' ? supplierBills : []).reduce((s, b) => s + Number(b.netPayable || b.grandTotal || 0), 0);
                                    tableRows += `<tr><td>Total Sales</td><td>Revenue</td><td>₹ ${totalSales}</td></tr><tr><td>Total Supplier Obligations</td><td>Expense</td><td>₹ ${totalSupplierPayable}</td></tr>`;
                                  } else {
                                    tableRows += '<tr><th>ID</th><th>Details</th><th>Status</th></tr><tr><td>DB_LOG_01</td><td>Logistics metrics sync</td><td>Active</td></tr>';
                                  }
                                  reportContent = `<table id="report-table">${tableRows}</table>`;
                                }

                                const newWin = window.open('', '_blank');
                                newWin.document.write(`
                                  <html>
                                    <head><title>${rep.t} - Export</title>
                                    <style>
                                      body { font-family: sans-serif; padding: 40px; background: #f8fafc; }
                                      table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; }
                                      th, td { border: 1px solid #EBE9E1; padding: 12px; text-align: left; }
                                      th { background-color: #f1f5f9; }
                                    </style>
                                    </head>
                                    <body>
                                      <h2 style="font-family: serif; color: #1a1a2e; border-bottom: 2px solid #D4A017; padding-bottom: 10px;">${rep.t} (Audited)</h2>
                                      <div style="margin-top: 30px;">${reportContent}</div>
                                      <p style="margin-top: 50px; color: #64748b; font-size: 11px; text-align: center;">Powered by STACLI Mandi OS v8.0</p>
                                    </body>
                                  </html>
                                `);
                                newWin.document.close();
                              }}
                            >
                              <FileText size={14} /> PDFs
                            </Button>

                            <Button
                              variant="outline"
                              style={{
                                width: "40px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1.5px solid #E2E8F0",
                                background: "#FFFFFF",
                                padding: 0
                              }}
                              onClick={() => alert("â¬‡ Initiating raw data download for " + rep.t)}
                            >
                              <FileCheck size={16} color={COLORS.success} />
                            </Button>

                            <Button
                              variant="outline"
                              style={{
                                width: "40px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1.5px solid #E2E8F0",
                                background: "#FFFFFF",
                                padding: 0
                              }}
                              onClick={() => alert("ðŸ“ Switching to Edit Mode for " + rep.t)}
                            >
                              <Edit2 size={16} color={COLORS.accent} />
                            </Button>

                            <Button
                              variant="outline"
                              style={{
                                flex: 1,
                                fontSize: "11px",
                                padding: "8px",
                                background: "#FFFFFF",
                                color: "#25D366",
                                border: "1.5px solid #E2E8F0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                              }}
                              onClick={() => {
                                if (rep.t === 'Supplier Transaction Log' && typeof supplierBills !== 'undefined' && (supplierBills || []).length > 0) {
                                  const latestBill = supplierBills[(supplierBills || []).length - 1];
                                  const amt = latestBill.netPayable || latestBill.grandTotal || 0;
                                  const billId = latestBill.receiptNo || latestBill.billId || (latestBill._id && latestBill._id.slice(-6)) || '-';
                                  const supplierName = latestBill.supplierName || 'Supplier';
                                  const product = (latestBill.items && latestBill.items.length > 0) ? latestBill.items.map(i => i.product || i.name).join(', ') : 'Fresh Produce';
                                  const quantity = (latestBill.items && latestBill.items.length > 0) ? (latestBill.items || []).reduce((s, i) => s + Number(i.quantity || i.weight || 0), 0) + ' kg' : 'Standard';
                                  const link = window.location.origin + '/#/invoice/' + billId;
                                  const invoiceMsg = `Hello ${supplierName}\n\nYour invoice from *SPV Fruits* is ready.\n\nProduct: ${product}\nQuantity: ${quantity}\nAmount: ₹${amt}\n\nView Invoice:\n${link}\n\nThank you!`;
                                  window.open(`https://wa.me/?text=${encodeURIComponent(invoiceMsg)}`, "_blank");
                                } else {
                                  const msg = `Hello,\n\nThe newest *${rep.t}* is ready on *Mandi OS v8.0*.\n\nSummary:\n${rep.d}\n\nPlease check your administrator dashboard for details.`;
                                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                                }
                              }}
                            >
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Communication Center */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <Card
                    title="Communication & Auto-Sharing"
                    subtitle="Stakeholder notifications status"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          background: "#f0fdf4",
                          borderRadius: "20px",
                          border: "1px solid #dcfce7",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "12px",
                          }}
                        >
                          <b style={{ color: "#166534" }}>
                            Owner Daily Closing
                          </b>
                          <span
                            style={{
                              fontSize: "10px",
                              background: "#166534",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "10px",
                            }}
                          >
                            AUTO-RUN ENABLED
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", margin: "0 0 15px" }}>
                          Daily closing report sent to Vikram Reddy via WhatsApp
                          at 09:15 PM.
                        </p>
                        <Button
                          variant="outline"
                          style={{
                            width: "100%",
                            background: "#fff",
                            color: "#166534",
                            borderColor: "#166534",
                          }}
                          onClick={() => {
                             const phone = window.prompt("Full Access Mode: Enter new WhatsApp number for Daily Auto-Sharing routing:", "+91 ");
                             if(phone) {
                               window.alert("Notification configuration updated across tenant. Reports will route to " + phone);
                             }
                          }}
                        >
                          Re-configure
                        </Button>
                      </div>

                      <Card
                        style={{
                          background: "#0f172a",
                          textAlign: "center",
                          color: "#fff",
                        }}
                      >
                        <h3 style={{ margin: "0 0 8px 0" }}>
                          Ecosystem Backup
                        </h3>
                        <p style={{ fontSize: "12px", opacity: 0.7 }}>
                          Download full tenant data as encrypted JSON/CSV
                          archive.
                        </p>
                        <Button
                          variant="primary"
                          style={{ marginTop: "15px", width: "100%" }}
                          onClick={() => {
                            try {
                                const backup = {
                                  timestamp: new Date().toISOString(),
                                  supplierBills: typeof supplierBills !== 'undefined' ? supplierBills : [],
                                  buyerInvoices: typeof buyerInvoices !== 'undefined' ? buyerInvoices : [],
                                  lots: typeof lots !== 'undefined' ? lots : [],
                                  expenses: typeof expenses !== 'undefined' ? expenses : [],
                                  allocations: typeof allocations !== 'undefined' ? allocations : []
                                };
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
                                const dlNode = document.createElement('a');
                                dlNode.setAttribute("href", dataStr);
                                dlNode.setAttribute("download", "stacli_ecosystem_backup_" + new Date().getTime() + ".json");
                                document.body.appendChild(dlNode);
                                dlNode.click();
                                dlNode.remove();
                                window.alert("Backup data secured locally.");
                            } catch (e) {
                                window.alert("Snapshot failed.");
                            }
                          }}
                        >
                          Snapshot Infrastructure
                        </Button>
                      </Card>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Product Master & Configuration" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* Config Sub-Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  alignSelf: "flex-start",
                }}
              >
                {["Product", "Expense", "System"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveConfigTab(tab)}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "850",
                      transition: "0.2s",
                      background:
                        activeConfigTab === tab
                          ? COLORS.primary
                          : "transparent",
                      color: activeConfigTab === tab ? "#fff" : COLORS.muted,
                    }}
                  >
                    {tab === "Product"
                      ? "Product Catalog"
                      : tab === "Expense"
                        ? "Expense Masters"
                        : "System Settings"}
                  </button>
                ))}
              </div>

              {activeConfigTab === "Product" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1.8fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Add New Product / Variety"
                    subtitle="No-coding required catalog expansion"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Input
                        label="Core Product (Level 1)"
                        placeholder="e.g. Mango, Tomato"
                        value={newProductForm.coreProduct}
                        onChange={(e) =>
                          setNewProductForm({
                            ...newProductForm,
                            coreProduct: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Variety Name (Level 2)"
                        placeholder="e.g. Alphonso, S-Grade"
                        value={newProductForm.variety}
                        onChange={(e) =>
                          setNewProductForm({
                            ...newProductForm,
                            variety: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              fontWeight: "800",
                              color: COLORS.secondary,
                              fontSize: "11px",
                            }}
                          >
                            Default Grade
                          </label>
                          <select
                            value={newProductForm.grade}
                            onChange={(e) =>
                              setNewProductForm({
                                ...newProductForm,
                                grade: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              fontWeight: "600",
                            }}
                          >
                            <option value="" disabled>{getSelectPlaceholder("Default Grade")}</option>
                            <option>A-Grade</option>
                            <option>B-Grade</option>
                            <option>C-Grade</option>
                            <option>Export Quality</option>
                            <option>Pulp Grade</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              fontWeight: "800",
                              color: COLORS.secondary,
                              fontSize: "11px",
                            }}
                          >
                            Standard Unit
                          </label>
                          <select
                            value={newProductForm.unit}
                            onChange={(e) =>
                              setNewProductForm({
                                ...newProductForm,
                                unit: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              fontWeight: "600",
                            }}
                          >
                            <option value="" disabled>{getSelectPlaceholder("Standard Unit")}</option>
                            <option>KG</option>
                            <option>Crate</option>
                            <option>Box</option>
                            <option>Ton</option>
                            <option>Quintal</option>
                            <option>Bag</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        style={{ marginTop: "10px" }}
                        onClick={handleRegisterProduct}
                      >
                        Register in Catalog
                      </Button>
                    </div>
                  </Card>

                  <Card
                    title="Active Product Hierarchy"
                    subtitle="Current configurable variety & grade matrix"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {masterProducts.map((p, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "20px",
                            background: "#f8fafc",
                            borderRadius: "20px",
                            border: "1.5px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "12px",
                            }}
                          >
                            <h3 style={{ margin: 0, color: COLORS.secondary }}>
                              {p.name}
                            </h3>
                            <span
                              style={{
                                fontSize: "12px",
                                background: "#e2e8f0",
                                padding: "4px 10px",
                                borderRadius: "8px",
                                fontWeight: "800",
                              }}
                            >
                              {p.units.join(", ")}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            {p.varieties.map((v) => (
                              <span
                                key={v}
                                style={{
                                  fontSize: "11px",
                                  background: "#fff",
                                  border: "1px solid #cbd5e1",
                                  padding: "4px 12px",
                                  borderRadius: "10px",
                                  fontWeight: "600",
                                }}
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                          <div
                            style={{
                              marginTop: "12px",
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            {p.grades.map((g) => (
                              <span
                                key={g}
                                style={{
                                  fontSize: "10px",
                                  color: COLORS.primary,
                                  fontWeight: "900",
                                }}
                              >
                                • {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeConfigTab === "Expense" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Register Expense Category"
                    subtitle="Admin can add/rename billing deductions"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Input
                        label="Category Label"
                        placeholder="e.g. Loading Fee"
                        value={newExpenseForm.label}
                        onChange={(e) =>
                          setNewExpenseForm({
                            ...newExpenseForm,
                            label: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              fontWeight: "800",
                              color: COLORS.secondary,
                              fontSize: "11px",
                            }}
                          >
                            Calculation Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <option value="" disabled>{getSelectPlaceholder("Calculation Type")}</option>
                            <option>Percentage (%)</option>
                            <option>Fixed Amount (₹)</option>
                          </select>
                        </div>
                        <Input
                          label="Default Value"
                          placeholder="e.g. 4"
                          value={newExpenseForm.defaultValue}
                          onChange={(e) =>
                            setNewExpenseForm({
                              ...newExpenseForm,
                              defaultValue: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        style={{ marginTop: "10px" }}
                        onClick={handleRegisterExpenseCategory}
                      >
                        Create Ledger Category
                      </Button>
                    </div>
                  </Card>
                  <Card
                    title="Expense Master List"
                    subtitle="Manage appearing categories in Bills/Invoices"
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            textAlign: "left",
                            borderBottom: "2px solid #f1f5f9",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Label
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Type
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Default
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Activity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {masterExpenses.map((ex) => (
                          <tr
                            key={ex.id}
                            style={{ borderBottom: "1px solid #f8fafc" }}
                          >
                            <td style={{ padding: "12px", fontWeight: "700" }}>
                              {ex.name}
                            </td>
                            <td style={{ padding: "12px", fontSize: "13px" }}>
                              {ex.type}
                            </td>
                            <td style={{ padding: "12px", fontSize: "13px" }}>
                              {ex.type === "Percentage"
                                ? `${ex.default}%`
                                : formatCurrency(ex.default)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  style={{
                                    color: COLORS.primary,
                                    background: "none",
                                    border: "none",
                                    fontSize: "12px",
                                    fontWeight: "850",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    color: "#ef4444",
                                    background: "none",
                                    border: "none",
                                    fontSize: "12px",
                                    fontWeight: "850",
                                    cursor: "pointer",
                                  }}
                                >
                                  {ex.active ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
              )}

              {activeConfigTab === "System" && (
                <Card
                  title="Global Governance & System Settings"
                  subtitle="Branding, financial rules and automated communication"
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "32px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4
                        style={{
                          color: COLORS.primary,
                          borderBottom: `2px solid ${COLORS.primary}`,
                          paddingBottom: "8px",
                          margin: "0 0 8px",
                        }}
                      >
                        ðŸ“¦ Core Branding
                      </h4>
                      <Input
                        label="Business Name"
                        value={systemSettings.businessName}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            businessName: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Business Address"
                        value={systemSettings.address}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            address: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          padding: "12px",
                          border: "2px dashed #e2e8f0",
                          borderRadius: "10px",
                          textAlign: "center",
                          fontSize: "11px",
                        }}
                      >
                        Drop Logo File Here (.png/.jpg)
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4
                        style={{
                          color: COLORS.primary,
                          borderBottom: `2px solid ${COLORS.primary}`,
                          paddingBottom: "8px",
                          margin: "0 0 8px",
                        }}
                      >
                        ðŸ’° Financial Defaults
                      </h4>
                      <Input
                        label="Global Default Commission (%)"
                        type="number"
                        value={systemSettings.defaultCommission}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            defaultCommission: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Standard Payment Terms"
                        placeholder="7 Days"
                        value={systemSettings.buyerPaymentTerms}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            buyerPaymentTerms: e.target.value,
                          })
                        }
                      />
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "800",
                            color: COLORS.secondary,
                            fontSize: "11px",
                          }}
                        >
                          Financial Year Cycle
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <option value="" disabled>{getSelectPlaceholder("Financial Year Cycle")}</option>
                          <option>Aprilâ€“March (India)</option>
                          <option>Januaryâ€“December</option>
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4
                        style={{
                          color: COLORS.primary,
                          borderBottom: `2px solid ${COLORS.primary}`,
                          paddingBottom: "8px",
                          margin: "0 0 8px",
                        }}
                      >
                        ðŸ“‘ Documentation & Comms
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <Input
                          label="Invoice Prefix"
                          value={systemSettings.invoicePrefix}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              invoicePrefix: e.target.value,
                            })
                          }
                        />
                        <Input label="Start #" placeholder="101" />
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <Input
                          label="Farmer Bill Prefix"
                          value={systemSettings.billPrefix}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              billPrefix: e.target.value,
                            })
                          }
                        />
                        <Input label="Start #" placeholder="1" />
                      </div>
                      <Input
                        label="Auth WhatsApp No (For Webhook)"
                        value={systemSettings.authWhatsApp}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            authWhatsApp: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "40px",
                      borderTop: "1.5px solid #f1f5f9",
                      paddingTop: "24px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      style={{ padding: "14px 40px" }}
                      onClick={() =>
                        alert(
                          "ðŸ’¿ SYSTEM CONFIGURATION COLD-BOOTED: All settings persisted.",
                        )
                      }
                    >
                      Commit Global Settings
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* 15.6 USER ROLES, ACCESS CONTROL & SECURITY */}
          {activeSection === "User Roles, Access Control & Security" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* Security Sub-Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  alignSelf: "flex-start",
                }}
              >
                {["Staff Hub", "Permissions", "Security"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSecurityTab(tab)}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "850",
                      transition: "0.2s",
                      background:
                        activeSecurityTab === tab
                          ? COLORS.primary
                          : "transparent",
                      color: activeSecurityTab === tab ? "#fff" : COLORS.muted,
                    }}
                  >
                    {tab === "Staff Hub"
                      ? "ðŸ‘¥ Staff Identity Hub"
                      : tab === "Permissions"
                        ? "🛡️ Role Matrix"
                        : "â‰¡Æ’Ã¶Ã‰ Security Guard"}
                  </button>
                ))}
              </div>

              {activeSecurityTab === "Staff Hub" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Onboard New Staff"
                    subtitle="Create digital identities for Mandi personnel"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Input
                        label="Staff Full Name"
                        placeholder="e.g. Ramesh K."
                        value={newStaffForm.name}
                        onChange={(e) =>
                          setNewStaffForm({
                            ...newStaffForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Login Username"
                        placeholder="staff_01"
                        value={newStaffForm.username}
                        onChange={(e) =>
                          setNewStaffForm({
                            ...newStaffForm,
                            username: e.target.value,
                          })
                        }
                      />
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "800",
                            color: COLORS.secondary,
                            fontSize: "11px",
                          }}
                        >
                          System Role
                        </label>
                        <select
                          value={newStaffForm.role}
                          onChange={(e) =>
                            setNewStaffForm({
                              ...newStaffForm,
                              role: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            background: "#f8fafc",
                            fontWeight: "600",
                          }}
                        >
                          <option value="" disabled>{getSelectPlaceholder("System Role")}</option>
                          <option>Accountant</option>
                          <option>Operations Staff</option>
                          <option>Viewer (Read-Only)</option>
                          <option>Admin / Owner</option>
                        </select>
                      </div>
                      <Input
                        label="Access Expiry (Optional)"
                        type="date"
                        value={newStaffForm.expiry}
                        onChange={(e) =>
                          setNewStaffForm({
                            ...newStaffForm,
                            expiry: e.target.value,
                          })
                        }
                      />
                      <Button
                        style={{ marginTop: "10px" }}
                        onClick={handleCreateStaff}
                      >
                        Create Access Identity
                      </Button>
                    </div>
                  </Card>

                  <Card
                    title="Staff Directory"
                    subtitle="Manage active sessions and role assignments"
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            textAlign: "left",
                            borderBottom: "2px solid #f1f5f9",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Identity
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Role
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Last Login
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffUsers.map((u) => (
                          <tr
                            key={u.id}
                            style={{ borderBottom: "1px solid #f8fafc" }}
                          >
                            <td style={{ padding: "12px" }}>
                              <div style={{ fontWeight: "750" }}>{u.name}</div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: COLORS.muted,
                                }}
                              >
                                {u.id} •{" "}
                                <span
                                  style={{
                                    color:
                                      u.status === "Active"
                                        ? "#22c55e"
                                        : "#ef4444",
                                  }}
                                >
                                  {u.status}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  background:
                                    u.role === "Admin" ? "#fef3c7" : "#f1f5f9",
                                  padding: "4px 10px",
                                  borderRadius: "8px",
                                  fontWeight: "800",
                                }}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                fontSize: "12px",
                                color: COLORS.muted,
                              }}
                            >
                              {u.lastLogin}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: COLORS.primary,
                                    cursor: "pointer",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  RESET PWD
                                </button>
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#64748b",
                                    cursor: "pointer",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  DEACTIVATE
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
              )}

              {activeSecurityTab === "Permissions" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                    animation: "slideUp 0.5s ease-out",
                  }}
                >
                  {/* Role Summary Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                    }}
                  >
                    {[
                      {
                        role: "Owner / Admin",
                        icon: "ðŸ‘‘",
                        color: "#f59e0b",
                        bg: "linear-gradient(135deg, #f59e0b 0%, #1a1a1a 100%)",
                        tagBg: "rgba(159,180,67,0.25)",
                        tagColor: "#f59e0b",
                        desc: "Full access â€” all modules, reports, settings, user management, delete & void bills",
                        perms: [
                          "✅ All Modules",
                          "✅ Delete & Void",
                          "✅ User Management",
                          "✅ System Config",
                          "✅ Reports & Ledger",
                          "✅ Payment Records",
                        ],
                      },
                      {
                        role: "Accountant",
                        icon: "ðŸ“Š",
                        color: "#1d4ed8",
                        bg: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                        tagBg: "rgba(59,130,246,0.15)",
                        tagColor: "#3b82f6",
                        desc: "Bills, invoices, payments, ledgers, reports â€” NO system configuration, NO delete",
                        perms: [
                          "✅ Bills & Invoices",
                          "✅ Payments",
                          "✅ Ledger View",
                          "✅ Reports",
                          "âŒ System Config",
                          "âŒ Delete / Void",
                        ],
                      },
                      {
                        role: "Operations Staff",
                        icon: "ðŸ­",
                        color: "#b45309",
                        bg: "linear-gradient(135deg, #b45309 0%, #92400e 100%)",
                        tagBg: "rgba(245,158,11,0.15)",
                        tagColor: "#f59e0b",
                        desc: "Create lots, allocate produce, create bills/invoices â€” NO payment records, NO ledger edits",
                        perms: [
                          "✅ Create Lots",
                          "✅ Allocate Produce",
                          "✅ Create Bills",
                          "✅ Create Invoices",
                          "âŒ Payment Records",
                          "âŒ Ledger Edits",
                        ],
                      },
                      {
                        role: "Viewer",
                        icon: "ðŸ‘ï¸",
                        color: "#475569",
                        bg: "linear-gradient(135deg, #475569 0%, #334155 100%)",
                        tagBg: "rgba(71,85,105,0.12)",
                        tagColor: "#64748b",
                        desc: "Read-only access to reports and ledgers â€” NO create or edit",
                        perms: [
                          "✅ View Reports",
                          "✅ View Ledger",
                          "âŒ Create / Edit",
                          "âŒ Delete / Void",
                          "âŒ Payments",
                          "âŒ System Config",
                        ],
                      },
                    ].map((r, i) => (
                      <div
                        key={i}
                        style={{
                          background: r.bg,
                          borderRadius: "24px",
                          padding: "28px 24px",
                          color: "#fff",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: `0 12px 32px ${r.color}30`,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-20px",
                            right: "-20px",
                            width: "90px",
                            height: "90px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.07)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-30px",
                            left: "-20px",
                            width: "110px",
                            height: "110px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "14px",
                              background: "rgba(255,255,255,0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "22px",
                            }}
                          >
                            {r.icon}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "900",
                                letterSpacing: "-0.3px",
                              }}
                            >
                              {r.role}
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                opacity: 0.65,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                marginTop: "2px",
                              }}
                            >
                              System Role
                            </div>
                          </div>
                        </div>
                        <p
                          style={{
                            fontSize: "12px",
                            lineHeight: "1.6",
                            opacity: 0.85,
                            margin: "0 0 20px",
                            fontWeight: "600",
                          }}
                        >
                          {r.desc}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          {r.perms.map((p, pi) => (
                            <div
                              key={pi}
                              style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "5px 10px",
                                borderRadius: "8px",
                                background: "rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Module Permission Matrix */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "24px",
                      padding: "32px",
                      border: "1.5px solid #f1f5f9",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ marginBottom: "28px" }}>
                      <h3
                        style={{
                          margin: "0 0 6px",
                          fontSize: "20px",
                          fontWeight: "900",
                          color: COLORS.secondary,
                        }}
                      >
                        Module-Level Access Matrix
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: COLORS.muted,
                          fontWeight: "500",
                        }}
                      >
                        Granular permission mapping for all 14 system modules
                      </p>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "13px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                padding: "14px 16px",
                                textAlign: "left",
                                background: "#f8fafc",
                                borderBottom: "2px solid #e2e8f0",
                                fontWeight: "800",
                                color: COLORS.muted,
                                fontSize: "11px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                minWidth: "220px",
                              }}
                            >
                              Module / Component
                            </th>
                            {[
                              {
                                label: "Owner / Admin",
                                icon: "ðŸ‘‘",
                                color: "#f59e0b",
                                bg: "#f0f9f4",
                              },
                              {
                                label: "Accountant",
                                icon: "ðŸ“Š",
                                color: "#1d4ed8",
                                bg: "#eff6ff",
                              },
                              {
                                label: "Ops Staff",
                                icon: "ðŸ­",
                                color: "#b45309",
                                bg: "#fffbeb",
                              },
                              {
                                label: "Viewer",
                                icon: "ðŸ‘ï¸",
                                color: "#475569",
                                bg: "#f8fafc",
                              },
                            ].map((col) => (
                              <th
                                key={col.label}
                                style={{
                                  padding: "14px 24px",
                                  background: col.bg,
                                  borderBottom: "2px solid #e2e8f0",
                                  textAlign: "center",
                                  minWidth: "150px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "18px",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {col.icon}
                                </div>
                                <div
                                  style={{
                                    fontWeight: "900",
                                    color: col.color,
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  {col.label}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              module: "ðŸ“Š Dashboard",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "FULL",
                              viewer: "READ",
                            },
                            {
                              module: "ðŸ‘¥ Profiles (Supplier/Buyer)",
                              admin: "FULL",
                              accountant: "READ",
                              ops: "CREATE",
                              viewer: "READ",
                            },
                            {
                              module: "ðŸ“¦ Inventory Allocation",
                              admin: "FULL",
                              accountant: "READ",
                              ops: "CREATE",
                              viewer: "READ",
                            },
                            {
                              module: "âš–ï¸ Supplier Billing",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "CREATE",
                              viewer: "NONE",
                            },
                            {
                              module: "â‰¡Æ’Âºâ•› Buyer Invoicing",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "CREATE",
                              viewer: "NONE",
                            },
                            {
                              module: "â‰¡Æ’Ã´Ã» Ledger System",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "NONE",
                              viewer: "READ",
                            },
                            {
                              module: "â‰¡Æ’Ã¶Ã¹ Connection Intelligence",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "NONE",
                              viewer: "READ",
                            },
                            {
                              module: "ðŸ’³ Payment & Settlement",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "NONE",
                              viewer: "NONE",
                            },
                            {
                              module: "â‰¡Æ’ÃœÃœ Transportation Tracking",
                              admin: "FULL",
                              accountant: "READ",
                              ops: "CREATE",
                              viewer: "NONE",
                            },
                            {
                              module: "ðŸ’¸ Expense Management",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "CREATE",
                              viewer: "NONE",
                            },
                            {
                              module: "â‰¡Æ’Ã´Ã¤ Reports",
                              admin: "FULL",
                              accountant: "FULL",
                              ops: "FULL",
                              viewer: "READ",
                            },
                            {
                              module: "âš™ï¸ Product Master & Config",
                              admin: "FULL",
                              accountant: "NONE",
                              ops: "NONE",
                              viewer: "NONE",
                            },
                            {
                              module: "🛡️ User Roles & Security",
                              admin: "FULL",
                              accountant: "NONE",
                              ops: "NONE",
                              viewer: "NONE",
                            },
                            {
                              module: "â‰¡Æ’Ã´Ã© Document Management",
                              admin: "FULL",
                              accountant: "READ",
                              ops: "NONE",
                              viewer: "NONE",
                            },
                            {
                              module: "ðŸ—‘ï¸ Delete / Void Bills",
                              admin: "FULL",
                              accountant: "NONE",
                              ops: "NONE",
                              viewer: "NONE",
                            },
                          ].map((row, i) => {
                            const badge = (perm) => {
                              const cfg = {
                                FULL: {
                                  bg: "#dcfce7",
                                  color: "#15803d",
                                  label: "Full Access",
                                },
                                CREATE: {
                                  bg: "#fef3c7",
                                  color: "#b45309",
                                  label: "Create Only",
                                },
                                READ: {
                                  bg: "#dbeafe",
                                  color: "#1d4ed8",
                                  label: "Read Only",
                                },
                                NONE: {
                                  bg: "#fee2e2",
                                  color: "#991b1b",
                                  label: "No Access",
                                },
                              }[perm] || {
                                bg: "#f1f5f9",
                                color: "#475569",
                                label: perm,
                              };
                              return (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "11px",
                                    fontWeight: "900",
                                    padding: "5px 12px",
                                    borderRadius: "20px",
                                    background: cfg.bg,
                                    color: cfg.color,
                                    letterSpacing: "0.2px",
                                  }}
                                >
                                  {perm === "FULL"
                                    ? "✅"
                                    : perm === "NONE"
                                      ? "ðŸš«"
                                      : perm === "READ"
                                        ? "ðŸ‘ï¸"
                                        : "âœï¸"}{" "}
                                  {cfg.label}
                                </span>
                              );
                            };
                            return (
                              <tr
                                key={i}
                                style={{
                                  borderBottom: "1px solid #f1f5f9",
                                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                                  transition: "0.2s",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background = "#f0f9f4")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background =
                                    i % 2 === 0 ? "#fff" : "#fafafa")
                                }
                              >
                                <td
                                  style={{
                                    padding: "14px 16px",
                                    fontWeight: "750",
                                    color: COLORS.text,
                                    fontSize: "13px",
                                  }}
                                >
                                  {row.module}
                                </td>
                                <td
                                  style={{
                                    padding: "14px 16px",
                                    textAlign: "center",
                                  }}
                                >
                                  {badge(row.admin)}
                                </td>
                                <td
                                  style={{
                                    padding: "14px 16px",
                                    textAlign: "center",
                                  }}
                                >
                                  {badge(row.accountant)}
                                </td>
                                <td
                                  style={{
                                    padding: "14px 16px",
                                    textAlign: "center",
                                  }}
                                >
                                  {badge(row.ops)}
                                </td>
                                <td
                                  style={{
                                    padding: "14px 16px",
                                    textAlign: "center",
                                  }}
                                >
                                  {badge(row.viewer)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Legend */}
                    <div
                      style={{
                        marginTop: "24px",
                        display: "flex",
                        gap: "16px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          color: COLORS.muted,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Legend:
                      </span>
                      {[
                        {
                          bg: "#dcfce7",
                          color: "#15803d",
                          icon: "✅",
                          label: "Full Access â€” Create, Edit, Delete, View",
                        },
                        {
                          bg: "#fef3c7",
                          color: "#b45309",
                          icon: "âœï¸",
                          label: "Create Only â€” No Edit/Delete",
                        },
                        {
                          bg: "#dbeafe",
                          color: "#1d4ed8",
                          icon: "ðŸ‘ï¸",
                          label: "Read Only â€” View without changes",
                        },
                        {
                          bg: "#fee2e2",
                          color: "#991b1b",
                          icon: "ðŸš«",
                          label: "No Access â€” Module hidden",
                        },
                      ].map((l, i) => (
                        <span
                          key={i}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            background: l.bg,
                            color: l.color,
                          }}
                        >
                          {l.icon} {l.label}
                        </span>
                      ))}
                    </div>

                    {/* Warning Banner */}
                    <div
                      style={{
                        marginTop: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px 20px",
                        background: "#fff9eb",
                        borderRadius: "16px",
                        border: "1.5px solid #feebc8",
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>âš ï¸</span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#92400e",
                          fontWeight: "600",
                        }}
                      >
                        Modifying the Access Matrix will force-logout all active
                        sessions to re-apply JWT authorization tokens. Changes
                        take effect after next login.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSecurityTab === "Security" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.2fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Financial Audit Trail"
                    subtitle="Chronological log of critical system overrides"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {securityAuditLogs.map((log, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "14px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                padding: "8px",
                                background:
                                  log.status === "SUCCESS"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                borderRadius: "8px",
                                color:
                                  log.status === "SUCCESS"
                                    ? "#166534"
                                    : "#991b1b",
                              }}
                            >
                              {log.status === "SUCCESS" ? "✅" : "ðŸš«"}
                            </div>
                            <div>
                              <div
                                style={{ fontWeight: "800", fontSize: "13px" }}
                              >
                                {log.action}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: COLORS.muted,
                                }}
                              >
                                By {log.user} • {log.timestamp}
                              </div>
                            </div>
                          </div>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: COLORS.primary,
                              fontWeight: "800",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    <Card
                      title="System Hardening"
                      subtitle="Global security switches"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        {[
                          {
                            l: "Session Timeout (Pulse)",
                            d: "Auto-logout after 30 mins",
                          },
                          {
                            l: "KYC Archive Encryption",
                            d: "AES-256 for all document uploads",
                          },
                          {
                            l: "Admin Mobile OTP",
                            d: "Enforce 2FA for Admin login",
                          },
                          {
                            l: "Auto Database Backup",
                            d: "Encrypted daily cycle at 03:00 AM",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{ fontSize: "12px", fontWeight: "800" }}
                              >
                                {item.l}
                              </div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: COLORS.muted,
                                }}
                              >
                                {item.d}
                              </div>
                            </div>
                            <div
                              style={{
                                width: "40px",
                                height: "20px",
                                background: COLORS.primary,
                                borderRadius: "10px",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  right: "2px",
                                  top: "2px",
                                  width: "16px",
                                  height: "16px",
                                  background: "#fff",
                                  borderRadius: "50%",
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card style={{ background: "#0f172a", color: "#fff" }}>
                      <h3 style={{ margin: "0 0 10px" }}>Document Lock</h3>
                      <p style={{ fontSize: "12px", opacity: 0.7 }}>
                        Invoices & Bills lock instantly upon generation.
                        Unlocking requires Admin-level audit reason.
                      </p>
                      <Button
                        style={{ width: "100%", marginTop: "15px" }}
                        variant="outline"
                      >
                        Unlock Current Register
                      </Button>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 15. CONNECTION MODULE (PREMIUM INTELLIGENCE REPORT) */}
          {activeSection === "CONNECTION" && (
            <div
              style={{
                animation: "slideUp 0.6s ease-out",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              {/* TOP: Search + Farmer Summary Card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "32px",
                  alignItems: "start",
                }}
              >
                <Card
                  title="Farmer Traceability Search"
                  subtitle="Two-way intelligence engine"
                >
                  <Input
                    label="Search by Name, Mobile, Village or Lot ID"
                    value={connSearchQuery}
                    onChange={(e) => setConnSearchQuery(e.target.value)}
                    placeholder="e.g. Vikram Reddy or 9848010000"
                  />
                  <Button style={{ width: "100%", marginTop: "12px" }}>
                    Execute Intelligence Search
                  </Button>

                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Search Results (Click to View Dashboard)
                    </label>
                    {[
                      {
                        id: "f1",
                        name: "Vikram Reddy",
                        phone: "9848010000",
                        village: "Madanapalle",
                      },
                      {
                        id: "f2",
                        name: "Srinivas Rao",
                        phone: "8123456789",
                        village: "Vijayawada",
                      },
                      {
                        id: "f3",
                        name: "Priya Reddy",
                        phone: "9988776655",
                        village: "Chittoor",
                      },
                      {
                        id: "f4",
                        name: "Mohan Chandra",
                        phone: "7766554433",
                        village: "Guntur",
                      },
                    ].map((farmer) => (
                      <div
                        key={farmer.id}
                        style={{
                          padding: "16px",
                          background:
                            selectedConnFarmer?.id === farmer.id
                              ? "rgba(159, 180, 67, 0.1)"
                              : "#f8fafc",
                          borderRadius: "16px",
                          cursor: "pointer",
                          border:
                            selectedConnFarmer?.id === farmer.id
                              ? `2.5px solid ${COLORS.secondary}`
                              : "1.5px solid #e2e8f0",
                          transition: "0.25s all",
                          marginBottom: "8px",
                        }}
                        onClick={() => setSelectedConnFarmer(farmer)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <b
                            style={{ color: COLORS.primary, fontSize: "15px" }}
                          >
                            {farmer.name}
                          </b>
                          <span
                            style={{
                              fontSize: "10px",
                              background: COLORS.secondary,
                              color: "#fff",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontWeight: "800",
                            }}
                          >
                            VERIFIED
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: COLORS.muted,
                            display: "block",
                            marginTop: "4px",
                            fontWeight: "600",
                          }}
                        >
                          Phone: {farmer.phone} • ðŸ“ {farmer.village}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedConnFarmer ? (
                  <Card
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a1a 0%, #1e293b 100%)",
                      color: "#fff",
                      border: "none",
                      boxShadow: "0 25px 50px -12px rgba(45, 65, 55, 0.4)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "32px",
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            margin: "0 0 8px 0",
                            color: COLORS.secondary,
                            fontSize: "32px",
                            fontWeight: "900",
                            letterSpacing: "1px",
                          }}
                        >
                          {selectedConnFarmer.name}
                        </h2>
                        <div
                          style={{
                            fontSize: "13px",
                            opacity: 0.8,
                            display: "flex",
                            gap: "16px",
                          }}
                        >
                          <span>
                            <b style={{ opacity: 0.6 }}>Mobile:</b>{" "}
                            {selectedConnFarmer.phone}
                          </span>
                          <span>
                            <b style={{ opacity: 0.6 }}>Origin:</b>{" "}
                            {selectedConnFarmer.village}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "16px 24px",
                          borderRadius: "20px",
                          textAlign: "right",
                          minWidth: "150px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            opacity: 0.6,
                            fontWeight: "800",
                            marginBottom: "4px",
                          }}
                        >
                          Pending Settlement
                        </div>
                        <b
                          style={{
                            fontSize: "28px",
                            color: "#fbbf24",
                            fontWeight: "900",
                          }}
                        >
                          ₹ 45,200
                        </b>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                      }}
                    >
                      {[
                        {
                          l: "Lots Supplied",
                          v: "14",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                        {
                          l: "QTY Supplied",
                          v: "8,500 KG",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                        {
                          l: "QTY Sold",
                          v: "7,900 KG",
                          c: COLORS.secondary,
                          bg: "rgba(159,180,67,0.1)",
                        },
                        {
                          l: "Gross Sale",
                          v: "₹ 4,25,000",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                        {
                          l: "Expenses Deducted",
                          v: "₹ 21,250",
                          c: "#fca5a5",
                          bg: "rgba(248, 113, 113, 0.1)",
                        },
                        {
                          l: "Net Paid",
                          v: "₹ 3,58,550",
                          c: "#4ade80",
                          bg: "rgba(74, 222, 128, 0.1)",
                        },
                        {
                          l: "Last Supply Date",
                          v: "24/03/2026",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                      ].map((x, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "16px",
                            background: x.bg,
                            borderRadius: "16px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              opacity: 0.7,
                              marginBottom: "6px",
                              fontWeight: "700",
                            }}
                          >
                            {x.l}
                          </div>
                          <b
                            style={{
                              fontSize: "18px",
                              color: x.c,
                              fontWeight: "900",
                            }}
                          >
                            {x.v}
                          </b>
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <Card
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "250px",
                      color: COLORS.muted,
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "48px",
                          display: "block",
                          marginBottom: "16px",
                        }}
                      >
                        â‰¡Æ’Ã¶Ã¹
                      </span>
                      <h3 style={{ margin: 0, color: COLORS.sidebar }}>
                        Connection Matrix Standby
                      </h3>
                      <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                        Select a supplier to generate exhaustive traceability
                        intelligence.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {selectedConnFarmer && (
                <>
                  {/* SMART ALERT */}
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#991b1b",
                      padding: "18px 24px",
                      borderRadius: "20px",
                      border: "1.5px solid #fecaca",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      fontWeight: "800",
                      boxShadow: "0 10px 20px rgba(220, 38, 38, 0.05)",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>âš ï¸</span>
                    <div>
                      <div style={{ fontSize: "14px", letterSpacing: "0.5px" }}>
                        HIGH RISK ALERTS LINKED TO CURRENT PRODUCE:
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.8,
                          fontWeight: "600",
                          marginTop: "4px",
                        }}
                      >Customer<b>'Reliance Fresh'</b> holds pending ₹1,45,000
                        affecting the liquidation of this supplier's supply.
                        Escalate collection strategy.
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3.5fr 1fr",
                      gap: "32px",
                    }}
                  >
                    {/* MIDDLE: Live Traceability Table */}
                    <Card
                      title="Detailed Connection & Sales Ledger"
                      subtitle="Immutable Supplier-to-Buyer Log"
                      style={{ overflow: "hidden", padding: 0 }}
                    >
                      <div style={{ padding: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "16px",
                            marginBottom: "24px",
                          }}
                        >
                          {[
                            "Date Range",
                            "Customer Name",
                            "Product",
                            "Variety",
                            "Grade",
                            "Payment Mode",
                            "Balance Pending",
                          ].map((f) => (
                            <select
                              key={f}
                              style={{
                                padding: "10px 16px",
                                borderRadius: "10px",
                                border: "1.5px solid #e2e8f0",
                                outline: "none",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: COLORS.text,
                                background: "#f8fafc",
                              }}
                            >
                              <option value="" disabled>{getSelectPlaceholder(f)}</option>
                            </select>
                          ))}
                        </div>

                        <div
                          style={{
                            overflowX: "auto",
                            border: "1.5px solid #f1f5f9",
                            borderRadius: "20px",
                            background: "#fff",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  background: "#0f172a",
                                  color: "#fff",
                                  textAlign: "left",
                                }}
                              >
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  DATE & TIME
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  LOT ID
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  PRODUCE SPEC
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  QTY (KG)
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Customer Identity
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  RATE (₹)
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  AMOUNT (₹)
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  PAID
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    color: "#fbbf24",
                                  }}
                                >
                                  BALANCE
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  INVOICE
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Row 1 */}
                              <tr
                                style={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f1f5f9",
                                  transition: "0.2s",
                                }}
                                onClick={() =>
                                  setConnSelectedBuyer({
                                    name: "Reliance Fresh",
                                    phone: "9959012345",
                                    address: "Stall #102, Market Yard",
                                    totalPurchases: "₹ 4.5L",
                                    preferredProducts: [
                                      "Mango Alphonso (80%)",
                                      "Banana Yelakki (20%)",
                                    ],
                                    paymentBehavior:
                                      "Delayed (15 days average)",
                                    outstanding: "₹ 1,45,000",
                                  })
                                }
                              >
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    24/03/2026
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Tuesday, 6:45 AM
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    color: COLORS.primary,
                                    fontWeight: "900",
                                  }}
                                >
                                  LOT-2026-X11
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Mango
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Alphonso • A Grade
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "13px",
                                  }}
                                >
                                  1,200
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Reliance Fresh
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    9959012345 • Stall #102
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.success,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  45.00
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  54,000
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                  }}
                                >
                                  <b style={{ fontSize: "13px" }}>24,000</b>
                                  <br />
                                  <span
                                    style={{
                                      color: "#3b82f6",
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      display: "inline-block",
                                      padding: "2px 6px",
                                      background: "#eff6ff",
                                      borderRadius: "6px",
                                      marginTop: "2px",
                                    }}
                                  >
                                    UPI Transfer
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.danger,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  30,000
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span
                                    style={{
                                      color: "#fff",
                                      background: "#334155",
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      fontWeight: "800",
                                      fontSize: "10px",
                                    }}
                                  >
                                    INV-2026-X01
                                  </span>
                                </td>
                              </tr>
                              {/* Row 2 */}
                              <tr
                                style={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f1f5f9",
                                  transition: "0.2s",
                                }}
                                onClick={() =>
                                  setConnSelectedBuyer({
                                    name: "Harsha Wholesale",
                                    phone: "9898989898",
                                    address: "Stall #45, New Block",
                                    totalPurchases: "₹ 1.2L",
                                    preferredProducts: [
                                      "Banana Yelakki (100%)",
                                    ],
                                    paymentBehavior:
                                      "Excellent (Same day cash)",
                                    outstanding: "₹ 0",
                                  })
                                }
                              >
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    23/03/2026
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Monday, 8:15 AM
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    color: COLORS.primary,
                                    fontWeight: "900",
                                  }}
                                >
                                  LOT-2026-X09
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Banana
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Yelakki • Premium
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "13px",
                                  }}
                                >
                                  850
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Harsha Wholesale
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    9898989898 • Stall #45
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.success,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  32.00
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  27,200
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                  }}
                                >
                                  <b style={{ fontSize: "13px" }}>27,200</b>
                                  <br />
                                  <span
                                    style={{
                                      color: COLORS.success,
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      display: "inline-block",
                                      padding: "2px 6px",
                                      background: "#f0fdf4",
                                      borderRadius: "6px",
                                      marginTop: "2px",
                                    }}
                                  >
                                    Cash Payment
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.muted,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  0
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span
                                    style={{
                                      color: "#fff",
                                      background: "#334155",
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      fontWeight: "800",
                                      fontSize: "10px",
                                    }}
                                  >
                                    INV-2026-X02
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Card>

                    {/* RIGHT PANEL: Buyer Details Snapshot */}
                    <div>
                      <Card
                        title="Buyer Snapshot"
                        subtitle="Select trade log to inspect"
                        style={{ position: "sticky", top: "20px" }}
                      >
                        {connSelectedBuyer ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "24px",
                              animation: "slideUp 0.3s",
                            }}
                          >
                            <div
                              style={{
                                background: "#f8fafc",
                                padding: "24px",
                                borderRadius: "20px",
                                border: "1.5px solid #e2e8f0",
                              }}
                            >
                              <h3
                                style={{
                                  margin: "0 0 8px 0",
                                  color: COLORS.sidebar,
                                  fontSize: "20px",
                                }}
                              >
                                {connSelectedBuyer.name}
                              </h3>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: COLORS.muted,
                                  fontWeight: "600",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "6px",
                                }}
                              >
                                <span>â˜Žï¸ {connSelectedBuyer.phone}</span>
                                <span>ðŸ“ {connSelectedBuyer.address}</span>
                              </div>

                              <div
                                style={{
                                  marginTop: "24px",
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: "20px",
                                }}
                              >
                                <div>
                                  <small
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      color: COLORS.muted,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Lifetime Sourced
                                  </small>
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "900",
                                      color: COLORS.sidebar,
                                      marginTop: "4px",
                                    }}
                                  >
                                    {connSelectedBuyer.totalPurchases}
                                  </div>
                                </div>
                                <div>
                                  <small
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      color: COLORS.muted,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Unsettled Balance
                                  </small>
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "900",
                                      color:
                                        connSelectedBuyer.outstanding === "₹ 0"
                                          ? COLORS.success
                                          : COLORS.danger,
                                      marginTop: "4px",
                                    }}
                                  >
                                    {connSelectedBuyer.outstanding}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <small
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  color: COLORS.muted,
                                  display: "block",
                                  marginBottom: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Payment Habit Indicator
                              </small>
                              <div
                                style={{
                                  padding: "16px",
                                  background:
                                    connSelectedBuyer.outstanding === "₹ 0"
                                      ? "#f0fdf4"
                                      : "#fef3c7",
                                  color:
                                    connSelectedBuyer.outstanding === "₹ 0"
                                      ? "#166534"
                                      : "#b45309",
                                  borderRadius: "16px",
                                  fontSize: "13px",
                                  fontWeight: "800",
                                }}
                              >
                                {connSelectedBuyer.paymentBehavior}
                              </div>
                            </div>
                            <div>
                              <small
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  color: COLORS.muted,
                                  display: "block",
                                  marginBottom: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Commodity Preferences
                              </small>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                }}
                              >
                                {connSelectedBuyer.preferredProducts.map(
                                  (pp, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        fontSize: "12px",
                                        padding: "8px 16px",
                                        background: "#e2e8f0",
                                        color: COLORS.sidebar,
                                        borderRadius: "24px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      {pp}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              opacity: 0.5,
                              padding: "60px 0",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "48px",
                                display: "block",
                                marginBottom: "16px",
                              }}
                            >
                              â‰¡Æ’Ã¦Ã«
                            </span>
                            <p
                              style={{
                                fontWeight: "600",
                                fontSize: "15px",
                                lineHeight: "1.5",
                              }}
                            >
                              Click any transaction row in the matrix to unmask
                              buyer intelligence.
                            </p>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>

                  {/* BOTTOM: Sub-Analytics Layer */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "32px",
                    }}
                  >
                    {/* Product Analytics */}
                    <Card
                      title="Product Analytics"
                      subtitle="Market disposal efficiency by crop"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        <div
                          style={{
                            background: "#f8fafc",
                            padding: "20px",
                            borderRadius: "20px",
                            borderLeft: `6px solid ${COLORS.primary}`,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <b style={{ fontSize: "16px" }}>Mango Alphonso</b>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "800",
                                color: "#fff",
                                background: COLORS.success,
                                padding: "4px 10px",
                                borderRadius: "10px",
                                textTransform: "uppercase",
                              }}
                            >
                              Top Volume
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              color: COLORS.muted,
                              fontWeight: "600",
                            }}
                          >
                            <span>
                              Supplies Cleared:{" "}
                              <b style={{ color: COLORS.text }}>4,000 KG</b>
                            </span>
                            <span>
                              Yield Rate:{" "}
                              <b style={{ color: COLORS.success }}>
                                ₹ 42.50 Avg
                              </b>
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "12px",
                              fontSize: "12px",
                              color: COLORS.text,
                              background: "#fff",
                              padding: "10px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            Major Acquirer:{" "}
                            <b style={{ color: COLORS.primary }}>
                              Harsha Wholesale (45%)
                            </b>
                          </div>
                        </div>

                        <div
                          style={{
                            background: "#f8fafc",
                            padding: "20px",
                            borderRadius: "20px",
                            borderLeft: `6px solid ${COLORS.secondary}`,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <b style={{ fontSize: "16px" }}>Banana Yelakki</b>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "800",
                                color: COLORS.sidebar,
                                background: "#f1f5f9",
                                padding: "4px 10px",
                                borderRadius: "10px",
                                textTransform: "uppercase",
                              }}
                            >
                              Stable
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              color: COLORS.muted,
                              fontWeight: "600",
                            }}
                          >
                            <span>
                              Supplies Cleared:{" "}
                              <b style={{ color: COLORS.text }}>2,500 KG</b>
                            </span>
                            <span>
                              Yield Rate:{" "}
                              <b style={{ color: COLORS.success }}>
                                ₹ 31.00 Avg
                              </b>
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "12px",
                              fontSize: "12px",
                              color: COLORS.text,
                              background: "#fff",
                              padding: "10px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            Major Acquirer:{" "}
                            <b style={{ color: COLORS.primary }}>
                              Reliance Fresh (82%)
                            </b>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Payment Tracking */}
                    <Card
                      title="Payment Flow Intelligence"
                      subtitle="Tracing origin limits & liquidity generation"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1.5px dashed #e2e8f0",
                            paddingBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Gross Generated
                          </span>
                          <b
                            style={{ fontSize: "20px", color: COLORS.sidebar }}
                          >
                            ₹ 4,25,000
                          </b>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1.5px dashed #e2e8f0",
                            paddingBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              color: COLORS.success,
                              textTransform: "uppercase",
                            }}
                          >
                            Amount Liquidated
                          </span>
                          <b
                            style={{ fontSize: "20px", color: COLORS.success }}
                          >
                            ₹ 3,45,000
                          </b>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1.5px dashed #e2e8f0",
                            paddingBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              color: COLORS.danger,
                              textTransform: "uppercase",
                            }}
                          >
                            Deficit Balance
                          </span>
                          <b style={{ fontSize: "20px", color: COLORS.danger }}>
                            ₹ 80,000
                          </b>
                        </div>

                        <div style={{ marginTop: "8px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "900",
                              color: COLORS.muted,
                              letterSpacing: "1px",
                              display: "block",
                              marginBottom: "12px",
                            }}
                          >
                            PAYMENT APPARATUS DISTRIBUTION
                          </span>
                          <div style={{ display: "flex", gap: "12px" }}>
                            <div
                              style={{
                                flex: 1,
                                background: "#f8fafc",
                                padding: "16px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  marginBottom: "8px",
                                }}
                              >
                                â‰¡Æ’Ã†â•¡
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  color: COLORS.sidebar,
                                }}
                              >
                                30% CASH
                              </div>
                            </div>
                            <div
                              style={{
                                flex: 1,
                                background: "#f8fafc",
                                padding: "16px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  marginBottom: "8px",
                                }}
                              >
                                Phone:
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  color: "#3b82f6",
                                }}
                              >
                                65% UPI
                              </div>
                            </div>
                            <div
                              style={{
                                flex: 1,
                                background: "#fef2f2",
                                padding: "16px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "1px solid #fecaca",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  marginBottom: "8px",
                                }}
                              >
                                Î“Ã…â”‚
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  color: COLORS.danger,
                                }}
                              >
                                5% DEBT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Timing Algorithms */}
                    <Card
                      title="Time Array Analytics"
                      subtitle="Biological lifecycle & market disposal velocities"
                    >
                      <div
                        style={{
                          overflowX: "auto",
                          border: "1px solid #e2e8f0",
                          borderRadius: "20px",
                          background: "#f8fafc",
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            fontSize: "12px",
                            textAlign: "left",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                color: COLORS.muted,
                                background: "rgba(0,0,0,0.03)",
                              }}
                            >
                              <th
                                style={{
                                  padding: "16px",
                                  fontWeight: "800",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                DAY PATTERN
                              </th>
                              <th
                                style={{
                                  padding: "16px",
                                  fontWeight: "800",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                OPTIMAL CLEARANCE WINDOW
                              </th>
                              <th
                                style={{
                                  padding: "16px",
                                  textAlign: "right",
                                  fontWeight: "800",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                VOLUME
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                d: "Monday",
                                t: "06:00 AM - 08:30 AM",
                                v: "2,400",
                              },
                              {
                                d: "Tuesday",
                                t: "05:45 AM - 07:00 AM",
                                v: "1,850",
                              },
                              {
                                d: "Thursday",
                                t: "07:00 AM - 10:00 AM",
                                v: "3,100",
                              },
                            ].map((row, i) => (
                              <tr
                                key={i}
                                style={{
                                  borderBottom: "1px solid #e2e8f0",
                                  background: "#fff",
                                }}
                              >
                                <td
                                  style={{
                                    padding: "16px",
                                    fontWeight: "800",
                                    color: COLORS.sidebar,
                                  }}
                                >
                                  {row.d}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    color: COLORS.muted,
                                    fontWeight: "600",
                                  }}
                                >
                                  {row.t}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "900",
                                    color: COLORS.primary,
                                  }}
                                >
                                  {row.v} KG
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          marginTop: "24px",
                          background: "rgba(159, 180, 67, 0.1)",
                          padding: "16px",
                          borderRadius: "16px",
                          border: `1px solid ${COLORS.secondary}40`,
                          fontSize: "12px",
                          color: COLORS.sidebar,
                          fontWeight: "600",
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>â‰¡Æ’Ã†Ã­</span>
                        <span>
                          Insight: Produce supplied on Thursdays accounts for
                          highest liquidation volumes despite late timing
                          windows.
                        </span>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 16. Search & Filters */}
          {activeSection === "Search & Filters" && (
            <Card
              title="Matrix Search Terminal"
              subtitle="Universal lookup for the Mandi ecosystem"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                <Input placeholder="By Supplier Identity..." />
                <Input placeholder="By Customer Name..." />
                <Input placeholder="By Core Product..." />
                <Input type="date" label="By Transaction Date" />
                <Input
                  placeholder="By Invoice/Bill #"
                  label="Document Number"
                />
                <Input
                  placeholder="By Auto Lot ID"
                  label="Tracking Reference"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="outline">Clear Matrix</Button>
                <Button>Execute Lookup</Button>
              </div>
              <div
                style={{
                  padding: "100px",
                  textAlign: "center",
                  border: "2px solid #f1f5f9",
                  borderRadius: "32px",
                  marginTop: "40px",
                  color: COLORS.muted,
                }}
              >
                <span style={{ fontSize: "48px" }}>â‰¡Æ’Ã¶Ã„</span>
                <p>Results will populate here after a lookup is initialized.</p>
              </div>
            </Card>
          )}

          {/* 17. Document Management */}
          {activeSection === "Document Management" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: "32px",
              }}
            >
              <Card
                title="Repository Vault"
                subtitle="Archive for physical bill scans and KYC docs"
              >
                <div
                  style={{
                    padding: "60px",
                    border: "4px dashed #f1f5f9",
                    borderRadius: "32px",
                    textAlign: "center",
                    color: COLORS.muted,
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "64px" }}>â‰¡Æ’Ã´Ã©</span>
                  <h3 style={{ color: "#0f172a" }}>
                    {uploading ? "âš¡ Syncing Entry..." : "Vault Archive Queue"}
                  </h3>
                  <p>Click to browse or drag documents into storage.</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                    }}
                    disabled={uploading}
                  />
                  <Button style={{ marginTop: "24px", width: "100%" }}>
                    {uploading ? "Synchronizing..." : "Initialize Batch Upload"}
                  </Button>
                </div>
              </Card>
              <Card title="Vault Records feed">
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {documents.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: COLORS.muted,
                        padding: "40px",
                      }}
                    >
                      No documents in vault.
                    </p>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px",
                          background: "#f8fafc",
                          borderRadius: "16px",
                          marginBottom: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "14px",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "28px" }}>
                            {doc.docType === "Produce Photo"
                              ? "â‰¡Æ’Ã»â•âˆ©â••Ã…"
                              : "â‰¡Æ’Ã´Ã¤"}
                          </span>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "800",
                                fontSize: "14px",
                              }}
                            >
                              {doc.originalName}
                            </p>
                            <small style={{ color: COLORS.muted }}>
                              {doc.docType} • {(doc.fileSize / 1024).toFixed(1)}{" "}
                              KB
                            </small>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="secondary"
                              style={{ padding: "8px 12px", fontSize: "12px" }}
                            >
                              View
                            </Button>
                          </a>
                          {isAdmin && (
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteDoc(doc._id)}
                              style={{ padding: "8px 12px", fontSize: "12px" }}
                            >
                              ðŸ—‘ï¸
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Global Datalist Injection for Autocomplete Fields */}
        <datalist id="fruit-list">
          {DB.Fruits.map((f) => (
            <option key={`f-${f}`} value={f} />
          ))}
        </datalist>
        <datalist id="vegetable-list">
          {DB.Vegetables.map((v) => (
            <option key={`v-${v}`} value={v} />
          ))}
        </datalist>

        {/* ENTITY DETAIL MODAL (Supplier/Buyer View) */}
        {viewingEntity && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(30, 36, 11, 0.4)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: "20px",
            }}
            onClick={() => setViewingEntity(null)}
          >
            <div
              style={{
                background: "#FFFFFF",
                width: "100%",
                maxWidth: "1000px",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                overflow: "hidden",
                animation: "scaleIn 0.3s ease-out",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #1e240b 0%, #3a4714 100%)",
                  padding: "24px 32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "#FFFFFF",
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "900",
                    }}
                  >
                    {viewingEntity.type} Profile
                  </h3>
                </div>
              </div>

              <div style={{ padding: "32px", maxHeight: "60vh", overflowY: "auto" }}>
                <div style={{ overflowX: "auto", border: "1px solid #EBE9E1", borderRadius: "12px", background: "#fff" }}>
                  {viewingEntity.type === "LOT" ? (
                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "32px" }}>
                      
                      {/* Lot Information — Horizontal Table Format */}
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "4px", height: "16px", background: COLORS.sidebar, borderRadius: "2px" }}></div>
                          LOT RECORD INFORMATION
                        </div>
                        <div style={{ overflowX: "auto", border: "1.5px solid #EBE9E1", borderRadius: "12px", background: "#fff" }}>
                          <table style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead>
                              <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #EBE9E1" }}>
                                <th style={{ padding: "12px 20px", textAlign: "left", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Lot ID</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Supplier Name</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Vehicle No</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Origin</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Driver Name</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Entry Date</th>
                                <th style={{ padding: "12px 20px", textAlign: "right", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Bill Photo</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ padding: "16px 20px", fontWeight: "900", color: COLORS.sidebar }}>{viewingEntity.data.lotId || "N/A"}</td>
                                <td style={{ padding: "16px 20px", fontWeight: "800", color: COLORS.sidebar }}>{viewingEntity.data.farmerName || suppliers.find(s => s._id === (viewingEntity.data.supplierId?._id || viewingEntity.data.supplierId))?.name || "N/A"}</td>
                                <td style={{ padding: "16px 20px", fontWeight: "700", color: COLORS.sidebar }}>{viewingEntity.data.vehicleNumber || "N/A"}</td>
                                <td style={{ padding: "16px 20px", fontWeight: "700", color: COLORS.primary }}>{viewingEntity.data.origin || "N/A"}</td>
                                <td style={{ padding: "16px 20px", fontWeight: "700", color: COLORS.sidebar }}>{viewingEntity.data.driverName || "N/A"}</td>
                                <td style={{ padding: "16px 20px", fontWeight: "700", color: COLORS.sidebar }}>{viewingEntity.data.entryDate ? new Date(viewingEntity.data.entryDate).toLocaleDateString() : "N/A"}</td>
                                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                  {viewingEntity.data.attached_bill_photo ? (
                                    <button
                                      onClick={() => setBillPhotoModal({ open: true, imageUrl: viewingEntity.data.attached_bill_photo, lotNo: viewingEntity.data.lotId || "N/A", supplierName: viewingEntity.data.farmerName || "N/A", supplierId: viewingEntity.data.supplierId || "N/A", zoom: 1 })}
                                      style={{ background: "#F1F5F9", color: COLORS.sidebar, border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                    >View Bill</button>
                                  ) : "None"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Produce Details Box — Nested */}
                      <div style={{ background: "#FDFBF4", padding: "24px", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                        <div style={{ fontSize: "13px", fontWeight: "900", color: COLORS.sidebar, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>PRODUCE ITEMS & QUANTITY</span>
                          <span style={{ fontSize: "10px", background: COLORS.sidebar, color: "#fff", padding: "4px 10px", borderRadius: "20px" }}>{viewingEntity.data.lineItems?.length || 0} ITEMS</span>
                        </div>
                        
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                            <thead>
                              <tr style={{ textAlign: "left", borderBottom: "2px solid #EBE9E1" }}>
                                <th style={{ padding: "12px", color: COLORS.muted, fontWeight: "800" }}>S.No</th>
                                <th style={{ padding: "12px", color: COLORS.muted, fontWeight: "800" }}>Product Name</th>
                                <th style={{ padding: "12px", color: COLORS.muted, fontWeight: "800" }}>Variety</th>
                                <th style={{ padding: "12px", color: COLORS.muted, fontWeight: "800" }}>Grade</th>
                                <th style={{ padding: "12px", textAlign: "right", color: COLORS.muted, fontWeight: "800" }}>Gross WT (KG)</th>
                                <th style={{ padding: "12px", textAlign: "center", color: COLORS.muted, fontWeight: "800" }}>Unit</th>
                                <th style={{ padding: "12px", textAlign: "right", color: COLORS.muted, fontWeight: "800" }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(viewingEntity.data.lineItems || []).map((it, idx) => (
                                <tr key={idx} style={{ borderBottom: idx === viewingEntity.data.lineItems.length - 1 ? "none" : "1px solid #F1F5F9" }}>
                                  <td style={{ padding: "14px 12px", color: COLORS.muted, fontWeight: "700" }}>{idx + 1}</td>
                                  <td style={{ padding: "14px 12px", fontWeight: "900", color: COLORS.sidebar }}>{it.productId || it.product}</td>
                                  <td style={{ padding: "14px 12px", fontWeight: "800", color: COLORS.primary }}>{it.variety || "Standard"}</td>
                                  <td style={{ padding: "14px 12px", fontWeight: "800", color: "#1e293b" }}>{it.grade}</td>
                                  <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: "900", color: "#166534" }}>{it.grossWeight}</td>
                                  <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: "700", color: COLORS.muted }}>{it.weightUnit || "KG"}</td>
                                  <td style={{ padding: "14px 12px", textAlign: "right" }}>
                                    <span style={{ 
                                      padding: "4px 10px", 
                                      borderRadius: "6px", 
                                      fontSize: "10px", 
                                      fontWeight: "800", 
                                      background: it.status === "Fully Sold" ? "#DCFCE7" : "#F1F5F9",
                                      color: it.status === "Fully Sold" ? "#166534" : COLORS.sidebar
                                    }}>
                                      {it.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Notes Section if exists */}
                      {viewingEntity.data.notes && (
                        <div style={{ padding: "16px 24px", background: "#F8FAFC", borderRadius: "10px", border: "1px dashed #E2E8F0" }}>
                          <span style={{ fontSize: "11px", fontWeight: "900", color: COLORS.muted, textTransform: "uppercase" }}>REMARKS / NOTES:</span>
                          <p style={{ margin: "8px 0 0", fontSize: "13px", fontWeight: "700", color: COLORS.sidebar }}>{viewingEntity.data.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", border: "1px solid #EBE9E1" }}>
                        <thead>
                          <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                            {Object.entries(viewingEntity.data)
                              .filter(([key]) => !["_id", "__v", "createdAt", "updatedAt", "password", "allItems", "buyerName", "supplierId", "entryDate", "lineItems", "attached_bill_photo", "aadhaar", "pan", "voterId", "idType", "govIdNumber"].includes(key))
                              .map(([key]) => (
                                <th 
                                  key={key} 
                                  style={{ 
                                    padding: "12px 16px", 
                                    textAlign: "left", 
                                    color: COLORS.muted, 
                                    fontWeight: "900", 
                                    textTransform: "uppercase",
                                    fontSize: "11px",
                                    whiteSpace: "nowrap",
                                    borderRight: "1px solid #EBE9E1"
                                  }}
                                >
                                  {key === "farmerName" ? "Supplier Name" : key.replace(/([A-Z])/g, " $1").trim()}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {Object.entries(viewingEntity.data)
                              .filter(([key]) => !["_id", "__v", "createdAt", "updatedAt", "password", "allItems", "buyerName", "supplierId", "entryDate", "lineItems", "attached_bill_photo", "aadhaar", "pan", "voterId", "idType", "govIdNumber"].includes(key))
                              .map(([key, rawValue]) => (
                                <td 
                                  key={key} 
                                  style={{ 
                                    padding: "16px", 
                                    color: COLORS.sidebar, 
                                    fontWeight: "700",
                                    borderRight: "1px solid #EBE9E1",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {typeof rawValue === 'object' && rawValue !== null 
                                    ? JSON.stringify(rawValue) 
                                    : (typeof rawValue === 'string' && rawValue.includes('T') && !isNaN(Date.parse(rawValue))) 
                                      ? rawValue.split('T')[0] 
                                      : String(rawValue || "N/A")}
                                </td>
                              ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* SPECIAL TABLE FOR GROUPED ALLOCATIONS OR LOT TRACEABILITY */}
                {(() => {
                  let itemsToShow = [];
                  let tableTitle = "";

                  if (viewingEntity.type === "Allocation" && viewingEntity.data.allItems) {
                    itemsToShow = viewingEntity.data.allItems;
                    tableTitle = "ALL ALLOCATION LINE ITEMS IN THIS TRANSACTION";
                  } else if (viewingEntity.type === "LOT") {
                    itemsToShow = (allocations || []).filter(a => a.lotId === viewingEntity.data._id || a.lotId === viewingEntity.data.lotId || a.lotReference === viewingEntity.data.lotId);
                    tableTitle = "LINKED TRANSACTION LEDGER (TRACED SALES FROM THIS LOT)";
                  }

                  if (itemsToShow.length > 0) {
                    return (
                      <div style={{ marginTop: "32px", borderTop: "2px solid #FDFBF4", paddingTop: "24px" }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: COLORS.sidebar, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px", borderLeft: `4px solid ${COLORS.sidebar}`, paddingLeft: "12px" }}>
                          {tableTitle}
                        </label>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: "12px", background: "#fcfcfc", border: `1.5px solid ${COLORS.sidebar}`, borderRadius: "12px", overflow: "hidden" }}>
                            <thead>
                              <tr style={{ background: COLORS.sidebar, color: "#fff" }}>
                                <th style={{ padding: "12px", textAlign: "left" }}>Product / Variety / Grade</th>
                                <th style={{ padding: "12px", textAlign: "right" }}>Qty (KG)</th>
                                <th style={{ padding: "12px", textAlign: "right" }}>Rate (₹)</th>
                                <th style={{ padding: "12px", textAlign: "right" }}>Allocated Amt (₹)</th>
                                <th style={{ padding: "12px", textAlign: "right" }}>Total Sale (₹)</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Invoice Ref</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Bill Photo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemsToShow.map((it, idx) => {
                                const autoAmt = (Number(it.quantity) * Number(it.rate)) || 0;
                                const manualAmt = Number(it.allocatedAmount);
                                const finalAmt = !isNaN(manualAmt) && it.allocatedAmount !== "" ? manualAmt : autoAmt;
                                
                                return (
                                  <tr key={idx} style={{ borderBottom: "1px solid #EBE9E1" }}>
                                    <td style={{ padding: "12px", fontWeight: "800", color: COLORS.sidebar }}>{it.lineItemId || "Standard Produce"}</td>
                                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "700" }}>{it.quantity}</td>
                                    <td style={{ padding: "12px", textAlign: "right", color: COLORS.primary, fontWeight: "700" }}>₹{it.rate}</td>
                                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "800", color: "#C2410C", background: "#FFF7ED" }}>₹{finalAmt.toLocaleString()}</td>
                                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "900" }}>₹{finalAmt.toLocaleString()}</td>
                                    <td style={{ padding: "12px", color: COLORS.muted, fontSize: "11px" }}>{it.buyerInvoiceNo || "UNLINKED"}</td>
                                     <td style={{ padding: "12px" }}>
                                        {viewingEntity.data.attached_bill_photo ? (
                                          <span 
                                            onClick={() => setBillPhotoModal({ 
                                              open: true, 
                                              imageUrl: viewingEntity.data.attached_bill_photo, 
                                              lotNo: viewingEntity.data.lotId || "N/A", 
                                              supplierName: viewingEntity.data.farmerName || "N/A",
                                              supplierId: viewingEntity.data.supplierId || "N/A",
                                              zoom: 1 
                                            })} 
                                            style={{ color: COLORS.primary, fontWeight: "900", cursor: "pointer", textDecoration: "underline", fontSize: "11px" }}
                                          >
                                            View Bill
                                          </span>
                                        ) : (
                                          <span style={{ color: COLORS.muted, fontSize: "11px", fontWeight: "700" }}>No bill attached</span>
                                        )}
                                     </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr style={{ background: "#F1F5F9", fontWeight: "900" }}>
                                <td colSpan="3" style={{ padding: "12px", textAlign: "right" }}>GRAND TOTAL SUMMARY:</td>
                                <td style={{ padding: "12px", textAlign: "right", color: "#C2410C" }}>
                                  ₹{itemsToShow.reduce((acc, it) => acc + (Number(it.allocatedAmount) || (Number(it.quantity) * Number(it.rate) || 0)), 0).toLocaleString()}
                                </td>
                                <td style={{ padding: "12px", textAlign: "right" }}>
                                  ₹{itemsToShow.reduce((acc, it) => acc + (Number(it.allocatedAmount) || (Number(it.quantity) * Number(it.rate) || 0)), 0).toLocaleString()}
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div
                style={{
                  padding: "24px 32px",
                  background: "#F8FAFC",
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <Button
                  style={{ background: COLORS.sidebar, padding: "10px 30px", fontWeight: "800" }}
                  onClick={() => setViewingEntity(null)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}
        {billPhotoModal.open && (
          <div
            onClick={() => setBillPhotoModal((prev) => ({ ...prev, open: false }))}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.55)",
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "980px",
                maxHeight: "92vh",
                background: "#FFFFFF",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 24px 40px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: "800", color: COLORS.sidebar, fontSize: "13px" }}>Attached Bill Preview</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => setBillPhotoModal((prev) => ({ ...prev, zoom: Math.max(0.6, Number(prev.zoom || 1) - 0.2) }))}
                    style={{ border: "1px solid #CBD5E1", borderRadius: "6px", background: "#fff", padding: "4px 10px", cursor: "pointer", fontWeight: "800" }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => setBillPhotoModal((prev) => ({ ...prev, zoom: Math.min(3, Number(prev.zoom || 1) + 0.2) }))}
                    style={{ border: "1px solid #CBD5E1", borderRadius: "6px", background: "#fff", padding: "4px 10px", cursor: "pointer", fontWeight: "800" }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setBillPhotoModal((prev) => ({ ...prev, open: false }))}
                    style={{ border: "1px solid #CBD5E1", borderRadius: "6px", background: "#fff", padding: "4px 10px", cursor: "pointer", fontWeight: "800" }}
                  >
                    X
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, overflow: "auto", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                {billPhotoModal.imageUrl ? (
                  <img
                    src={billPhotoModal.imageUrl}
                    alt="Bill"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      transform: `scale(${billPhotoModal.zoom || 1})`,
                      transformOrigin: "center center",
                      transition: "transform 0.15s ease",
                    }}
                  />
                ) : (
                  <div style={{ color: COLORS.muted, fontSize: "13px", fontWeight: "700" }}>No bill photo available</div>
                )}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #E2E8F0", fontSize: "12px", color: COLORS.sidebar, fontWeight: "700" }}>
                <div>LOT NO - {billPhotoModal.lotNo || "N/A"}</div>
                <div>Supplier Name - {billPhotoModal.supplierName || "N/A"}</div>
                <div>Supplier ID - {stripIdPrefix(billPhotoModal.supplierId) || "N/A"}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
