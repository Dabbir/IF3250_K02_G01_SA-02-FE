/**
 * Format a date to DD MMMM YYYY format in Indonesian
 * @param date Date object or date string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  
  /**
   * Format time to HH:MM format
   * @param date Date object or date string
   * @returns Formatted time string
   */
  export const formatTime = (date: Date | string): string => {
    const d = new Date(date);
    
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  /**
   * Format datetime to WIB (Waktu Indonesia Barat) format
   * @param date Date object or date string
   * @returns Formatted datetime string in WIB
   */
  export const formatDateTimeToWIB = (date: Date | string): string => {
    const d = new Date(date);
    
    return `${formatDate(d)} - ${formatTime(d)} WIB`;
  };
  
  /**
   * Convert ISO date to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
   * @param isoDate ISO date string
   * @returns MySQL datetime string
   */
  export const isoToMySQLDateTime = (isoDate: string): string => {
    return new Date(isoDate).toISOString().replace('T', ' ').slice(0, 19);
  };
  
  /**
   * Check if a date is in the past
   * @param date Date to check
   * @returns true if date is in the past
   */
  export const isDatePast = (date: Date | string): boolean => {
    const d = new Date(date);
    const now = new Date();
    return d < now;
  };
  
  /**
   * Calculate the duration between two dates in hours
   * @param start Start date
   * @param end End date
   * @returns Duration in hours
   */
  export const getDurationInHours = (start: Date | string, end: Date | string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    return Math.round(durationHours * 10) / 10; // Round to 1 decimal place
  };

  export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};