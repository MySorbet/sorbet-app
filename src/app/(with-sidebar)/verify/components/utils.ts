import mime from 'mime-types';

/**
 * Accepted file types for a proof of address document
 * Should match backend validation
 * @see https://apidocs.bridge.xyz/reference/put_customers-customerid
 */
export const ACCEPTED_FILE_TYPES = ['pdf', 'jpeg', 'jpg', 'png', 'heic', 'tif'];

/**
 * Maximum file size for a proof of address document
 * Should match backend validation
 * @see https://apidocs.bridge.xyz/reference/put_customers-customerid
 */
export const MAX_FILE_SIZE_MB = 25;

/**
 * Convert bytes to MB
 * TODO: Consider sharing
 */
export const bytesToMB = (bytes: number) => bytes / 1024 / 1024;

/**
 * Check if a file is valid for upload to Bridge for a proof of address
 * @param file - The file to check
 * @returns True if the file is valid, false otherwise
 */
export const checkFileValid = (file?: File): file is File => {
  if (!file) return false;
  const ext = mime.extension(file.type);
  return (
    ext != false && // Should be a recognized file type
    ACCEPTED_FILE_TYPES.includes(ext) && // Should be one of the accepted file types
    bytesToMB(file.size) <= MAX_FILE_SIZE_MB // Should be less than 25MB
  );
};
