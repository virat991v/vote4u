import os
import pypdf

pdf_files = ["design doc.pdf", "product doc.pdf", "pronpt doc.pdf", "ui doc.pdf", "workfloow.pdf"]

for pdf in pdf_files:
    try:
        reader = pypdf.PdfReader(pdf)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        
        out_name = pdf.replace(".pdf", ".txt")
        with open(out_name, "w", encoding="utf-8", errors="ignore") as f:
            f.write(text)
        print(f"Successfully converted {pdf} to {out_name}")
    except Exception as e:
        print(f"Error reading {pdf}: {e}")
