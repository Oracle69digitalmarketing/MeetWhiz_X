import React, { useState } from 'react';
import XMarkIcon from './icons/XMarkIcon';
import { ShareableContent } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareableContent;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, content }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call to backend/bot
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
          onClose();
          setIsSent(false);
      }, 2000); // Close modal after 2 seconds
    }, 1500);
  };
  
  const handleClose = () => {
    if (!isSending) {
        onClose();
        setIsSent(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Share to Group</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
            <h3 className="font-semibold text-gray-800 mb-2">Message Preview:</h3>
            <div className="p-4 bg-gray-50 border rounded-lg max-h-60 overflow-y-auto">
                <p className="font-bold text-gray-900">{content?.title}</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mt-2">{content?.text}</p>
            </div>
          <button
            onClick={handleSend}
            disabled={isSending || isSent}
            className="mt-4 w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            {isSending ? 'Sending...' : isSent ? 'Sent!' : 'Send to Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
