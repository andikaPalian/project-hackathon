import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPdf = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    disableFontFace: true,
    verbosity: 0,
  });
  const pdfDocument = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += `\n--- PAGE ${i} ---\n${pageText}`;
  }

  return fullText;
};
