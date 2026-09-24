require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Resource = require('./models/Resource');
const Review = require('./models/Review');
const Bookmark = require('./models/Bookmark');
const Report = require('./models/Report');
const CreditTransaction = require('./models/CreditTransaction');
const Download = require('./models/Download');
const createSampleFiles = require('./utils/sampleFiles');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/peernotes'
    );
    console.log(`[MongoDB Connected for Seeding] ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();
  createSampleFiles();

  try {
    console.log('🧹 Purging existing collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Resource.deleteMany();
    await Review.deleteMany();
    await Bookmark.deleteMany();
    await Report.deleteMany();
    await CreditTransaction.deleteMany();
    await Download.deleteMany();

    console.log('👤 Seeding Users (1 Admin, 10 Students)...');

    // 1 Admin
    const adminUser = await User.create({
      name: 'Dr. Evelyn Vance (Chief Admin)',
      email: 'admin@peernotes.edu',
      password: 'Admin@123456',
      role: 'admin',
      college: 'National Institute of Technology',
      department: 'Academic Affairs & Moderation',
      semester: 8,
      bio: 'Head of Academic Content Verification and Peer-to-Peer Learning Directorate.',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
      credits: 999,
      isActive: true
    });

    // 10 Students
    const studentData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@student.edu',
        password: 'Student@123456',
        college: 'IIT Delhi',
        department: 'Computer Science & Engineering',
        semester: 6,
        bio: 'Competitive programmer & Full-stack enthusiast. Sharing clean handwritten DBMS and Algorithm notes.',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
        credits: 95
      },
      {
        name: 'Ananya Patel',
        email: 'ananya@student.edu',
        password: 'Student@123456',
        college: 'BITS Pilani',
        department: 'Information Technology',
        semester: 4,
        bio: 'Dean\'s list student. Focus on Operating Systems, Database Architecture, and Networks.',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
        credits: 120
      },
      {
        name: 'Rohit Verma',
        email: 'rohit@student.edu',
        password: 'Student@123456',
        college: 'NIT Trichy',
        department: 'Artificial Intelligence & Data Science',
        semester: 5,
        bio: 'ML research intern. Uploading Machine Learning math derivations, neural net diagrams, and lab assignments.',
        profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face',
        credits: 80
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha@student.edu',
        password: 'Student@123456',
        college: 'VIT Vellore',
        department: 'Electronics & Communication',
        semester: 3,
        bio: 'ECE scholar passionate about Digital Signal Processing, Microcontrollers, and VLSI.',
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
        credits: 65
      },
      {
        name: 'Vikram Sengupta',
        email: 'vikram@student.edu',
        password: 'Student@123456',
        college: 'DTU Delhi',
        department: 'Software Engineering',
        semester: 7,
        bio: 'Final year senior. Curated semester question papers, system design guides, and interview cheatsheets.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        credits: 140
      },
      {
        name: 'Priya Nambiar',
        email: 'priya@student.edu',
        password: 'Student@123456',
        college: 'IIIT Hyderabad',
        department: 'Computer Science & Engineering',
        semester: 4,
        bio: 'Data structures TA. Sharing visual graph traversal slides, recursion trees, and dynamic programming tricks.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        credits: 110
      },
      {
        name: 'Karan Malhotra',
        email: 'karan@student.edu',
        password: 'Student@123456',
        college: 'Thapar Institute',
        department: 'Computer Engineering',
        semester: 2,
        bio: 'First-year survivor sharing engineering mathematics, C programming, and physics lab reports.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        credits: 45
      },
      {
        name: 'Neha Roy',
        email: 'neha@student.edu',
        password: 'Student@123456',
        college: 'Manipal Institute of Technology',
        department: 'Cyber Security',
        semester: 6,
        bio: 'CTF player & security researcher. Notes on Cryptography, Network Protocols, and Pentesting.',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
        credits: 90
      },
      {
        name: 'Rahul Deshmukh',
        email: 'rahul@student.edu',
        password: 'Student@123456',
        college: 'COEP Pune',
        department: 'Information Technology',
        semester: 5,
        bio: 'Cloud enthusiast. Kubernetes, Docker architecture, and distributed systems notes.',
        profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face',
        credits: 75
      },
      {
        name: 'Pooja Agarwal',
        email: 'pooja@student.edu',
        password: 'Student@123456',
        college: 'PSG Tech Coimbatore',
        department: 'Computer Science & Engineering',
        semester: 8,
        bio: 'Full-stack developer. MERN stack roadmaps, React best practices, and REST API guides.',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
        credits: 130
      }
    ];

    const students = await User.create(studentData);

    // Initial welcome credit transactions for all users
    for (const student of students) {
      await CreditTransaction.create({
        user: student._id,
        amount: 50,
        balanceAfter: 50,
        type: 'welcome_bonus',
        description: '🎉 Welcome to PeerNotes! Initial starter credits.'
      });
    }

    console.log('📂 Seeding 15 Categories...');
    const categoryNames = [
      { name: 'Data Structures', description: 'Arrays, Linked Lists, Trees, Graphs, DP and Algorithms', icon: 'Binary' },
      { name: 'Database Management', description: 'SQL, Normalization, Relational Algebra, Transactions and NoSQL', icon: 'Database' },
      { name: 'Operating Systems', description: 'Process scheduling, Concurrency, Memory paging, and Virtualization', icon: 'Cpu' },
      { name: 'Computer Networks', description: 'OSI 7 Layers, TCP/IP, Routing algorithms, and Socket programming', icon: 'Network' },
      { name: 'Artificial Intelligence', description: 'Search strategies, Knowledge graphs, Heuristics, and NLP', icon: 'Bot' },
      { name: 'Machine Learning', description: 'Regression, Classification, SVM, Deep Learning, and Math derivations', icon: 'BrainCircuit' },
      { name: 'Web Development', description: 'HTML5, CSS3, React, Node.js, Express, and modern web architectures', icon: 'Code' },
      { name: 'Software Engineering', description: 'Agile methodologies, SDLC models, UML design, and testing patterns', icon: 'Layers' },
      { name: 'Mathematics', description: 'Discrete Mathematics, Linear Algebra, Probability, and Calculus', icon: 'Sigma' },
      { name: 'Electronics', description: 'Digital circuits, Logic gates, Microprocessors, and VLSI', icon: 'Zap' },
      { name: 'Cyber Security', description: 'Cryptography, Network defense, Ethical hacking, and Authentication', icon: 'ShieldCheck' },
      { name: 'Cloud Computing', description: 'AWS, Docker, Kubernetes, Serverless, and Distributed storage', icon: 'Cloud' },
      { name: 'Previous Question Papers', description: 'Mid-term, End-semester, and University past solved examination papers', icon: 'FileQuestion' },
      { name: 'Lab Manuals', description: 'Code experiments, Viva questions, Observation tables, and outputs', icon: 'FlaskConical' },
      { name: 'Study Guides', description: 'Quick revision formulas, mindmaps, and exam cram sheets', icon: 'BookOpenCheck' }
    ];

    const categories = await Category.create(categoryNames);
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    console.log('📚 Seeding 35+ Educational Resources...');

    const sampleFiles = [
      { url: '/uploads/dbms_complete_notes.pdf', name: 'DBMS_Complete_Module_Notes.pdf', size: 3450000, type: 'pdf' },
      { url: '/uploads/os_process_scheduling.pdf', name: 'OS_Process_Paging_VirtualMemory.pdf', size: 2890000, type: 'pdf' },
      { url: '/uploads/dsa_trees_graphs_handbook.pdf', name: 'DSA_Trees_Graphs_DP_Mastery.pdf', size: 4120000, type: 'pdf' },
      { url: '/uploads/cn_tcp_ip_osi_guide.pdf', name: 'Computer_Networks_Protocols_Handbook.pdf', size: 3100000, type: 'pdf' },
      { url: '/uploads/ai_search_algorithms_cheatsheet.pdf', name: 'AI_Search_Strategies_Summary.pdf', size: 1980000, type: 'pdf' },
      { url: '/uploads/ml_supervised_regression_classification.pdf', name: 'ML_Mathematical_Foundations.pdf', size: 5240000, type: 'pdf' },
      { url: '/uploads/fullstack_react_nodejs_guide.pdf', name: 'FullStack_MERN_Architecture.pdf', size: 3800000, type: 'pdf' },
      { url: '/uploads/software_engineering_uml_agile.pdf', name: 'Software_Engineering_UML_Design.pdf', size: 2450000, type: 'pdf' },
      { url: '/uploads/discrete_mathematics_pyq_solved.pdf', name: 'Discrete_Math_GraphTheory_PYQ.pdf', size: 4500000, type: 'pdf' },
      { url: '/uploads/digital_electronics_lab_manual.pdf', name: 'Digital_Electronics_Lab_Experiments.pdf', size: 2100000, type: 'pdf' },
      { url: '/uploads/cloud_aws_docker_notes.pdf', name: 'Docker_Kubernetes_Cloud_Cheatsheet.pdf', size: 3200000, type: 'pdf' },
      { url: '/uploads/sample_notes_doc.docx', name: 'Computer_Architecture_Pipelining.docx', size: 1540000, type: 'doc' },
      { url: '/uploads/sample_presentation.pptx', name: 'Neural_Networks_Deep_Learning_Slides.pptx', size: 6100000, type: 'ppt' }
    ];

    const rawResources = [
      {
        title: 'DBMS Complete Comprehensive Lecture Notes & ER Diagrams',
        description: 'Complete 5-unit handwritten and digitized lecture notes covering Relational Algebra, SQL queries, Normalization up to BCNF, ACID properties, Concurrency Control, Two-Phase Locking, and B+ Trees indexing with solved university numericals.',
        subject: 'Database Management Systems (CS301)',
        category: 'Database Management',
        semester: 4,
        department: 'Computer Science & Engineering',
        college: 'IIT Delhi',
        tags: ['DBMS', 'SQL', 'Normalization', 'ACID', 'Transactions', 'B+ Trees'],
        resourceType: 'pdf',
        fileIndex: 0,
        uploaderIdx: 0,
        status: 'approved',
        downloads: 48,
        bookmarks: 23,
        isFeatured: true
      },
      {
        title: 'Operating Systems: Process Scheduling, Synchronization & Memory Paging',
        description: 'In-depth notes on CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority), Classical Synchronization problems (Dining Philosophers, Readers-Writers, Producer-Consumer with Semaphores and Mutex), Deadlock detection & Banker\'s algorithm, and Virtual Memory paging algorithms.',
        subject: 'Operating Systems (CS402)',
        category: 'Operating Systems',
        semester: 4,
        department: 'Information Technology',
        college: 'BITS Pilani',
        tags: ['OS', 'Process Scheduling', 'Semaphores', 'Deadlock', 'Virtual Memory', 'Paging'],
        resourceType: 'pdf',
        fileIndex: 1,
        uploaderIdx: 1,
        status: 'approved',
        downloads: 62,
        bookmarks: 31,
        isFeatured: true
      },
      {
        title: 'Data Structures & Algorithms: Graphs, Trees & Dynamic Programming Handbook',
        description: 'Handcrafted guide containing visual diagrams and clean C++/Java pseudocode for AVL Trees, Red-Black Trees, Graph Traversals (BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim), and classic 2D Dynamic Programming patterns with time-complexity proofs.',
        subject: 'Data Structures & Algorithms (CS201)',
        category: 'Data Structures',
        semester: 3,
        department: 'Computer Science & Engineering',
        college: 'IIIT Hyderabad',
        tags: ['DSA', 'Graphs', 'Dynamic Programming', 'Trees', 'Dijkstra', 'Algorithms'],
        resourceType: 'pdf',
        fileIndex: 2,
        uploaderIdx: 5,
        status: 'approved',
        downloads: 85,
        bookmarks: 45,
        isFeatured: true
      },
      {
        title: 'Computer Networks: OSI 7-Layer Model, TCP/IP & Socket Programming',
        description: 'Crystal-clear explanations of Physical layer framing, Data link layer error detection (CRC, Hamming code), Network layer IP addressing (Subnetting, CIDR, Distance Vector, Link State), Transport layer TCP 3-way handshake and congestion control mechanisms.',
        subject: 'Computer Networks (CS503)',
        category: 'Computer Networks',
        semester: 5,
        department: 'Information Technology',
        college: 'BITS Pilani',
        tags: ['Computer Networks', 'OSI Model', 'TCP/IP', 'Subnetting', 'Routing', 'DNS'],
        resourceType: 'pdf',
        fileIndex: 3,
        uploaderIdx: 1,
        status: 'approved',
        downloads: 39,
        bookmarks: 19
      },
      {
        title: 'Machine Learning: Mathematical Foundations, Regression & Classification',
        description: 'Rigorous mathematical walkthrough covering Linear Regression, Gradient Descent derivations, Logistic Regression, Support Vector Machines (Lagrange Multipliers & Kernel Trick), Decision Trees, Random Forests, and Principal Component Analysis (PCA).',
        subject: 'Machine Learning (CS601)',
        category: 'Machine Learning',
        semester: 6,
        department: 'Artificial Intelligence & Data Science',
        college: 'NIT Trichy',
        tags: ['Machine Learning', 'Linear Regression', 'SVM', 'PCA', 'Gradient Descent', 'AI'],
        resourceType: 'pdf',
        fileIndex: 5,
        uploaderIdx: 2,
        status: 'approved',
        downloads: 54,
        bookmarks: 28,
        isFeatured: true
      },
      {
        title: 'Full-Stack Web Development Mastery: React, Node, Express & Architecture',
        description: 'Industry-standard roadmap covering modern React hooks (useState, useEffect, useMemo, custom hooks), State management, Express routing, REST API conventions, JWT authentication lifecycle, CORS handling, and MongoDB indexing strategies.',
        subject: 'Web Technologies (CS405)',
        category: 'Web Development',
        semester: 4,
        department: 'Computer Science & Engineering',
        college: 'PSG Tech Coimbatore',
        tags: ['React', 'Node.js', 'Express', 'JWT', 'REST API', 'JavaScript'],
        resourceType: 'pdf',
        fileIndex: 6,
        uploaderIdx: 9,
        status: 'approved',
        downloads: 71,
        bookmarks: 36,
        isFeatured: true
      },
      {
        title: 'Artificial Intelligence: A* Search, Alpha-Beta Pruning & Constraint Satisfaction',
        description: 'Comprehensive AI notes including Uninformed Search (BFS, DFS, Uniform Cost), Informed Search (Greedy Best-First, A* with Admissibility heuristic), Game Playing (Minimax & Alpha-Beta Pruning), First-Order Logic, and Resolution Refutation.',
        subject: 'Artificial Intelligence (CS502)',
        category: 'Artificial Intelligence',
        semester: 5,
        department: 'Computer Science & Engineering',
        college: 'IIT Delhi',
        tags: ['AI', 'A* Search', 'Alpha-Beta', 'Minimax', 'Knowledge Representation', 'Heuristics'],
        resourceType: 'pdf',
        fileIndex: 4,
        uploaderIdx: 0,
        status: 'approved',
        downloads: 32,
        bookmarks: 14
      },
      {
        title: 'Discrete Mathematics & Graph Theory: Previous 5-Years Solved Papers',
        description: 'Step-by-step solutions to past university exam papers on Propositional Logic, Set Theory, Relations & Functions, Combinatorics (Pigeonhole principle), Recurrence Relations, and Planar Graphs.',
        subject: 'Discrete Mathematics (MA201)',
        category: 'Mathematics',
        semester: 3,
        department: 'Computer Science & Engineering',
        college: 'DTU Delhi',
        tags: ['Discrete Math', 'PYQ', 'Solved Papers', 'Graph Theory', 'Logic', 'Combinatorics'],
        resourceType: 'pdf',
        fileIndex: 8,
        uploaderIdx: 4,
        status: 'approved',
        downloads: 43,
        bookmarks: 21
      },
      {
        title: 'Software Engineering: Agile, Scrum, Design Patterns & UML Diagrams',
        description: 'Detailed study notes covering Waterfall vs Agile/Scrum, Class diagrams, Sequence diagrams, Use Case analysis, Creational & Structural Design Patterns (Singleton, Factory, Observer), and Software Quality Assurance testing methodologies.',
        subject: 'Software Engineering (CS403)',
        category: 'Software Engineering',
        semester: 4,
        department: 'Software Engineering',
        college: 'DTU Delhi',
        tags: ['Software Engineering', 'Agile', 'Scrum', 'UML', 'Design Patterns', 'SDLC'],
        resourceType: 'pdf',
        fileIndex: 7,
        uploaderIdx: 4,
        status: 'approved',
        downloads: 29,
        bookmarks: 12
      },
      {
        title: 'Digital Electronics Lab Manual with Verilog Code & Circuit Diagrams',
        description: 'Complete laboratory record with circuit wiring diagrams, truth tables, and Verilog HDL implementations for Multiplexers, Demultiplexers, Flip-Flops (SR, JK, D, T), Synchronous Counters, and ALU simulation on ModelSim.',
        subject: 'Digital Electronics Lab (EC302L)',
        category: 'Lab Manuals',
        semester: 3,
        department: 'Electronics & Communication',
        college: 'VIT Vellore',
        tags: ['Lab Manual', 'Verilog', 'Digital Electronics', 'Flip Flops', 'Logic Gates', 'Circuits'],
        resourceType: 'pdf',
        fileIndex: 9,
        uploaderIdx: 3,
        status: 'approved',
        downloads: 35,
        bookmarks: 16
      },
      {
        title: 'Docker & Kubernetes Cloud Deployment Cheat Sheet & Commands',
        description: 'Production-ready reference guide for Containerization, Dockerfile best practices, multi-stage builds, Docker Compose configurations, Pods, Services, Deployments, Ingress controllers, and Helm charts.',
        subject: 'Cloud Computing (IT702)',
        category: 'Cloud Computing',
        semester: 7,
        department: 'Information Technology',
        college: 'COEP Pune',
        tags: ['Cloud', 'Docker', 'Kubernetes', 'DevOps', 'Containers', 'AWS'],
        resourceType: 'pdf',
        fileIndex: 10,
        uploaderIdx: 8,
        status: 'approved',
        downloads: 51,
        bookmarks: 25
      },
      {
        title: 'Cryptography & Cyber Defense: RSA, AES, Diffie-Hellman & SHA-256',
        description: 'Detailed analysis of Symmetric vs Asymmetric encryption, DES/AES algorithms, RSA key generation calculations, Diffie-Hellman Key Exchange attack vectors, Digital Signatures, PKI architecture, and TLS handshake security.',
        subject: 'Information & Cyber Security (CS604)',
        category: 'Cyber Security',
        semester: 6,
        department: 'Cyber Security',
        college: 'Manipal Institute of Technology',
        tags: ['Cyber Security', 'Cryptography', 'RSA', 'AES', 'TLS', 'Hashing'],
        resourceType: 'pdf',
        fileIndex: 0,
        uploaderIdx: 7,
        status: 'approved',
        downloads: 38,
        bookmarks: 17
      },
      {
        title: 'Computer Organization & Architecture: Pipelining & Cache Mapping',
        description: 'In-depth doc on RISC vs CISC, Instruction Pipeline Hazards (Structural, Data, Control), Direct-mapped vs Set-Associative Cache calculations, Memory hierarchy, and Booth\'s Multiplication algorithm.',
        subject: 'Computer Organization (CS302)',
        category: 'Electronics',
        semester: 3,
        department: 'Computer Science & Engineering',
        college: 'IIT Delhi',
        tags: ['COA', 'Pipelining', 'Cache Memory', 'Computer Architecture', 'Hazard Mitigation'],
        resourceType: 'doc',
        fileIndex: 11,
        uploaderIdx: 0,
        status: 'approved',
        downloads: 27,
        bookmarks: 11
      },
      {
        title: 'Neural Networks & Deep Learning Lecture Slides (CNN, RNN, Transformers)',
        description: 'Vibrant lecture slides covering Perceptrons, Multi-Layer Perceptrons, Backpropagation calculus, Convolutional Neural Networks (LeNet, AlexNet, ResNet), Recurrent Neural Networks, LSTM cells, and Self-Attention mechanisms.',
        subject: 'Deep Learning (CS701)',
        category: 'Machine Learning',
        semester: 7,
        department: 'Artificial Intelligence & Data Science',
        college: 'NIT Trichy',
        tags: ['Deep Learning', 'Neural Networks', 'CNN', 'LSTM', 'Transformers', 'Slides'],
        resourceType: 'ppt',
        fileIndex: 12,
        uploaderIdx: 2,
        status: 'approved',
        downloads: 64,
        bookmarks: 33
      },
      {
        title: 'Engineering Mathematics-1: Calculus, Matrices & Infinite Series Formula Sheet',
        description: 'Handy formula cram sheet for first-year engineering students covering Taylor Series, Eigenvalues & Eigenvectors, Cayley-Hamilton theorem, Multiple Integrals, and Vector Calculus.',
        subject: 'Engineering Mathematics I (MA101)',
        category: 'Study Guides',
        semester: 1,
        department: 'Computer Engineering',
        college: 'Thapar Institute',
        tags: ['Calculus', 'Matrices', 'Engineering Math', 'Formula Sheet', 'Revision Guide'],
        resourceType: 'pdf',
        fileIndex: 8,
        uploaderIdx: 6,
        status: 'approved',
        downloads: 41,
        bookmarks: 20
      },
      {
        title: 'Compiler Design: Lexical Analysis, LL(1) Parsing & Code Optimization',
        description: 'Complete syllabus notes on Lex & Yacc, Finite Automata to Regular Expressions, First & Follow calculation, LL(1) parsing tables, LR(0)/SLR(1)/CLR(1) parser construction, and Three-Address Code generation.',
        subject: 'Compiler Design (CS602)',
        category: 'Data Structures',
        semester: 6,
        department: 'Computer Science & Engineering',
        college: 'IIIT Hyderabad',
        tags: ['Compiler Design', 'Parsing', 'Lexical Analysis', 'LL1', 'LR Parser', 'Syntax Trees'],
        resourceType: 'pdf',
        fileIndex: 0,
        uploaderIdx: 5,
        status: 'approved',
        downloads: 22,
        bookmarks: 9
      },
      {
        title: 'Python for Data Science & Numerical Computing Quick Reference',
        description: 'Fast-paced Python reference covering NumPy array manipulations, Pandas DataFrames querying and transformations, Matplotlib/Seaborn visualization patterns, and SciPy optimization routines.',
        subject: 'Data Science Lab (CS406)',
        category: 'Artificial Intelligence',
        semester: 4,
        department: 'Information Technology',
        college: 'BITS Pilani',
        tags: ['Python', 'Data Science', 'NumPy', 'Pandas', 'Cheatsheet', 'Jupyter'],
        resourceType: 'pdf',
        fileIndex: 5,
        uploaderIdx: 1,
        status: 'approved',
        downloads: 47,
        bookmarks: 24
      },
      {
        title: 'Analog & Linear Integrated Circuits: Op-Amp Applications & 555 Timers',
        description: 'Study materials detailing Ideal vs Practical Op-Amp characteristics, Inverting/Non-inverting amplifiers, Integrator & Differentiator circuits, Schmitt Triggers, Astable & Monostable multivibrators using IC 555.',
        subject: 'Linear Integrated Circuits (EC401)',
        category: 'Electronics',
        semester: 4,
        department: 'Electronics & Communication',
        college: 'VIT Vellore',
        tags: ['Op-Amp', '555 Timer', 'Analog Circuits', 'Amplifiers', 'Electronics'],
        resourceType: 'pdf',
        fileIndex: 9,
        uploaderIdx: 3,
        status: 'approved',
        downloads: 19,
        bookmarks: 8
      },
      {
        title: 'End-Semester Previous Year Solved Question Papers (2020-2024) - DBMS & OS',
        description: 'Compilation of university end-term examination papers with verified teacher solutions and answer key grading rubrics for Database Management Systems and Operating Systems courses.',
        subject: 'University Exam Question Bank',
        category: 'Previous Question Papers',
        semester: 4,
        department: 'Computer Science & Engineering',
        college: 'DTU Delhi',
        tags: ['PYQ', 'Exam Bank', 'Solved Papers', 'DBMS', 'OS', 'Question Bank'],
        resourceType: 'pdf',
        fileIndex: 8,
        uploaderIdx: 4,
        status: 'approved',
        downloads: 77,
        bookmarks: 40,
        isFeatured: true
      },
      {
        title: 'Web Security: OWASP Top 10 Vulnerabilities & Prevention Guide',
        description: 'Comprehensive guide covering SQL Injection, Cross-Site Scripting (XSS), CSRF tokens, Broken Access Control, SSRF vulnerabilities, and defensive coding practices in JavaScript and Node.js.',
        subject: 'Web Security (CS703)',
        category: 'Cyber Security',
        semester: 7,
        department: 'Cyber Security',
        college: 'Manipal Institute of Technology',
        tags: ['Web Security', 'OWASP', 'XSS', 'SQLi', 'CSRF', 'Defensive Coding'],
        resourceType: 'pdf',
        fileIndex: 0,
        uploaderIdx: 7,
        status: 'approved',
        downloads: 36,
        bookmarks: 18
      },
      // Pending review resources
      {
        title: 'Advanced Natural Language Processing with BERT and GPT Models',
        description: 'Student submission covering Tokenization, Word2Vec, Transformer Encoder-Decoder architectures, Attention Is All You Need paper walkthrough, and Fine-tuning HuggingFace models.',
        subject: 'Natural Language Processing (CS704)',
        category: 'Artificial Intelligence',
        semester: 7,
        department: 'Artificial Intelligence & Data Science',
        college: 'NIT Trichy',
        tags: ['NLP', 'Transformers', 'BERT', 'GPT', 'HuggingFace'],
        resourceType: 'pdf',
        fileIndex: 4,
        uploaderIdx: 2,
        status: 'pending',
        downloads: 0,
        bookmarks: 0
      },
      {
        title: 'Microprocessor 8086 Assembly Language Programming & Interfacing',
        description: 'Detailed instructions on 8086 internal architecture, register organization, addressing modes, instruction sets, and assembly code examples for sorting and arithmetic.',
        subject: 'Microprocessors (EC501)',
        category: 'Electronics',
        semester: 5,
        department: 'Electronics & Communication',
        college: 'VIT Vellore',
        tags: ['8086', 'Microprocessors', 'Assembly Language', 'Interfacing'],
        resourceType: 'pdf',
        fileIndex: 9,
        uploaderIdx: 3,
        status: 'pending',
        downloads: 0,
        bookmarks: 0
      },
      {
        title: 'Distributed Systems & Consensus: Raft, Paxos, and Vector Clocks',
        description: 'Notes on CAP theorem, PACELC, Lamport Timestamps, Vector Clocks, Byzantine Fault Tolerance, and Raft consensus leader election algorithms.',
        subject: 'Distributed Systems (CS605)',
        category: 'Cloud Computing',
        semester: 6,
        department: 'Information Technology',
        college: 'COEP Pune',
        tags: ['Distributed Systems', 'Raft', 'Consensus', 'CAP Theorem', 'Clocks'],
        resourceType: 'pdf',
        fileIndex: 10,
        uploaderIdx: 8,
        status: 'pending',
        downloads: 0,
        bookmarks: 0
      },
      {
        title: 'Computer Graphics: Rasterization, Bresenham Line & 3D Transformations',
        description: 'Syllabus notes covering DDA, Bresenham Line and Circle algorithms, Polygon clipping (Sutherland-Hodgman), 2D/3D affine transformations, and Phong shading.',
        subject: 'Computer Graphics (CS404)',
        category: 'Web Development',
        semester: 4,
        department: 'Computer Science & Engineering',
        college: 'IIT Delhi',
        tags: ['Computer Graphics', 'Bresenham', 'Transformations', 'Rasterization'],
        resourceType: 'pdf',
        fileIndex: 0,
        uploaderIdx: 0,
        status: 'pending',
        downloads: 0,
        bookmarks: 0
      },
      // Rejected resource
      {
        title: 'C Programming Random Unformatted Snippets (Sample)',
        description: 'Rough unstructured text file with partial snippets without subject details or explanations.',
        subject: 'C Programming',
        category: 'Data Structures',
        semester: 1,
        department: 'Computer Engineering',
        college: 'Thapar Institute',
        tags: ['C', 'Basics'],
        resourceType: 'doc',
        fileIndex: 11,
        uploaderIdx: 6,
        status: 'rejected',
        rejectionReason: 'The uploaded document lacks structured notes, subject context, and clear explanations. Please provide formatted, complete study material.',
        downloads: 0,
        bookmarks: 0
      }
    ];

    const createdResources = [];

    for (const r of rawResources) {
      const fileData = sampleFiles[r.fileIndex % sampleFiles.length];
      const uploader = students[r.uploaderIdx];
      const categoryId = catMap[r.category];

      const resource = await Resource.create({
        title: r.title,
        description: r.description,
        subject: r.subject,
        category: r.category,
        categoryId,
        semester: r.semester,
        department: r.department,
        college: r.college,
        tags: r.tags,
        resourceType: r.resourceType,
        fileUrl: fileData.url,
        originalFileName: fileData.name,
        fileSize: fileData.size,
        fileMimeType: fileData.type === 'pdf' ? 'application/pdf' : 'application/octet-stream',
        uploadedBy: uploader._id,
        status: r.status,
        rejectionReason: r.rejectionReason || '',
        downloads: r.downloads || 0,
        bookmarks: r.bookmarks || 0,
        isFeatured: !!r.isFeatured,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000)
      });

      createdResources.push(resource);

      // If approved, create credit reward record for student
      if (r.status === 'approved') {
        await CreditTransaction.create({
          user: uploader._id,
          amount: 10,
          balanceAfter: uploader.credits,
          type: 'upload_reward',
          description: `🎉 Resource Approved (+10 credits): "${resource.title}"`,
          resource: resource._id,
          createdAt: resource.createdAt
        });
      }
    }

    console.log('⭐ Seeding Reviews & Calculating Dynamic Ratings...');

    const studentReviews = [
      { rating: 5, comment: 'Incredible notes! The ER diagram section and 3NF/BCNF examples helped me score an A in my midterms.' },
      { rating: 5, comment: 'Extremely well structured with clear diagrams. Saved me hours before the exams!' },
      { rating: 4, comment: 'Very concise and covers all the essential concepts. A few more solved gate questions would make it perfect.' },
      { rating: 5, comment: 'Clean, accurate, and easy to understand. Best resource on this topic on the platform!' },
      { rating: 4, comment: 'Great handwriting and well organized by units. Highly recommended to all students.' },
      { rating: 5, comment: 'The step-by-step algorithms and complexity proofs are top-tier quality. Thank you for sharing!' }
    ];

    const approvedResources = createdResources.filter((r) => r.status === 'approved');

    for (let i = 0; i < approvedResources.length; i++) {
      const res = approvedResources[i];
      // Pick 2 to 4 reviewers who are not the author
      const otherStudents = students.filter(
        (s) => s._id.toString() !== res.uploadedBy.toString()
      );

      const reviewCount = (i % 3) + 2; // 2 to 4 reviews
      for (let j = 0; j < reviewCount && j < otherStudents.length; j++) {
        const reviewer = otherStudents[j];
        const sampleRev = studentReviews[(i + j) % studentReviews.length];

        await Review.create({
          resource: res._id,
          user: reviewer._id,
          rating: sampleRev.rating,
          comment: sampleRev.comment,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000)
        });

        // Recalculate average rating
        await Review.calcAverageRating(res._id);

        // Also add some bookmarks
        if (j % 2 === 0) {
          await Bookmark.create({
            resource: res._id,
            user: reviewer._id,
            createdAt: new Date()
          });
        }

        // Add download record
        await Download.create({
          resource: res._id,
          user: reviewer._id,
          creditCharged: 1,
          downloadedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 86400000)
        });

        // Add download credit transaction
        await CreditTransaction.create({
          user: reviewer._id,
          amount: -1,
          balanceAfter: Math.max(0, reviewer.credits - 1),
          type: 'download_cost',
          description: `📥 Resource Download: "${res.title}"`,
          resource: res._id,
          createdAt: new Date()
        });
      }
    }

    console.log('🚩 Seeding Sample Moderation Reports...');
    if (approvedResources.length >= 2) {
      await Report.create({
        resource: approvedResources[0]._id,
        reportedBy: students[3]._id,
        reason: 'Incorrect content',
        description: 'In Unit 3 under Boyce-Codd Normal Form, one of the multi-valued dependency examples has a slight typo in the relation schema.',
        status: 'pending'
      });

      await Report.create({
        resource: approvedResources[1]._id,
        reportedBy: students[4]._id,
        reason: 'Duplicate resource',
        description: 'Notice of potential similarity with another OS memory paging slide pack.',
        status: 'resolved',
        adminNotes: 'Verified content is original lecture material with unique diagrams. Marked resolved.',
        resolvedBy: adminUser._id,
        resolvedAt: new Date()
      });
    }

    console.log('\n=============================================');
    console.log('🎉 PEERNOTES DATABASE SEEDED SUCCESSFULLY! 🎉');
    console.log('=============================================');
    console.log(`👨‍💼 Admin User: admin@peernotes.edu  |  Password: Admin@123456`);
    console.log(`🎓 Student Demo User: aarav@student.edu  |  Password: Student@123456`);
    console.log(`🎓 Student Demo User: ananya@student.edu |  Password: Student@123456`);
    console.log(`📁 Categories: ${categories.length}`);
    console.log(`📚 Total Resources: ${createdResources.length} (Approved: ${approvedResources.length})`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
