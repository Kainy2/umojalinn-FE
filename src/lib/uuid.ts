// Helper function to check if the string is a valid UUID format
export function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}

// Helper function to check if the string is a valid Base62 encoded string
export function isValidBase62(base62: string): boolean {
  const base62Regex = /^[A-Za-z0-9]+$/;
  return base62Regex.test(base62);
}

// Base62 Alphabet
const base62Alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const base62Map: Record<string, number> = {};

// Create a map for Base62 to index
for (let i = 0; i < base62Alphabet.length; i++) {
  base62Map[base62Alphabet[i]] = i;
}

// Function to convert UUID to Base62
export function uuidToBase62(uuid: string): string | null {
  if (!isValidUuid(uuid)) return null;

  // Convert UUID to a Buffer (removing hyphens and treating as hexadecimal)
  const hexString = uuid.replace(/-/g, "");
  const buffer = Buffer.from(hexString, "hex");

  // Convert the Buffer to a Base62 string
  let base62 = "";
  let num = BigInt("0x" + buffer.toString("hex"));

  // Convert the number to Base62
  while (num > 0) {
    base62 = base62Alphabet[Number(num % 62n)] + base62;
    num = num / 62n;
  }

  // Handle case where UUID is all zeroes (should return a Base62 string with a length of 1)
  return base62 || base62Alphabet[0];
}

// Function to convert Base62 to UUID
export function base62ToUuid(base62: string): string | null {
  if (!isValidBase62(base62)) return null;

  // Convert Base62 string to a BigInt
  let num = 0n;
  for (let i = 0; i < base62.length; i++) {
    const index = base62Map[base62[i]];
    num = num * 62n + BigInt(index);
  }

  // Convert the BigInt to a hexadecimal string
  const hexString = num.toString(16).padStart(32, "0");

  // Format the hexadecimal string as a UUID (8-4-4-4-12 format)
  return [
    hexString.slice(0, 8),
    hexString.slice(8, 12),
    hexString.slice(12, 16),
    hexString.slice(16, 20),
    hexString.slice(20, 32),
  ].join("-");
}

export const uuidToBase62Safe = (id: string): string => {
  if (isValidUuid(id)) {
    return uuidToBase62(id) as string;
  }
  return id;
};

export const base62ToUuidSafe = (id: string): string => {
  if (isValidBase62(id)) {
    return base62ToUuid(id) as string;
  }
  return id;
};
