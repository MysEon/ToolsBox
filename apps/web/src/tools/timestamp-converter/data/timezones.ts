export interface TimezoneOption {
  value: string;
  label: string;
}

export const timezones: TimezoneOption[] = [
  { value: 'UTC', label: 'UTC+0 协调世界时' },
  { value: 'Asia/Shanghai', label: 'UTC+8 上海' },
  { value: 'Asia/Hong_Kong', label: 'UTC+8 香港' },
  { value: 'Asia/Tokyo', label: 'UTC+9 东京' },
  { value: 'America/New_York', label: 'UTC-5 纽约' },
  { value: 'America/Los_Angeles', label: 'UTC-8 洛杉矶' },
  { value: 'America/Chicago', label: 'UTC-6 芝加哥' },
  { value: 'Europe/London', label: 'UTC+0 伦敦' },
  { value: 'Europe/Berlin', label: 'UTC+1 柏林' },
  { value: 'Europe/Paris', label: 'UTC+1 巴黎' },
  { value: 'Australia/Sydney', label: 'UTC+10 悉尼' },
  { value: 'Pacific/Auckland', label: 'UTC+12 奥克兰' },
];
