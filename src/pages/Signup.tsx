import { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo-removebg.png';
import backgroundImg from '../assets/login-background.jpg';
import { apiService } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'business' | 'customer' | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [authorizedPersons, setAuthorizedPersons] = useState([{ id: 1, name: '', role: '', mobile: '' }]);

  useLayoutEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;
  const stackForms = windowWidth < 1150; // New threshold for form fields to stack

  const handleContinue = (type: 'business' | 'customer') => {
    setAccountType(type);
    setError(null);
    setSuccess(false);
  };

  const addAuthorizedPerson = () => {
    setAuthorizedPersons(prev => [...prev, { 
      id: prev.length + 1, 
      name: '', 
      role: '', 
      mobile: '' 
    }]);
  };

  const removeAuthorizedPerson = (id: number) => {
    if (authorizedPersons.length > 1) {
      setAuthorizedPersons(prev => prev.filter(person => person.id !== id));
    }
  };

  const updateAuthorizedPerson = (id: number, field: string, value: string) => {
    setAuthorizedPersons(prev => prev.map(person => 
      person.id === id ? { ...person, [field]: value } : person
    ));
  };

  // B2B Form Submit Handler
  const handleB2BSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Collect all form data
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Collect authorized persons data
      const authorizedPersonsData = authorizedPersons.map(person => ({
        name: person.name,
        role: person.role,
        mobile: person.mobile
      }));
      
      const b2bData = {
        legal_buss_name: formData.get('legal_buss_name') as string,
        buss_type: formData.get('buss_type') as string,
        gstin: formData.get('gstin') as string,
        gst_image: '', // File upload will be handled separately
        pan_num: formData.get('pan_num') as string,
        pan_imag: '', // File upload will be handled separately
        buildin_no: formData.get('buildin_no') as string,
        street: formData.get('street') as string,
        locality: formData.get('locality') as string,
        city: formData.get('city') as string,
        district: formData.get('district') as string,
        state: formData.get('state') as string,
        pincode: formData.get('pincode') as string,
        name: authorizedPersonsData[0]?.name || '',
        role: authorizedPersonsData[0]?.role || '',
        phn_numb: formData.get('phn_numb') as string,
        email: formData.get('email') as string,
        whatsapp_num: formData.get('whatsapp_num') as string,
        usename: formData.get('usename') as string,
        authorized_persons: authorizedPersonsData,
        createddate: new Date().toISOString()
      };
      
      const response = await apiService.submitB2BForm(b2bData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Failed to submit B2B form');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit B2B form');
    } finally {
      setLoading(false);
    }
  };

  // File to Base64 conversion helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // B2C Form Submit Handler  
  const handleB2CSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Handle file uploads
      let aadharImg = '';
      let panImg = '';
      
      const aadharFile = formData.get('aadhar_image') as File;
      const panFile = formData.get('pan_image') as File;
      
      if (aadharFile && aadharFile.size > 0) {
        aadharImg = await fileToBase64(aadharFile);
      }
      
      if (panFile && panFile.size > 0) {
        panImg = await fileToBase64(panFile);
      }
      
      const b2cData = {
        surname: formData.get('surname') as string,
        full_name: formData.get('full_name') as string,
        email: formData.get('email') as string,
        phn_number: formData.get('phn_number') as string,
        aadhar_num: formData.get('aadhar_num') as string,
        aadhar_img: aadharImg,
        pan_number: formData.get('pan_number') as string,
        pan_img: panImg,
        building_no: formData.get('building_no') as string,
        street: formData.get('street') as string,
        locality: formData.get('locality') as string,
        city: formData.get('city') as string,
        district: formData.get('district') as string,
        state: formData.get('state') as string,
        pincode: formData.get('pincode') as string,
        createddate: new Date().toISOString()
      };
      
      const response = await apiService.submitB2CForm(b2cData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Failed to submit B2C form');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit B2C form');
    } finally {
      setLoading(false);
    }
  };

  const renderSelection = () => (
    <div style={{ 
      width: '100%', 
      maxWidth: '450px', 
      border: '2.5px solid #E7C25C', 
      borderRadius: '16px', 
      padding: isMobile ? '20px 0' : '30px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', color: '#000000', marginBottom: '5px' }}>Business Account</h2>
        <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#3E4851', marginBottom: '15px' }}>Access your business account to purchase jewellery in bulk at company Manufacturing price.</p>
        <button onClick={() => handleContinue('business')} style={{ width: '100%', padding: '15px', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#fff', backgroundColor: '#E4AC14', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Continue</button>
      </div>
      <div>
        <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', color: '#000000', marginBottom: '5px' }}>Customer Account</h2>
        <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#3E4851', marginBottom: '15px' }}>Access your Customer account to browse, select, and purchase beautiful jewellery designs.</p>
        <button onClick={() => handleContinue('customer')} style={{ width: '100%', padding: '15px', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#fff', backgroundColor: '#E4AC14', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Continue</button>
      </div>
    </div>
  );


const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '2px solid #CFD4E0',
  borderRadius: '8px',
  fontSize: isMobile ? '16px' : '18px',
  color: '#333',
  background: '#f7f9fc',
  outline: 'none',
  boxSizing: 'border-box',
};

const fileUploadStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px dashed #c0c8d4',
  borderRadius: '8px',
  padding: '22px 0',
  background: '#f7f9fc',
  cursor: 'pointer',
  gap: '6px',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '15px',
  color: '#333',
  marginBottom: '5px',
  fontWeight: '400',
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
};

const fieldWrapStyle: React.CSSProperties = { marginBottom: '14px' };
const renderBusinessForm = () => (
  <form onSubmit={handleB2BSubmit} style={{ 
    width: '100%', 
    maxWidth: '560px', 
    padding: isMobile ? '20px 0 40px' : '24px 20px 40px', 
    fontFamily: "'Times New Roman', Times, serif",
    boxSizing: 'border-box'
  }}>

    {/* Top Badge */}
    <div style={{ textAlign: 'center', marginBottom: '18px' }}>
      <button style={{ 
        background: '#E4AC14', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '20px', 
        padding: isMobile ? '7px 20px' : '9px 28px', 
        fontSize: isMobile ? '16px' : '18px', 
        fontWeight: '600', 
        cursor: 'pointer' 
      }}>
        Business to Business
      </button>
    </div>

    {/* Title */}
    <h2 style={{ 
      textAlign: 'left', 
      fontSize: isMobile ? '20px' : '24px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '20px', 
      marginTop: '0' 
    }}>
      Business to Business Login
    </h2>

    {/* Success/Error Messages */}
    {success && (
      <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
        ✓ Form submitted successfully! Redirecting...
      </div>
    )}
    {error && (
      <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
        {error}
      </div>
    )}

    {/* ── Business Details ── */}
    <h3 style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '14px', 
      marginTop: '0' 
    }}>Business Details</h3>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Legal Business Name</label>
      <input type="text" name="legal_buss_name" style={inputStyle} />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Business Type</label>
      <div style={{ position: 'relative' }}>
        <select name="buss_type" style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }} required>
          <option value="">Select Business Type</option>
          <option value="Gold jewelry retail shop">Gold jewelry retail shop</option>
          <option value="Gold jewelry manufacturing">Gold jewelry manufacturing</option>
          <option value="Gold buying (scrap gold business)">Gold buying (scrap gold business)</option>
          <option value="Gold loan (pawn) business">Gold loan (pawn) business</option>
          <option value="Gold trading (bullion/coins)">Gold trading (bullion/coins)</option>
          <option value="Others">Others</option>
        </select>
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '12px', color: '#666' }}>▾</span>
      </div>
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>GSTIN</label>
      <input 
        type="text" 
        name="gstin" 
        style={inputStyle}
        pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
        placeholder="22AAAAA0000A1Z5"
        title="Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)"
        maxLength={15}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
        }}
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>GST Certificate (Upload)</label>
      <label style={fileUploadStyle}>
        <input 
          type="file" 
          name="gst_certificate"
          accept="image/*,.pdf"
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const label = e.target.parentElement;
              if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = file.name;
              }
            }
          }}
        />
        <svg width="36" height="46" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="6" fill="#e8edf4" />
          <path d="M11 24h14M18 12v8m0-8-3 3m3-3 3 3" stroke="#aab2bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="12" r="5" fill="#e8edf4" stroke="#aab2bf" strokeWidth="1.5" />
          <path d="M24 10v4M22 12h4" stroke="#aab2bf" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>Click to upload GST Certificate</span>
      </label>
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PAN Number</label>
      <input 
        type="text" 
        name="pan_num"
        style={inputStyle}
        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
        placeholder="ABCDE1234F"
        title="Please enter a valid PAN number (e.g., ABCDE1234F)"
        maxLength={10}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
        }}
        required
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PAN Card (Upload)</label>
      <label style={fileUploadStyle}>
        <input 
          type="file" 
          name="pan_image"
          accept="image/*,.pdf"
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const label = e.target.parentElement;
              if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = file.name;
              }
            }
          }}
        />
        <svg width="36" height="46" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="6" fill="#e8edf4" />
          <path d="M11 24h14M18 12v8m0-8-3 3m3-3 3 3" stroke="#aab2bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="12" r="5" fill="#e8edf4" stroke="#aab2bf" strokeWidth="1.5" />
          <path d="M24 10v4M22 12h4" stroke="#aab2bf" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>Click to upload PAN Card</span>
      </label>
    </div>

    {/* ── Business Address ── */}
    <h3 style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '14px', 
      marginTop: '6px' 
    }}>Business Address</h3>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Building/Flat No</label>
      <input type="text" name="buildin_no" style={inputStyle} />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Street</label>
      <input type="text" name="street" style={inputStyle} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: stackForms ? '1fr' : '1fr 1fr', gap: '14px' }}>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Locality</label>
        <input type="text" name="locality" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>City</label>
        <input type="text" name="city" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>District</label>
        <input type="text" name="district" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>State</label>
        <input type="text" name="state" style={inputStyle} />
      </div>
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PIN Code</label>
      <input 
        type="text" 
        name="pincode" 
        style={inputStyle}
        pattern="[0-9]{6}"
        placeholder="123456"
        title="Please enter a valid 6-digit PIN code"
        maxLength={6}
      />
    </div>

    {/* ── Authorized Persons ── */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '14px', 
      marginTop: '6px' 
    }}>
      <h3 style={{ 
        fontSize: isMobile ? '16px' : '18px', 
        fontWeight: '700', 
        color: '#E4AC14', 
        margin: '0' 
      }}>Authorized Persons</h3>
      <button 
        type="button"
        onClick={addAuthorizedPerson}
        style={{ 
          background: 'transparent', 
          color: '#E4AC14', 
          border: '1.5px solid #E4AC14', 
          borderRadius: '6px', 
          padding: '5px 18px', 
          fontSize: isMobile ? '14px' : '16px', 
          fontWeight: '600', 
          cursor: 'pointer' 
        }}
      >
        Add
      </button>
    </div>

    {authorizedPersons.map((person, index) => (
      <div key={person.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', position: 'relative' }}>
        {authorizedPersons.length > 1 && (
          <button
            type="button"
            onClick={() => removeAuthorizedPerson(person.id)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ×
          </button>
        )}
        
        <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '10px', marginTop: '0' }}>
          Person {index + 1} {index === 0 && <span style={{ color: 'red' }}>*</span>}
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: stackForms ? '1fr' : '1fr 1fr', gap: '14px' }}>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Full Name {index === 0 && <span style={{ color: 'red' }}>*</span>}</label>
            <input 
              type="text" 
              name={`authorized_person_${person.id}_name`}
              value={person.name}
              onChange={(e) => updateAuthorizedPerson(person.id, 'name', e.target.value)}
              style={inputStyle}
              required={index === 0}
            />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Role</label>
            <input 
              type="text" 
              name={`authorized_person_${person.id}_role`}
              value={person.role}
              onChange={(e) => updateAuthorizedPerson(person.id, 'role', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={fieldWrapStyle}>
          <label style={labelStyle}>Mobile Number {index === 0 && <span style={{ color: 'red' }}>*</span>}</label>
          <input 
            type="tel" 
            name={`authorized_person_${person.id}_mobile`}
            value={person.mobile}
            onChange={(e) => updateAuthorizedPerson(person.id, 'mobile', e.target.value)}
            style={inputStyle}
            pattern="[0-9]{10}"
            placeholder="9876543210"
            title="Please enter a valid 10-digit mobile number"
            maxLength={10}
            required={index === 0}
          />
        </div>
      </div>
    ))}

    {/* ── Account Setup ── */}
    <h3 style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '14px', 
      marginTop: '6px' 
    }}>Account Setup</h3>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Email Address</label>
      <input 
        type="email" 
        name="email"
        style={inputStyle}
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        placeholder="example@email.com"
        title="Please enter a valid email address"
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Mobile Number <span style={{ color: 'red' }}>*</span></label>
      <span style={{ display: 'block', fontSize: '12px', color: '#F45151', marginBottom: '5px' }}>enter a phone number linked with WhatsApp.</span>
      <input 
        type="tel" 
        name="phn_numb"
        style={inputStyle}
        pattern="[0-9]{10}"
        placeholder="9876543210"
        title="Please enter a valid 10-digit mobile number"
        maxLength={10}
        required
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>WhatsApp Number</label>
      <input 
        type="tel" 
        name="whatsapp_num"
        style={inputStyle}
        pattern="[0-9]{10}"
        placeholder="9876543210"
        title="Please enter a valid 10-digit WhatsApp number"
        maxLength={10}
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Username</label>
      <input 
        type="text" 
        name="usename"
        style={inputStyle}
        pattern="[a-zA-Z0-9_]{3,20}"
        placeholder="username123"
        title="Username should be 3-20 characters long and contain only letters, numbers, and underscores"
        minLength={3}
        maxLength={20}
      />
    </div>

    {/* Terms */}
    <p style={{ fontSize: '16px', color: '#666', textAlign: 'center', marginBottom: '18px', marginTop: '4px' }}>
      By continuing, I agree to <a href="/terms" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Terms of Use</a> & <a href="/privacy" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Privacy Policy</a>.
    </p>

    {/* Continue */}
    <button type="submit" disabled={loading} style={{ 
      width: '100%', 
      padding: '14px', 
      fontSize: '18px', 
      fontWeight: '600', 
      color: '#fff', 
      backgroundColor: loading ? '#ccc' : '#E4AC14', 
      border: 'none', 
      borderRadius: '28px', 
      cursor: loading ? 'not-allowed' : 'pointer',
      marginBottom: '40px'
    }}>
      {loading ? 'Submitting...' : 'Continue'}
    </button>

  </form>
);

 const renderCustomerForm = () => (
  <form onSubmit={handleB2CSubmit} style={{ 
    width: '100%', 
    maxWidth: '560px', 
    padding: isMobile ? '20px 0 40px' : '24px 20px 40px', 
    fontFamily: "'Times New Roman', Times, serif",
    boxSizing: 'border-box'
  }}>

    {/* Top Badge */}
    <div style={{ textAlign: 'center', marginBottom: '18px' }}>
      <button type="button" style={{ 
        background: '#E4AC14', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '20px', 
        padding: isMobile ? '7px 20px' : '9px 28px', 
        fontSize: isMobile ? '16px' : '18px', 
        fontWeight: '600', 
        cursor: 'pointer' 
      }}>
        Business to Customer
      </button>
    </div>

    {/* Title */}
    <h2 style={{ 
      textAlign: 'left', 
      fontSize: isMobile ? '20px' : '24px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '20px', 
      marginTop: '0' 
    }}>
      Business to Customer Login
    </h2>

    {/* Success/Error Messages */}
    {success && (
      <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
        ✓ Form submitted successfully! Redirecting...
      </div>
    )}
    {error && (
      <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
        {error}
      </div>
    )}

    {/* ── User Details ── */}
    <h3 style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '14px', 
      marginTop: '0' 
    }}>User Details</h3>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Surname <span style={{ color: 'red' }}>*</span></label>
      <input type="text" name="surname" style={inputStyle} required />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Full Name <span style={{ color: 'red' }}>*</span></label>
      <input type="text" name="full_name" style={inputStyle} required />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Email ID (optional)</label>
      <input 
        type="email" 
        name="email"
        style={inputStyle}
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        placeholder="example@email.com"
        title="Please enter a valid email address"
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Mobile Number <span style={{ color: 'red' }}>*</span></label>
      <span style={{ display: 'block', fontSize: '12px', color: '#F45151', marginBottom: '5px' }}>enter a phone number linked with WhatsApp.</span>
      <input 
        type="tel" 
        name="phn_number"
        style={inputStyle}
        pattern="[0-9]{10}"
        placeholder="9876543210"
        title="Please enter a valid 10-digit mobile number"
        maxLength={10}
        required
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Aadhar Number <span style={{ color: 'red' }}>*</span></label>
      <input 
        type="text" 
        name="aadhar_num"
        style={inputStyle}
        pattern="[0-9]{12}"
        placeholder="123456789012"
        title="Please enter a valid 12-digit Aadhar number"
        maxLength={12}
        required
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Aadhar (Upload)</label>
      <label style={fileUploadStyle}>
        <input 
          type="file" 
          name="aadhar_image"
          accept="image/*,.pdf"
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const label = e.target.parentElement;
              if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = file.name;
              }
            }
          }}
        />
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="6" fill="#e8edf4" />
          <path d="M11 24h14M18 12v8m0-8-3 3m3-3 3 3" stroke="#aab2bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="12" r="5" fill="#e8edf4" stroke="#aab2bf" strokeWidth="1.5" />
          <path d="M24 10v4M22 12h4" stroke="#aab2bf" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>Click to upload Aadhar</span>
      </label>
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PAN Number</label>
      <input 
        type="text" 
        name="pan_number"
        style={inputStyle}
        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
        placeholder="ABCDE1234F"
        title="Please enter a valid PAN number (e.g., ABCDE1234F)"
        maxLength={10}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
        }}
      />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PAN Card (Upload)</label>
      <label style={fileUploadStyle}>
        <input 
          type="file" 
          name="pan_image"
          accept="image/*,.pdf"
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const label = e.target.parentElement;
              if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = file.name;
              }
            }
          }}
        />
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="6" fill="#e8edf4" />
          <path d="M11 24h14M18 12v8m0-8-3 3m3-3 3 3" stroke="#aab2bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="12" r="5" fill="#e8edf4" stroke="#aab2bf" strokeWidth="1.5" />
          <path d="M24 10v4M22 12h4" stroke="#aab2bf" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>Click to upload PAN Card</span>
      </label>
    </div>

    {/* ── Delivery Address ── */}
    <h3 style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '14px', 
      marginTop: '6px' 
    }}>Delivery Address</h3>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Building/Flat No</label>
      <input type="text" name="building_no" style={inputStyle} />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Street</label>
      <input type="text" name="street" style={inputStyle} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: stackForms ? '1fr' : '1fr 1fr', gap: '14px' }}>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Locality</label>
        <input type="text" name="locality" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>City</label>
        <input type="text" name="city" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>District</label>
        <input type="text" name="district" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>State</label>
        <input type="text" name="state" style={inputStyle} />
      </div>
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PIN Code</label>
      <input 
        type="text" 
        name="pincode"
        style={inputStyle}
        pattern="[0-9]{6}"
        placeholder="123456"
        title="Please enter a valid 6-digit PIN code"
        maxLength={6}
      />
    </div>

    {/* Terms */}
    <p style={{ fontSize: '16px', color: '#666', textAlign: 'center', marginBottom: '18px', marginTop: '4px' }}>
      By continuing, I agree to <a href="/terms" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Terms of Use</a> & <a href="/privacy" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Privacy Policy</a>.
    </p>

    {/* Continue */}
    <button type="submit" disabled={loading} style={{ 
      width: '100%', 
      padding: '14px', 
      fontSize: '18px', 
      fontWeight: '600', 
      color: '#fff', 
      backgroundColor: loading ? '#ccc' : '#E4AC14', 
      border: 'none', 
      borderRadius: '28px', 
      cursor: loading ? 'not-allowed' : 'pointer',
      marginBottom: '40px'
    }}>
      {loading ? 'Submitting...' : 'Continue'}
    </button>

  </form>
);



  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Left Side - Logo and Background */}
      {!isMobile && (
        <div style={{
          flex: '0 0 40%',
          minWidth: '400px',
          height: '100vh',
          background: `url(${backgroundImg}) no-repeat center center`,
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }} />
          
          {/* Logo */}
          <div style={{
            textAlign: 'center',
            zIndex: 2
          }}>
            <img 
              src={logoImg} 
              alt="Tamiri Jewellers" 
              style={{
                width: '300px',
                height: 'auto',
              }}
            />
          </div>
        </div>
      )}

      {/* Right Side - Signup Form */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '20px 24px 60px' : '40px 20px 100px',
        backgroundColor: '#fff',
        boxSizing: 'border-box'
      }}>
        {isMobile && (
          <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
            <img src={logoImg} alt="Tamiri" style={{ width: '150px', height: 'auto' }} />
          </div>
        )}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          margin: isMobile ? '0' : 'auto 0',
          boxSizing: 'border-box'
        }}>
          {!accountType && renderSelection()}
          {accountType === 'business' && renderBusinessForm()}
          {accountType === 'customer' && renderCustomerForm()}
        </div>
      </div>
    </div>
  );
};

export default Signup;
