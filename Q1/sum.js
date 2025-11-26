function sum(a, b) {
    // Validate inputs are numeric strings
    if (!/^\d+$/.test(a) || !/^\d+$/.test(b)) {
      throw new Error("Arguments must be numeric strings");
    }
    
    // Convert to numbers, add, convert back to string
    return String(Number(a) + Number(b));
  }

export { sum };