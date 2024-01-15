package com.chefstory.pdfutils.pdf1.pdf;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.io.*;
import java.util.List;

public class DocxToPDFExample {

    public static void apply(String inputFilePath, String outputFilePath) throws IOException, DocumentException {
        InputStream docxInputStream = new FileInputStream(inputFilePath);
        try (XWPFDocument document = new XWPFDocument(docxInputStream); 
            OutputStream pdfOutputStream = new FileOutputStream(outputFilePath);) {
            Document pdfDocument = new Document();
            PdfWriter.getInstance(pdfDocument, pdfOutputStream);
            pdfDocument.open();

            List<XWPFParagraph> paragraphs = document.getParagraphs();
            for (XWPFParagraph paragraph : paragraphs) {
                pdfDocument.add(new Paragraph(paragraph.getText()));
            }
            pdfDocument.close();
        }

    }
}
