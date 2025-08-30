import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { documentsAPI, usersAPI } from '../services/api';
import {
  DocumentHeader,
  DocumentTabs,
  SearchAndFilters,
  DocumentSection,
  EmptyState,
  AdminDocumentManagement,
  UploadModal,
  SalarySlipUploadModal,
  SalarySlipHistory
} from '../components/Document';
import { 
  User,
  DollarSign,
  Share2,
  Briefcase
} from 'lucide-react';

const Documents = () => {
  const { user, isAdmin } = useAuth();
  const [documents, setDocuments] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSalaryUploadModal, setShowSalaryUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedUser, setSelectedUser] = useState('');
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    document_type: 'other',
    category: 'personal',
    is_public: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Documents: Starting to fetch data...');
      
      const [documentsRes, usersRes] = await Promise.all([
        documentsAPI.getMyDocuments(),
        isAdmin() ? usersAPI.getUsers() : Promise.resolve({ data: [] })
      ]);
      
      console.log('📊 Documents: API Response Received:', {
        documents: documentsRes.data,
        users: usersRes.data
      });
      
      setDocuments(documentsRes.data);
      setAllUsers(usersRes.data || []);
      
      console.log('✅ Documents: Data fetched successfully');
    } catch (error) {
      console.error('❌ Documents: Error fetching data:', error);
      setDocuments({});
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const fileInput = e.target.querySelector('input[name="file"]');
      
      console.log('🔍 Debug: Regular upload - File input found:', !!fileInput);
      console.log('🔍 Debug: Regular upload - Files length:', fileInput?.files?.length);
      
      if (!fileInput || fileInput.files.length === 0) {
        alert('Please select a file');
        return;
      }
      
      formData.append('file', fileInput.files[0]);
      formData.append('title', uploadFormData.title || fileInput.files[0].name);
      formData.append('description', uploadFormData.description);
      formData.append('document_type', uploadFormData.document_type);
      formData.append('category', uploadFormData.category);
      formData.append('is_public', uploadFormData.is_public);
      
      await documentsAPI.createDocument(formData);
      
      setShowUploadModal(false);
      setUploadFormData({
        title: '',
        description: '',
        document_type: 'other',
        category: 'personal',
        is_public: false
      });
      fetchData();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    }
  };

  const testFormDataConstruction = () => {
    console.log('🧪 Testing FormData construction...');
    
    const formData = new FormData();
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    formData.append('file', testFile);
    formData.append('user_id', 'test-user-id');
    formData.append('month', '8');
    formData.append('year', '2025');
    formData.append('title', 'Test Salary Slip');
    
    console.log('🧪 FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    console.log('🧪 FormData instanceof FormData:', formData instanceof FormData);
    console.log('🧪 FormData constructor:', formData.constructor.name);
    
    return formData;
  };

  const testAPICall = async () => {
    console.log('🧪 Testing API call with FormData...');
    
    try {
      // Get a real user ID first
      const usersResponse = await usersAPI.getUsers();
      const users = usersResponse.data;
      
      if (!users || users.length === 0) {
        console.log('🧪 No users found for testing');
        return;
      }
      
      const testUserId = users[0].id;
      console.log('🧪 Using test user ID:', testUserId);
      
      const formData = new FormData();
      const testFile = new File(['test salary slip content'], 'test_salary_slip.txt', { type: 'text/plain' });
      
      formData.append('file', testFile);
      formData.append('user_id', testUserId);
      formData.append('month', '12'); // December to avoid conflicts
      formData.append('year', '2025');
      formData.append('title', 'Test Salary Slip - December 2025');
      
      console.log('🧪 Sending test API call...');
      console.log('🧪 FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      const response = await documentsAPI.uploadSalarySlip(formData);
      console.log('🧪 Test API call successful:', response.data);
      alert('Test API call successful! Check console for details.');
      
    } catch (error) {
      console.error('🧪 Test API call failed:', error);
      console.error('🧪 Error response:', error.response?.data);
      console.error('🧪 Error status:', error.response?.status);
      alert(`Test API call failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSalarySlipUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const fileInput = e.target.querySelector('input[name="file"]');
      
      console.log('🔍 Debug: File input found:', !!fileInput);
      console.log('🔍 Debug: File input files:', fileInput?.files);
      console.log('🔍 Debug: Files length:', fileInput?.files?.length);
      
      if (!fileInput || fileInput.files.length === 0) {
        alert('Please select a file');
        return;
      }
      
      if (!selectedUser) {
        alert('Please select an employee');
        return;
      }
      
      const file = fileInput.files[0];
      console.log('🔍 Debug: Selected file:', file);
      console.log('🔍 Debug: File name:', file.name);
      console.log('🔍 Debug: File size:', file.size);
      console.log('🔍 Debug: File type:', file.type);
      
      // Clear any existing data
      formData.delete('file');
      formData.delete('user_id');
      formData.delete('month');
      formData.delete('year');
      formData.delete('title');
      
      // Append data with explicit field names
      formData.append('file', file);
      formData.append('user_id', selectedUser);
      formData.append('month', selectedMonth.toString());
      formData.append('year', selectedYear.toString());
      formData.append('title', `Salary Slip - ${selectedMonth}/${selectedYear}`);
      
      // Debug: Log FormData contents:
      console.log('🔍 Debug: FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Debug: Log the actual request that will be sent
      console.log('🔍 Debug: About to send request with:');
      console.log('  - URL: /documents/upload_salary_slip/');
      console.log('  - Method: POST');
      console.log('  - Content-Type: multipart/form-data');
      console.log('  - user_id:', selectedUser);
      console.log('  - month:', selectedMonth.toString());
      console.log('  - year:', selectedYear.toString());
      console.log('  - file:', file.name);
      
      await documentsAPI.uploadSalarySlip(formData);
      
      setShowSalaryUploadModal(false);
      setSelectedUser('');
      fetchData();
    } catch (error) {
      console.error('Error uploading salary slip:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Show specific error message based on response
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.error?.includes('already exists')) {
          alert('A salary slip for this month already exists. Please choose a different month.');
        } else if (errorData?.error) {
          alert(`Upload failed: ${errorData.error}`);
        } else {
          alert('Upload failed: Invalid data provided');
        }
      } else if (error.response?.status === 403) {
        alert('Access denied. Only admins can upload salary slips.');
      } else if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert('Failed to upload salary slip. Please try again.');
      }
    }
  };

  const documentTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'voter_id', label: 'Voter ID Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'resume', label: 'Resume' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'other', label: 'Other' }
  ];

  const filteredDocuments = (docList) => {
    if (!docList) return [];
    
    return docList.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DocumentHeader 
        isAdmin={isAdmin()}
        onUploadDocument={() => setShowUploadModal(true)}
        onUploadSalarySlip={() => setShowSalaryUploadModal(true)}
      />

      {/* Tabs */}
      <DocumentTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin()}
      />

      {/* Search and Filters - Only show for My Documents tab */}
      {activeTab === 'my-documents' && (
        <SearchAndFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Documents Content */}
      <div className="space-y-6">
        {activeTab === 'my-documents' && (
          <>
            {/* Personal Documents */}
            <DocumentSection
              title="Personal Documents"
              documents={documents.personal}
              icon={User}
              badgeVariant="blue"
              category="personal"
              filteredDocuments={filteredDocuments}
            />

            {/* Salary Documents */}
            <DocumentSection
              title="Salary Documents"
              documents={documents.salary}
              icon={DollarSign}
              badgeVariant="green"
              category="salary"
              filteredDocuments={filteredDocuments}
            />

            {/* Shared Documents */}
            <DocumentSection
              title="Shared Documents"
              documents={documents.shared}
              icon={Share2}
              badgeVariant="green"
              category="shared"
              filteredDocuments={filteredDocuments}
            />

            {/* Company Documents */}
            <DocumentSection
              title="Company Documents"
              documents={documents.company}
              icon={Briefcase}
              badgeVariant="purple"
              category="company"
              filteredDocuments={filteredDocuments}
            />

            {/* Empty State */}
            {Object.values(documents).every(category => !category || category.length === 0) && (
              <EmptyState onUploadClick={() => setShowUploadModal(true)} />
            )}
          </>
        )}

        {activeTab === 'admin-documents' && isAdmin() && (
          <AdminDocumentManagement 
            onUploadSalarySlip={() => setShowSalaryUploadModal(true)}
            onTestFormData={testAPICall}
          />
        )}

        {activeTab === 'history' && isAdmin() && (
          <SalarySlipHistory />
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleFileUpload}
        formData={uploadFormData}
        setFormData={setUploadFormData}
        documentTypes={documentTypes}
      />

      {/* Salary Slip Upload Modal */}
      <SalarySlipUploadModal
        isOpen={showSalaryUploadModal}
        onClose={() => setShowSalaryUploadModal(false)}
        onSubmit={handleSalarySlipUpload}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        allUsers={allUsers}
      />
    </div>
  );
};

export default Documents;
