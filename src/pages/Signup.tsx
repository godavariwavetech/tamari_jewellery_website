import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo-removebg.png';
import backgroundImg from '../assets/login-background.jpg';
import { apiService } from '../services/api';

const ValidatedInput = ({ name, type = 'text', style, pattern, placeholder, title, maxLength, minLength, required, onChange, onBlur, value: propValue }: any) => {
  const [error, setError] = useState('');
  const [internalValue, setInternalValue] = useState(propValue || '');

  useEffect(() => {
    if (propValue !== undefined) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if ((name === 'surname' || name === 'full_name' || name === 'legal_buss_name' || name.includes('_name'))) {
      val = val.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phn_number' || name === 'phn_numb' || name === 'whatsapp_num' || name.includes('_mobile') || name === 'aadhar_num' || name === 'pincode') {
      val = val.replace(/[^0-9]/g, '');
    } else if (name === 'pan_num' || name === 'pan_number' || name === 'gstin') {
      val = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    
    setInternalValue(val);
    e.target.value = val;
    if (onChange) onChange(e);

    if (error && e.target.validity.valid) {
      setError('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!internalValue && required) {
      setError('This field is required');
    } else if (e.target.validity.patternMismatch) {
      setError(title || 'Invalid format');
    } else if (e.target.validity.typeMismatch && type === 'email') {
      setError('Please enter a valid email address');
    } else if ((name === 'phn_number' || name === 'phn_numb' || name === 'whatsapp_num' || name.includes('_mobile')) && internalValue.length > 0 && internalValue.length < 10) {
      setError('Mobile number must be 10 digits');
    } else if (name === 'aadhar_num' && internalValue.length > 0 && internalValue.length < 12) {
      setError('Aadhar number must be 12 digits');
    } else {
      setError('');
    }
    if (onBlur) onBlur(e);
  };

  return (
    <>
      <input
        type={type}
        name={name}
        style={{ ...style, borderColor: error ? '#ef4444' : style?.borderColor }}
        pattern={pattern}
        placeholder={placeholder}
        title={title}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{error}</span>}
    </>
  );
};

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
      
      // Validate required fields
      const requiredFields = ['legal_buss_name', 'buss_type', 'gstin', 'pan_num', 'phn_numb'];
      for (const field of requiredFields) {
        const value = formData.get(field) as string;
        if (!value || value.trim() === '') {
          setError(`${field.replace(/_/g, ' ')} is required`);
          setLoading(false);
          return;
        }
      }
      
      // Validate authorized person (first one is required)
      if (!authorizedPersons[0]?.name || !authorizedPersons[0]?.mobile) {
        setError('First authorized person name and mobile are required');
        setLoading(false);
        return;
      }
      
      // Handle file uploads - convert to base64 if files exist
      let gstImg = '';
      let panImg = '';
      
      const gstFile = formData.get('gst_certificate') as File;
      const panFile = formData.get('pan_image') as File;
      
      if (gstFile && gstFile.size > 0) {
        gstImg = await fileToBase64(gstFile);
      }
      
      if (panFile && panFile.size > 0) {
        panImg = await fileToBase64(panFile);
      }
      
      // Match the exact API structure from Postman - all fields as strings
      const b2bData = {
        legal_buss_name: (formData.get('legal_buss_name') as string) || '',
        buss_type: (formData.get('buss_type') as string) || '',
        gstin: (formData.get('gstin') as string) || '',
        gst_image: gstImg,
        pan_num: (formData.get('pan_num') as string) || '',
        pan_imag: panImg, // Note: API expects 'pan_imag' not 'pan_image'
        buildin_no: (formData.get('buildin_no') as string) || '',
        street: (formData.get('street') as string) || '',
        locality: (formData.get('locality') as string) || '',
        city: (formData.get('city') as string) || '',
        district: (formData.get('district') as string) || '',
        state: (formData.get('state') as string) || '',
        pincode: (formData.get('pincode') as string) || '',
        name: authorizedPersons[0]?.name || '',
        role: authorizedPersons[0]?.role || '',
        phn_numb: (formData.get('phn_numb') as string) || '',
        email: (formData.get('email') as string) || '',
        whatsapp_num: (formData.get('whatsapp_num') as string) || '',
        usename: (formData.get('usename') as string) || '',
        createddate: new Date().toISOString()
      };
      
      console.log('Submitting B2B form with data:', b2bData);
      
      const response = await apiService.submitB2BForm(b2bData);
      
      console.log('B2B API Response received:', response);
      
      // Success - show success message
      setSuccess(true);
      setError(null);
      // Show success message for longer duration
      setTimeout(() => navigate('/login'), 4000);
      
    } catch (err: any) {
      console.error('B2B form submission error:', err);
      setError(err.message || 'Failed to submit B2B form. Please check your connection and try again.');
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
      
      // Validate required fields
      const requiredFields = ['surname', 'full_name', 'phn_number', 'aadhar_num'];
      for (const field of requiredFields) {
        const value = formData.get(field) as string;
        if (!value || value.trim() === '') {
          setError(`${field.replace(/_/g, ' ')} is required`);
          setLoading(false);
          return;
        }
      }
      
      // Handle file uploads - convert to base64 if files exist
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
      
      // Match the exact API structure from Postman - all fields as strings
      const b2cData = {
        surname: (formData.get('surname') as string) || '',
        full_name: (formData.get('full_name') as string) || '',
        email: (formData.get('email') as string) || '',
        phn_number: (formData.get('phn_number') as string) || '',
        aadhar_num: (formData.get('aadhar_num') as string) || '',
        aadhar_img: aadharImg,
        pan_number: (formData.get('pan_number') as string) || '',
        pan_img: panImg,
        building_no: (formData.get('building_no') as string) || '',
        street: (formData.get('street') as string) || '',
        locality: (formData.get('locality') as string) || '',
        city: (formData.get('city') as string) || '',
        district: (formData.get('district') as string) || '',
        state: (formData.get('state') as string) || '',
        pincode: (formData.get('pincode') as string) || '',
        createddate: new Date().toISOString()
      };
      
      console.log('Submitting B2C form with data:', b2cData);
      
      const response = await apiService.submitB2CForm(b2cData);
      
      console.log('B2C API Response received:', response);
      
      // Success - show success message
      setSuccess(true);
      setError(null);
      // Show success message for longer duration
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err: any) {
      console.error('B2C form submission error:', err);
      setError(err.message || 'Failed to submit B2C form. Please check your connection and try again.');
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
      <div style={{ 
        padding: '16px', 
        background: '#d4edda', 
        color: '#155724', 
        borderRadius: '8px', 
        marginBottom: '16px', 
        textAlign: 'center',
        border: '1px solid #c3e6cb'
      }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          ✓ B2B Form Submitted Successfully!
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          Your business application has been submitted for admin review. 
          <br />
          Admin acceptance is pending. After acceptance, we will inform you.
          <br />
          <span style={{ fontWeight: '500' }}>Redirecting to login page...</span>
        </div>
      </div>
    )}
    {error && (
      <div style={{ 
        padding: '16px', 
        background: '#f8d7da', 
        color: '#721c24', 
        borderRadius: '8px', 
        marginBottom: '16px', 
        textAlign: 'center',
        border: '1px solid #f5c6cb'
      }}>
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {error}
        </div>
      </div>
    )}
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
      marginBottom: '20px'
    }}>
      {loading ? 'Submitting...' : 'Continue'}
    </button>

    {/* Login Link */}
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#E4AC14',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            padding: '0',
          }}
        >
          Login here
        </button>
      </p>
    </div>

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
      <div style={{ 
        padding: '16px', 
        background: '#d4edda', 
        color: '#155724', 
        borderRadius: '8px', 
        marginBottom: '16px', 
        textAlign: 'center',
        border: '1px solid #c3e6cb'
      }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          ✓ B2C Form Submitted Successfully!
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          Your customer application has been submitted for admin review. 
          <br />
          Admin acceptance is pending. After acceptance, we will inform you.
          <br />
          <span style={{ fontWeight: '500' }}>Redirecting to login page...</span>
        </div>
      </div>
    )}
    {error && (
      <div style={{ 
        padding: '16px', 
        background: '#f8d7da', 
        color: '#721c24', 
        borderRadius: '8px', 
        marginBottom: '16px', 
        textAlign: 'center',
        border: '1px solid #f5c6cb'
      }}>
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {error}
        </div>
      </div>
    )}
    <h3 style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      fontWeight: '700', 
      color: '#E4AC14', 
      marginBottom: '14px', 
      marginTop: '0' 
    }}>User Details</h3>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Surname <span style={{ color: 'red' }}>*</span></label>
      <ValidatedInput type="text" name="surname" style={inputStyle} required />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Full Name <span style={{ color: 'red' }}>*</span></label>
      <ValidatedInput type="text" name="full_name" style={inputStyle} required />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Email ID (optional)</label>
      <ValidatedInput 
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
      <ValidatedInput 
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
      <ValidatedInput 
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
      <ValidatedInput 
        type="text" 
        name="pan_number"
        style={inputStyle}
        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
        placeholder="ABCDE1234F"
        title="Please enter a valid PAN number (e.g., ABCDE1234F)"
        maxLength={10}
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
      <ValidatedInput type="text" name="building_no" style={inputStyle} />
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Street</label>
      <ValidatedInput type="text" name="street" style={inputStyle} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: stackForms ? '1fr' : '1fr 1fr', gap: '14px' }}>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Locality</label>
        <ValidatedInput type="text" name="locality" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>City</label>
        <ValidatedInput type="text" name="city" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>District</label>
        <ValidatedInput type="text" name="district" style={inputStyle} />
      </div>
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>State</label>
        <ValidatedInput type="text" name="state" style={inputStyle} />
      </div>
    </div>

    <div style={fieldWrapStyle}>
      <label style={labelStyle}>PIN Code</label>
      <ValidatedInput 
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
      marginBottom: '20px'
    }}>
      {loading ? 'Submitting...' : 'Continue'}
    </button>

    {/* Login Link */}
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#E4AC14',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            padding: '0',
          }}
        >
          Login here
        </button>
      </p>
    </div>

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
