import docx

doc = docx.Document('input/BEA Mini_Project Phase2 Report - ISE.docx')

print('Number of sections:', len(doc.sections))
for i in range(len(doc.sections)):
    s = doc.sections[i]
    h_text = ''.join(p.text for p in s.header.paragraphs).strip()
    f_text = ''.join(p.text for p in s.footer.paragraphs).strip()
    if h_text or f_text or i < 3:
        print(f'Section {i}: Header: "{h_text}", Footer: "{f_text}"')
