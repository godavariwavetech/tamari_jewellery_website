import { useEffect, useState } from 'react';

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";

const Contact = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .contact-page {
            padding: 24px 16px !important;
          }
          .contact-card {
            padding: 24px 20px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div 
        className="contact-page"
        style={{
          minHeight: "100vh",
          background: "#f9fafb",
          padding: isMobile ? "24px 16px" : isTablet ? "32px 24px" : "48px 32px",
          fontFamily: SF,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Page Title */}
          <h1 style={{
            fontFamily: SF,
            fontSize: isMobile ? 24 : isTablet ? 28 : 32,
            fontWeight: 700,
            color: "#1f2937",
            textAlign: "center",
            marginBottom: isMobile ? 24 : 32,
          }}>
            Contact Us
          </h1>

          <div className="contact-grid" style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 24 : isTablet ? 32 : 40,
          }}>
            {/* Contact Form */}
            <div 
              className="contact-card"
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                padding: isMobile ? "24px 20px" : isTablet ? "28px" : "32px",
              }}
            >
              <h2 style={{
                fontFamily: SF,
                fontSize: isMobile ? 18 : 20,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 24,
              }}>
                Send us a Message
              </h2>

              <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{
                    display: "block",
                    fontFamily: SF,
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 8,
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    style={{
                      width: "100%",
                      padding: isMobile ? "11px 14px" : "12px 16px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      fontFamily: SF,
                      fontSize: isMobile ? 14 : 15,
                      color: "#1f2937",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#ca8a04"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                  />
                </div>

                <div className="form-grid" style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: 16,
                }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontFamily: SF,
                      fontSize: isMobile ? 13 : 14,
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: 8,
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Email address"
                      style={{
                        width: "100%",
                        padding: isMobile ? "11px 14px" : "12px 16px",
                        border: "1.5px solid #d1d5db",
                        borderRadius: 8,
                        fontFamily: SF,
                        fontSize: isMobile ? 14 : 15,
                        color: "#1f2937",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#ca8a04"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontFamily: SF,
                      fontSize: isMobile ? 13 : 14,
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: 8,
                    }}>
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      style={{
                        width: "100%",
                        padding: isMobile ? "11px 14px" : "12px 16px",
                        border: "1.5px solid #d1d5db",
                        borderRadius: 8,
                        fontFamily: SF,
                        fontSize: isMobile ? 14 : 15,
                        color: "#1f2937",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#ca8a04"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontFamily: SF,
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 8,
                  }}>
                    Subject *
                  </label>
                  <select 
                    style={{
                      width: "100%",
                      padding: isMobile ? "11px 14px" : "12px 16px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      fontFamily: SF,
                      fontSize: isMobile ? 14 : 15,
                      color: "#1f2937",
                      outline: "none",
                      background: "#fff",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#ca8a04"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="appointment">Appointment Booking</option>
                    <option value="custom">Custom Jewellery Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontFamily: SF,
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 8,
                  }}>
                    Message *
                  </label>
                  <textarea
                    rows={isMobile ? 4 : 5}
                    placeholder="Write your message here..."
                    style={{
                      width: "100%",
                      padding: isMobile ? "11px 14px" : "12px 16px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      fontFamily: SF,
                      fontSize: isMobile ? 14 : 15,
                      color: "#1f2937",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#ca8a04"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px" : "14px",
                    background: "#ca8a04",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontFamily: SF,
                    fontSize: isMobile ? 14 : 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#a16207"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ca8a04"}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 24 : 32 }}>
              {/* Store Information */}
              <div 
                className="contact-card"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  padding: isMobile ? "24px 20px" : isTablet ? "28px" : "32px",
                }}
              >
                <h2 style={{
                  fontFamily: SF,
                  fontSize: isMobile ? 18 : 20,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 24,
                }}>
                  Store Information
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 12 : 16 }}>
                    <span style={{ fontSize: isMobile ? 24 : 28, flexShrink: 0 }}>📍</span>
                    <div>
                      <h3 style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 14 : 15,
                        fontWeight: 600,
                        color: "#1f2937",
                        marginBottom: 4,
                      }}>Address</h3>
                      <p style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 13 : 14,
                        color: "#6b7280",
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        Flat No: 27-14-17, Shop No: 4,<br />
                        Rajagopalachari Street, Governorpet,<br />
                        Vijayawada, Andhra Pradesh 520002<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 12 : 16 }}>
                    <span style={{ fontSize: isMobile ? 24 : 28, flexShrink: 0 }}>📞</span>
                    <div>
                      <h3 style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 14 : 15,
                        fontWeight: 600,
                        color: "#1f2937",
                        marginBottom: 4,
                      }}>Phone</h3>
                      <p style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 13 : 14,
                        color: "#6b7280",
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        +91 99591 45959<br />
                        +91 866 2576870
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 12 : 16 }}>
                    <span style={{ fontSize: isMobile ? 24 : 28, flexShrink: 0 }}>✉️</span>
                    <div>
                      <h3 style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 14 : 15,
                        fontWeight: 600,
                        color: "#1f2937",
                        marginBottom: 4,
                      }}>Email</h3>
                      <p style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 13 : 14,
                        color: "#6b7280",
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        Srikanth_tamiri@Yahoo.Co.In<br />
                        info@tamirijewellers.com
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 12 : 16 }}>
                    <span style={{ fontSize: isMobile ? 24 : 28, flexShrink: 0 }}>⏰</span>
                    <div>
                      <h3 style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 14 : 15,
                        fontWeight: 600,
                        color: "#1f2937",
                        marginBottom: 4,
                      }}>Business Hours</h3>
                      <p style={{
                        fontFamily: SF,
                        fontSize: isMobile ? 13 : 14,
                        color: "#6b7280",
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        Monday - Sunday: 10:00 AM - 9:00 PM<br />
                        All days open
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div 
                className="contact-card"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  aspectRatio: "16/9",
                  background: "linear-gradient(135deg, #fef3c7, #fed7aa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: isMobile ? 48 : 64 }}>🗺️</span>
                    <p style={{
                      fontFamily: SF,
                      fontSize: isMobile ? 14 : 16,
                      color: "#6b7280",
                      marginTop: isMobile ? 12 : 16,
                    }}>Map View</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
