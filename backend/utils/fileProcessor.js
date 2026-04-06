const pdf = require('pdf-parse');
const fs = require('fs');

/**
 * Process PDF file and extract text content
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
async function processPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
}

/**
 * Process DOCX file and extract text content
 * @param {string} filePath - Path to the DOCX file
 * @returns {string} Extracted text content
 */
function processDOCX(filePath) {
  // Implementation for DOCX processing would go here
  // For now, we'll just read the file as text
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error processing DOCX:', error);
    throw new Error('Failed to process DOCX file');
  }
}

/**
 * Process TXT file and extract text content
 * @param {string} filePath - Path to the TXT file
 * @returns {string} Extracted text content
 */
function processTXT(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error processing TXT:', error);
    throw new Error('Failed to process TXT file');
  }
}

module.exports = {
  processPDF,
  processDOCX,
  processTXT
};