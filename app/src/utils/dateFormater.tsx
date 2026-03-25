
// ############
//  Purpose: Convert any date into a readable format like "12-11-2025"
// This utility function can be used anywhere in your project  ####################

export const dateFormater = (dateInput: string | Date | null) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

  // 🛑 1. If no date is given, return empty string

  // 📅 2. Convert given value into a Date object

  // ⚠️ 3. Check if date is valid (invalid date → skip)

  // padStart(2, '0') → if single digit (like 3), converts to "03"
  // 🏁 5. Return in format → DD-MM-YYYY
