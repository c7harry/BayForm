import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeSettings } from '@/types/resume';

interface QRCodeComponentProps {
  personalInfo: {
    linkedIn?: string;
    website?: string;
    profilePicture?: string;
    qrCode?: QRCodeSettings;
  };
  size?: number;
  className?: string;
  theme?: 'default' | 'modern' | 'classic' | 'minimal' | 'tech' | 'elegant';
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ 
  personalInfo, 
  size = 80, 
  className = '',
  theme = 'default'
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

  // Theme-based styling
  const getQRStyle = () => {
    switch (theme) {
      case 'modern':
        return {
          fgColor: '#1f2937', // Gray-800
          bgColor: '#ffffff',
          border: 'border-2 border-gray-300 rounded-lg shadow-sm',
          container: 'bg-white p-1 rounded-lg shadow-sm'
        };
      case 'classic':
        return {
          fgColor: '#1e40af', // Blue-700
          bgColor: '#f8fafc',
          border: 'border-2 border-blue-200 rounded-md',
          container: 'bg-gradient-to-br from-blue-50 to-purple-50 p-1 rounded-md'
        };
      case 'minimal':
        return {
          fgColor: '#7c3aed', // Purple-600
          bgColor: '#ffffff',
          border: 'border border-purple-200 rounded-xl',
          container: 'bg-white p-1 rounded-xl shadow-md'
        };
      case 'tech':
        return {
          fgColor: '#10b981', // Green-500
          bgColor: '#111827', // Gray-900
          border: 'border border-green-500 rounded',
          container: 'bg-gray-900 p-1 rounded border border-green-500'
        };
      case 'elegant':
        return {
          fgColor: '#92400e', // Amber-700
          bgColor: '#fffbeb', // Amber-50
          border: 'border border-amber-300 rounded-sm',
          container: 'bg-gradient-to-br from-amber-50 to-yellow-50 p-1 rounded-sm'
        };
      default:
        return {
          fgColor: '#374151', // Gray-700
          bgColor: '#ffffff',
          border: 'border border-gray-300 rounded',
          container: 'bg-white p-1 rounded'
        };
    }
  };

  const style = getQRStyle();

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>
      <div className={style.container}>
        <QRCodeSVG
          value={qrValue}
          size={size - 8} // Slightly smaller to account for container padding
          level="M"
          includeMargin={false}
          fgColor={style.fgColor}
          bgColor={style.bgColor}
          className={style.border}
        />
      </div>
      {personalInfo.profilePicture && (
        <div className={style.container}>
          <img
            src={personalInfo.profilePicture}
            alt="Profile"
            className={`${style.border} object-cover`}
            style={{ width: size - 8, height: size - 8 }}
          />
        </div>
      )}
    </div>
  );
};
