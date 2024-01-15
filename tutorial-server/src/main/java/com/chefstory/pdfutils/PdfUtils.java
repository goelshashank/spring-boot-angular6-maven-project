package com.chefstory.pdfutils;


import com.chefstory.pdfutils.pdf1.pdf.DocxToPDFExample;
import com.chefstory.pdfutils.pdf1.pdf.PDF2WordExample;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

public class PdfUtils {

    public static void main(String[] args) throws Exception {

        docxToPDF("/Users/shashankgoel/IdeaProjects/spring-boot-angular6-maven-project/data/docxToPdf/input.docx"
                ,"/Users/shashankgoel/IdeaProjects/spring-boot-angular6-maven-project/data/docxToPdf/out.pdf");

        pdfToDocx("/Users/shashankgoel/IdeaProjects/spring-boot-angular6-maven-project/data/PdfToDocx/pdf.pdf"
                ,"/Users/shashankgoel/IdeaProjects/spring-boot-angular6-maven-project/data/PdfToDocx/out.docx");



    }


/*
public reducePDF(){
    PDDocument doc = PDDocument.load(inputFile);
    for (PDPage page : doc.getPages()) {
        for (PDImageXObject image : page.getImages()) {
            PDImageXObject reducedImage =
                    JPEGFactory.createFromImage(image.getImage(), downsamplingFactor);
            image.setImage(reducedImage.getImage());
        }
    }
    doc.save(outputFile);

}
*/


// provide reduce size pdf option in all pdf conversions

    //organize pdf
        //merge
        //split
        //remove pages
        //extract pages
        //organize pdf
        //scan to pdf


    //optimize pdf
        //compress pdf
        //repair pdf
        // ocr pdf

    //convert to pdf
        //jpg to pdf

        //word
    public static void docxToPDF(String inputFilePath, String outputFilePath) throws Exception{
        DocxToPDFExample.apply(inputFilePath,outputFilePath);

    }

        //excel
        //html
        //powerpoint

    //convert from pdf
        //pdf to jpg
        //word
    public static void pdfToDocx(String inputFilePath, String outputFilePath) throws Exception{
        PDF2WordExample.apply(inputFilePath,outputFilePath);

    }
        //excel
        //html
        //powerpoint
        //pdf to pdf/a

    //edit pdf
        //rotate pdf
        //add page numbers
        //add watermark
        //edit pdf

    //pdf security
        //unlock pdf
        // protect pdf
        //sign pdf

}


