import axios from "axios";

/**
 * Downloads a file via Axios as a blob and triggers a browser download.
 * Using Axios ensures the request respects the configured baseURL and
 * includes the necessary JWT auth tokens/headers.
 *
 * @param {string} url - The API endpoint to fetch the PDF from (e.g. '/api/receipt/download-receipt/123')
 * @param {string} filename - The name to save the file as (e.g. 'Donation_Receipt.pdf')
 * @returns {Promise<boolean>} Resolves to true if download succeeded, false otherwise.
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await axios.get(url, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (error) {
    console.error(`Download failed for ${url}:`, error);
    alert("Download failed. Please ensure the server is running and the record is valid.");
    return false;
  }
};
