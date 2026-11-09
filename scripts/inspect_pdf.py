import pypdf

with open('input/BEA Mini_Project Phase2 Report - ISE.pdf', 'rb') as f:
    reader = pypdf.PdfReader(f)
    print(f'Total pages in input PDF: {len(reader.pages)}')
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        first_line = text.strip().split('\n')[0] if text.strip() else '[EMPTY]'
        last_line = text.strip().split('\n')[-1] if text.strip() else '[EMPTY]'
        print(f'Page {i+1:02d}: {first_line[:60]} ... | ... {last_line[:40]} (length: {len(text)})')
