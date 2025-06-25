import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeSettings } from '@/types/resume';

interface QRCodeComponentProps {
  personalInfo: {
    linkedIn?: string;
    website?: string;
    qrCode?: QRCodeSettings;
  };
  size?: number;
  className?: string;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ 
  personalInfo, 
  size = 48, 
  className = '' 
}) => {
  // Don't render if QR code is disabled or no valid URL exists
  if (!personalInfo.qrCode?.enabled || personalInfo.qrCode.type === 'none') {
    return null;
  }

  let qrValue = '';
  
  // Determine which URL to use for the QR code
  if (personalInfo.qrCode.type === 'linkedin' && personalInfo.linkedIn) {
    qrValue = personalInfo.linkedIn.startsWith('http') 
      ? personalInfo.linkedIn 
      : `https://linkedin.com/in/${personalInfo.linkedIn}`;
  } else if (personalInfo.qrCode.type === 'website' && personalInfo.website) {
    qrValue = personalInfo.website.startsWith('http') 
      ? personalInfo.website 
      : `https://${personalInfo.website}`;
  }

  // Don't render if no valid URL
  if (!qrValue) {
    return null;
  }

  return (
    <div className={`flex-shrink-0 ${className}`}>
      <QRCodeSVG
        value={qrValue}
        size={size}
        level="M"
        includeMargin={false}
        className="border border-gray-300 rounded"
      />
    </div>
  );
};
