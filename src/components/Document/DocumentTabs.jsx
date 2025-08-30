import React from 'react';

const DocumentTabs = ({ activeTab, setActiveTab, isAdmin }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('my-documents')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'my-documents'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          My Documents
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('admin-documents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admin-documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin Documents
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              History
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default DocumentTabs;
