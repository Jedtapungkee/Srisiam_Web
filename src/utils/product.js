  // Function to convert SIZE_XX format to display format
export const formatSizeForDisplay = (size) => {
    if (typeof size === "string" && size.startsWith("SIZE_")) {
      return size.replace("SIZE_", "");
    }
    return size;
  };