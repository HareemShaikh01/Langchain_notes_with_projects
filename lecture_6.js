// lets load documents (pdf) but it can load pdf, txt, web, csv or any other
// need to install @langchain/community

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("sample pdf.pdf");

const doc = await loader.load()

console.log(doc);
