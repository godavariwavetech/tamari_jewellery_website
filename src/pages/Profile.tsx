import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, type UserProfile, type Order } from "../services/api";
import { authService } from "../services/auth";
import { useCurrency } from "../context/CurrencyContext";
import ConfirmPopup from "../components/ConfirmPopup";

const SF = "-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, sans-serif";

/* ── Icon SVGs (no external deps) ── */
const UserIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BagIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const MapPinIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const FileIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const BellIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const LogoutIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const EditIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const DownloadIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const SearchIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CheckCircle = ({ size = 16, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const TrashIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/* ── Color tokens ── */
const GOLD = "#f59e0b";
const GOLD_L = "#fff8e8";
const GOLD_B = "#f5c96a";
const RED = "#dc2626";

/* ════════════════════════════════════
   SIDEBAR
════════════════════════════════════ */
const NAV = [
  { key: "profile",       label: "Profile",           Icon: UserIcon },
  { key: "orders",        label: "My Orders",          Icon: BagIcon },
  { key: "address",       label: "Address",            Icon: MapPinIcon },
  { key: "kyc",           label: "KYC & Verification", Icon: FileIcon },
  { key: "notifications", label: "Notifications",      Icon: BellIcon },
];

function Sidebar({ active, setActive, isMobile, onLogoutClick }: { active: string; setActive: (key: string) => void; isMobile?: boolean; onLogoutClick: () => void }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
      padding: 16, display: "flex", flexDirection: isMobile ? "row" : "column",
      justifyContent: "space-between", minHeight: isMobile ? "auto" : 500, 
      width: isMobile ? "100%" : 220, flexShrink: 0,
      overflowX: isMobile ? "auto" : "visible",
      scrollbarWidth: 'none'
    }}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: isMobile ? "row" : "column", gap: 4 }}>
        {NAV.map(({ key, label, Icon }) => {
          const on = active === key;
          return (
            <li key={key} style={{ flexShrink: 0 }}>
              <button onClick={() => setActive(key)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                background: on ? GOLD_L : "transparent",
                border: on ? `1px solid ${GOLD_B}` : "1px solid transparent",
                color: on ? "#b36a00" : "#6b7280",
                fontSize: 14, fontWeight: on ? 600 : 400,
                textAlign: "left", transition: "all 0.15s",
                whiteSpace: isMobile ? 'nowrap' : 'normal'
              }}>
                <Icon size={16} color={on ? "#b36a00" : "#6b7280"} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
      {!isMobile && (
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, marginTop: 14 }}>
          <button
            onClick={onLogoutClick}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 8, cursor: "pointer",
              background: "transparent", border: "none",
              color: RED, fontSize: 14, fontWeight: 500, textAlign: "left",
            }}
          >
            <LogoutIcon size={16} color={RED} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════
   PROFILE TAB
════════════════════════════════════ */

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{
        border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 14px",
        fontSize: 14, color: "#111827", background: "#fff",
      }}>{value}</div>
    </div>
  );
}

function ProfileTab({ isMobile, profile }: { isMobile: boolean; profile: UserProfile | null }) {
  if (!profile) return <div>Loading profile...</div>;
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: "#111827", margin: 0 }}>My Profile</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Manage your personal information</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: GOLD, color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 10, fontSize: 14,
          fontWeight: 600, cursor: "pointer",
          width: isMobile ? '100%' : 'auto', justifyContent: 'center'
        }}>
          <EditIcon size={14} color="#fff" /> Edit Profile
        </button>
      </div>

      {/* Card */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {/* Banner */}
        <div style={{ background: GOLD, padding: isMobile ? "20px" : "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{
              width: 60, height: 60, background: "#fff", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: "#b45309", flexShrink: 0,
            }}>{profile.name?.charAt(0) || 'U'}</div>
            <div>
              <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#fff", margin: 0 }}>{profile.name}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: "4px 0 0" }}>{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div style={{ padding: isMobile ? "20px" : "24px 28px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <UserIcon size={16} color={GOLD} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Personal Information</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,minmax(0,1fr))", gap: 14 }}>
            <FieldBox label="Full Name" value={profile.name} />
            <FieldBox label="Mobile Number" value={profile.phone} />
            <FieldBox label="Email" value={profile.email} />
            <FieldBox label="Address" value={profile.address || "Not provided"} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   MY ORDERS TAB
════════════════════════════════════ */

const statusStyle = (s: string) => {
  if (s === "Delivered") return { background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" };
  if (s === "Processing") return { background: "#fef9c3", color: "#ca8a04", border: "1px solid #fde68a" };
  if (s === "Cancelled") return { background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" };
  return {};
};

function OrdersTab({ isMobile, orders }: { isMobile: boolean; orders: Order[] }) {
  const { format } = useCurrency();
  const [search, setSearch] = useState("");
  const filtered = orders.filter(o =>
    o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
    o.items?.[0]?.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const COL = { fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 0.6, textTransform: "uppercase", padding: "12px 0" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: "#111827", margin: 0 }}>My Orders</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Manage your order history</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
          <SearchIcon size={16} color="#9ca3af" />
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Order ID or Product..."
          style={{
            width: "100%", padding: "11px 14px 11px 42px",
            border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14,
            color: "#374151", background: "#fff", outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Table/List */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {filtered.length > 0 ? (
          !isMobile ? (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr 110px 110px 120px 60px",
                padding: "0 24px", borderBottom: "1px solid #f3f4f6",
                background: "#fafafa",
              }}>
                {["ORDER ID", "PRODUCT", "PRICE", "STATUS", "DATE", "ACTIONS"].map(h => (
                  <div key={h} style={COL}>{h}</div>
                ))}
              </div>

              {filtered.map((o, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr 110px 110px 120px 60px",
                  padding: "20px 24px", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{o.order_id}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>{o.items?.[0]?.product_name || 'Multiple Items'}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Items: {o.items?.length || 0}</p>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{format(o.total_amount || 0, { inputIncludesGst: true })}</div>
                  <div>
                    <span style={{
                      ...statusStyle(o.order_status),
                      fontSize: 12, fontWeight: 600, padding: "4px 10px",
                      borderRadius: 20, display: "inline-block",
                    }}>{o.order_status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{o.order_date}</div>
                  <div>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: GOLD }} title="Download Invoice">
                      <DownloadIcon size={18} color={GOLD} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filtered.map((o, i) => (
                <div key={i} style={{
                  padding: "20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{o.order_id}</span>
                    <span style={{
                      ...statusStyle(o.order_status),
                      fontSize: 11, fontWeight: 700, padding: "2px 10px",
                      borderRadius: 20,
                    }}>{o.order_status}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>{o.items?.[0]?.product_name || 'Multiple Items'}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Items: {o.items?.length || 0}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: GOLD, margin: 0 }}>{format(o.total_amount || 0, { inputIncludesGst: true })}</p>
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{o.order_date}</p>
                    </div>
                    <button style={{ background: GOLD_L, border: `1px solid ${GOLD_B}`, padding: "8px", borderRadius: 8 }}>
                      <DownloadIcon size={16} color={GOLD} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   ADDRESS TAB
════════════════════════════════════ */
function AddressTab({ isMobile, profile }: { isMobile: boolean; profile: UserProfile | null }) {
  const [addresses] = useState([
    {
      id: 1,
      name: profile?.name || "Home",
      line1: profile?.address || "No address provided",
      city: profile?.city || "",
      state: profile?.state || "",
      pin: profile?.pincode || "",
      phone: profile?.phone || "",
    },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: "#111827", margin: 0 }}>Address</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Manage your personal and business information</p>
      </div>

      {addresses.map(a => (
        <div key={a.id} style={{
          background: "#fff", borderRadius: 12,
          border: "1px solid #e5e7eb", padding: isMobile ? "20px" : "24px 28px",
          display: "flex", flexDirection: isMobile ? 'column' : 'row',
          justifyContent: "space-between", alignItems: isMobile ? "stretch" : "flex-start",
          gap: 20
        }}>
          <div style={{ lineHeight: 1.7 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{a.name}</p>
            <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>{a.line1}</p>
            <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>{a.city}, {a.state} {a.pin}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>{a.phone}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: 'center',
              padding: "8px 16px", border: `1px solid ${GOLD_B}`,
              borderRadius: 8, background: "#fff", color: "#b36a00",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <EditIcon size={13} color="#b36a00" /> Edit
            </button>
            <button style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: 'center',
              padding: "8px 16px", border: "1px solid #fecaca",
              borderRadius: 8, background: "#fff", color: RED,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <TrashIcon size={13} color={RED} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════
   KYC TAB
════════════════════════════════════ */
const KYC_DOCS = [
  { title: "Aadhaar Card", uploaded: "15 Jan 2026", docId: "XXXX XXXX 8765", status: "Verified" },
  { title: "PAN Card", uploaded: "15 Jan 2026", docId: "XXXPK1234X", status: "Verified" },
  { title: "GST Certificate", uploaded: "16 Jan 2026", docId: "27AABCU9603R1ZM", status: "Verified" },
];

function KYCTab({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: "#111827", margin: 0 }}>KYC</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Business verification status</p>
      </div>

      <div style={{
        background: "#16a34a", borderRadius: 14, padding: isMobile ? "20px" : "22px 28px",
        display: "flex", flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between",
        gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <CheckCircle size={22} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#fff", margin: 0 }}>KYC Verified</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>Ready for transactions</p>
          </div>
        </div>
        <div style={{ textAlign: isMobile ? "left" : "right" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: 0 }}>Level</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Premium</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 18 }}>
        {KYC_DOCS.map((doc, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileIcon size={18} color={GOLD} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{doc.title}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{doc.uploaded}</p>
                </div>
              </div>
              <CheckCircle size={20} color="#16a34a" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: "#9ca3af", display: "block", marginBottom: 4 }}>DOC ID</label>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#111827" }}>{doc.docId}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>VERIFIED</span>
              <button style={{ background: "none", border: "none", color: "#b36a00", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   NOTIFICATIONS TAB
════════════════════════════════════ */
function NotificationsTab({ isMobile }: { isMobile: boolean }) {
  const [notifs, setNotifs] = useState([
    { title: "Order Delivered", body: "Your order #ORD-2451 has been delivered", time: "2 hours ago", unread: true },
    { title: "Order Shipped", body: "Your order #ORD-2450 is in transit", time: "1 day ago", unread: false },
  ]);

  const dismiss = (idx: number) => setNotifs(prev => prev.filter((_, i) => i !== idx));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: "#111827", margin: 0 }}>Notifications</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            background: "#fff", border: n.unread ? `1.5px solid ${GOLD_B}` : "1px solid #e5e7eb",
            borderRadius: 12, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{n.title}</p>
              <p style={{ fontSize: 13, color: "#4b5563", margin: "0 0 4px" }}>{n.body}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{n.time}</p>
            </div>
            <button onClick={() => dismiss(i)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <TrashIcon size={14} color="#9ca3af" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   ROOT
════════════════════════════════════ */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.id) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setLoading(true);
        const [profileData, ordersData] = await Promise.all([
          apiService.getUserProfile(currentUser.id, currentUser.role),
          apiService.getUserOrders(currentUser.id)
        ]);

        setProfile(profileData ?? {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
        });
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setProfile({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const isMobile = windowWidth < 1024;

  if (loading) {
    return (
      <div style={{ background: "#f3f4f6", minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const content = {
    profile:       <ProfileTab isMobile={isMobile} profile={profile} />,
    orders:        <OrdersTab isMobile={isMobile} orders={orders} />,
    address:       <AddressTab isMobile={isMobile} profile={profile} />,
    kyc:           <KYCTab isMobile={isMobile} />,
    notifications: <NotificationsTab isMobile={isMobile} />,
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        button:focus { outline: none; }
        input:focus { outline: 2px solid #f59e0b; outline-offset: -1px; }
      `}</style>
      <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: isMobile ? "16px" : "32px 24px", fontFamily: SF }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24, alignItems: "flex-start",
        }}>
          <Sidebar active={active} setActive={setActive} isMobile={isMobile} onLogoutClick={() => setLogoutOpen(true)} />
          <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
            {content[active as keyof typeof content]}
          </div>
        </div>
      </div>

      <ConfirmPopup
        isOpen={logoutOpen}
        title="Logout?"
        message="You'll need to login again to access your profile, orders and wishlist."
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          authService.logout();
        }}
      />
    </>
  );
}