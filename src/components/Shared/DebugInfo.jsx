import React from 'react';

export const DebugInfo = () => {
  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg z-[999] text-xs">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <div>App should be visible</div>
      <div>Check console for errors</div>
      <div>Images exist in public/assets/images/</div>
      <button 
        onClick={() => console.log('Debug button clicked')}
        className="mt-2 bg-blue-500 px-2 py-1 rounded"
      >
        Test Console
      </button>
    </div>
  );
};
