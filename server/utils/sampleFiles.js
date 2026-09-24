const fs = require('fs');
const path = require('path');

const createSampleFiles = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create a minimal valid PDF content
  const samplePdfContent = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length 120
>>
stream
BT
/F1 24 Tf
70 700 Td
(PeerNotes - Academic Resource) Tj
/F1 14 Tf
0 -40 Td
(Verified student study guide & verified lecture notes.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000270 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
440
%%EOF`;

  const files = [
    'dbms_complete_notes.pdf',
    'os_process_scheduling.pdf',
    'dsa_trees_graphs_handbook.pdf',
    'cn_tcp_ip_osi_guide.pdf',
    'ai_search_algorithms_cheatsheet.pdf',
    'ml_supervised_regression_classification.pdf',
    'fullstack_react_nodejs_guide.pdf',
    'software_engineering_uml_agile.pdf',
    'discrete_mathematics_pyq_solved.pdf',
    'digital_electronics_lab_manual.pdf',
    'compiler_design_lecture_handout.pdf',
    'cloud_aws_docker_notes.pdf',
    'sample_notes_doc.docx',
    'sample_presentation.pptx'
  ];

  files.forEach((file) => {
    const filePath = path.join(uploadsDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, samplePdfContent);
    }
  });

  console.log('✅ Sample document files generated in uploads directory.');
};

module.exports = createSampleFiles;
