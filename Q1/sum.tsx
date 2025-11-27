import { pathToFileURL } from 'url';

function sum(a: string, b: string): string {
    // Validate inputs are numeric strings
    if (!/^\d+$/.test(a) || !/^\d+$/.test(b)) {
      throw new Error("Arguments must be numeric strings");
    }
    
    // Convert to numbers, add, convert back to string
    return String(Number(a) + Number(b));
  }

export { sum };

// check if the script is being run directly
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  const args = process.argv.slice(2);
  
  // check if the number of arguments is 2
  if (args.length !== 2) {
    console.error("Usage: node sum.tsx <number1> <number2>");
    process.exit(1);
  }

  const [a, b] = args;

  try {
    const result = sum(a, b);
    console.log(result, typeof result);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
}

