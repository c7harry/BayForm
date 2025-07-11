import React from 'react';
import Image from 'next/image';
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
  // Check if we should show QR code
  const shouldShowQR = personalInfo.qrCode?.enabled && personalInfo.qrCode.type !== 'none';
  
  let qrValue = '';
  
  // Determine which URL to use for the QR code if enabled
  if (shouldShowQR) {
    if (personalInfo.qrCode!.type === 'linkedin' && personalInfo.linkedIn) {
      qrValue = personalInfo.linkedIn.startsWith('http') 
        ? personalInfo.linkedIn 
        : `https://linkedin.com/in/${personalInfo.linkedIn}`;
    } else if (personalInfo.qrCode!.type === 'website' && personalInfo.website) {
      qrValue = personalInfo.website.startsWith('http') 
        ? personalInfo.website 
        : `https://${personalInfo.website}`;
    }
  }

  // Don't render anything if no QR code and no profile picture
  if (!shouldShowQR && !personalInfo.profilePicture) {
    return null;
  }

  // Don't render QR if enabled but no valid URL (but still show profile picture if available)
  const showQRCode = shouldShowQR && qrValue;

  // Theme-based styling
  const getQRStyle = () => {
    switch (theme) {
      case 'modern':
        return {
          fgColor: '#1f2937', // Gray-800
          bgColor: '#ffffff',
          border: 'rounded-lg',
          container: 'bg-white rounded-lg'
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
          fgColor: '#0f172a', // Slate-900
          bgColor: '#e2e8f0', // Slate-200
          border: 'border-2 border-slate-400 rounded-lg',
          container: 'bg-gradient-to-br from-slate-100 to-slate-200 p-1.0 rounded-lg shadow-md border border-slate-300'
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
      {showQRCode && (
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
      )}
      {personalInfo.profilePicture && (
        <div className={style.container}>
          <Image
            src={personalInfo.profilePicture}
            alt="Profile"
            width={size - 8}
            height={size - 8}
            className={`${style.border} object-cover`}
          />
        </div>
      )}
    </div>
  );
};
