import { CompleteProfile } from './addressGenerator';

// 导出为JSON格式
export function exportToJSON(data: CompleteProfile | CompleteProfile[], filename?: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `usa-identity-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 导出为CSV格式
export function exportToCSV(data: CompleteProfile[], filename?: string): void {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array for CSV export');
  }

  const headers = [
    'First Name',
    'Last Name', 
    'Full Name',
    'Email',
    'Phone',
    'SSN',
    'Date of Birth',
    'Age',
    'Gender',
    'Occupation',
    'Company',
    'Street Address',
    'City',
    'State',
    'State Abbreviation',
    'ZIP Code',
    'Latitude',
    'Longitude',
    'Credit Card Number',
    'Credit Card Type',
    'Credit Card Expiration',
    'Credit Card CVV'
  ];

  const csvRows = [
    headers.join(','),
    ...data.map(profile => [
      profile.personal.firstName,
      profile.personal.lastName,
      profile.personal.fullName,
      profile.personal.email,
      profile.personal.phone,
      profile.personal.ssn,
      profile.personal.dateOfBirth,
      profile.personal.age,
      profile.personal.gender,
      profile.personal.occupation,
      profile.personal.company,
      profile.address.street,
      profile.address.city,
      profile.address.state,
      profile.address.stateAbbreviation,
      profile.address.zipCode,
      profile.address.coordinates.lat,
      profile.address.coordinates.lng,
      profile.personal.creditCard.number,
      profile.personal.creditCard.type,
      profile.personal.creditCard.expirationDate,
      profile.personal.creditCard.cvv
    ].map(field => `"${field}"`).join(','))
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `usa-identity-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 导出为TXT格式（可读性强）
export function exportToTXT(data: CompleteProfile | CompleteProfile[], filename?: string): void {
  const profiles = Array.isArray(data) ? data : [data];
  
  const txtContent = profiles.map((profile, index) => {
    return `
=== PROFILE ${index + 1} ===

PERSONAL INFORMATION:
Name: ${profile.personal.fullName}
Email: ${profile.personal.email}
Phone: ${profile.personal.phone}
SSN: ${profile.personal.ssn}
Date of Birth: ${profile.personal.dateOfBirth}
Age: ${profile.personal.age}
Gender: ${profile.personal.gender}
Occupation: ${profile.personal.occupation}
Company: ${profile.personal.company}

ADDRESS:
${profile.address.street}
${profile.address.city}, ${profile.address.stateAbbreviation} ${profile.address.zipCode}
State: ${profile.address.state}
Coordinates: ${profile.address.coordinates.lat}, ${profile.address.coordinates.lng}

CREDIT CARD:
Number: ${profile.personal.creditCard.number}
Type: ${profile.personal.creditCard.type}
Expiration: ${profile.personal.creditCard.expirationDate}
CVV: ${profile.personal.creditCard.cvv}

${'='.repeat(50)}
    `.trim();
  }).join('\n\n');

  const blob = new Blob([txtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `usa-identity-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 复制到剪贴板
export async function copyToClipboard(data: CompleteProfile | CompleteProfile[]): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  
  try {
    await navigator.clipboard.writeText(jsonString);
  } catch (err) {
    // 降级方案：使用传统方法
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (copyErr) {
      throw new Error('Failed to copy to clipboard');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// 格式化显示单个档案
export function formatProfileForDisplay(profile: CompleteProfile): string {
  return `
**个人信息**
姓名: ${profile.personal.fullName}
邮箱: ${profile.personal.email}
电话: ${profile.personal.phone}
SSN: ${profile.personal.ssn}
生日: ${profile.personal.dateOfBirth} (${profile.personal.age}岁)
性别: ${profile.personal.gender}
职业: ${profile.personal.occupation}
公司: ${profile.personal.company}

**地址信息**
街道: ${profile.address.street}
城市: ${profile.address.city}
州: ${profile.address.state} (${profile.address.stateAbbreviation})
邮编: ${profile.address.zipCode}
坐标: ${profile.address.coordinates.lat.toFixed(6)}, ${profile.address.coordinates.lng.toFixed(6)}

**信用卡信息**
卡号: ${profile.personal.creditCard.number}
类型: ${profile.personal.creditCard.type}
到期: ${profile.personal.creditCard.expirationDate}
CVV: ${profile.personal.creditCard.cvv}
  `.trim();
}
