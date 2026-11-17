
export interface TechnologyFocusArea {
  id: string;
  title: string;
  category: string;
  ageGroup: 'junior' | 'career' | 'general';
  minAge: number;
  maxAge: number;
  domainTag: string;
  badge?: string;
  description: string;
  topics: string[];
  targetAudience: 'both' | 'international' | 'indian';
  globalCurriculum?: string;
  timeZoneFriendly?: string;

  // Additional details from the official course catalogue
  suitableFor: string;
  level: string;
  technologies: string;
  learningOutcomes: string[];
  practicalWork: string;
  publishingNote: string;
}



export const FOCUS_AREAS: TechnologyFocusArea[] = [
  {
    id: 'frontend-web-development',
    title: 'Complete Frontend Web Development: HTML, CSS & JavaScript',
    category: 'Technology | Web Development',
    ageGroup: 'general',
    minAge: 0,
    maxAge: 99,
    domainTag: 'Frontend Development',
    badge: '40 Sessions',
    description:
      'Build the skills needed to create the part of a website that users see and interact with. Students begin with the structure of a web page, learn how to style it professionally, and then use JavaScript to make it responsive and interactive. The learning path moves from foundational concepts to modern browser features and a complete website project.',
    suitableFor:
      'Beginners, school or college students, and aspiring frontend developers.',
    level:
      'Beginner to intermediate. The curriculum does not specify an age restriction.',
    topics: [
      'HTML document structure, elements, attributes, links, media, forms and semantic HTML.',
      'CSS selectors, typography, box model, positioning, Flexbox, Grid, transitions and animations.',
      'Responsive layouts, media queries and advanced CSS selectors.',
      'JavaScript variables, data types, operators, strings, arrays, conditions, loops, functions and objects.',
      'DOM manipulation, events, form validation, ES6, modules and JSON.',
      'Browser storage, Fetch API, asynchronous JavaScript, UI/UX, debugging and deployment basics.',
    ],
    technologies:
      'HTML5, CSS3 and JavaScript. The curriculum also covers DOM APIs, LocalStorage, SessionStorage, Fetch API, Promises and async/await.',
    learningOutcomes: [
      'Structure web pages using semantic HTML.',
      'Create styled layouts and responsive interfaces with CSS.',
      'Write JavaScript to respond to user actions and update page content.',
      'Work with browser storage and retrieve external data using Fetch API.',
      'Debug, test and improve a website before presenting it.',
    ],
    practicalWork:
      'An original responsive website with a designed interface, working navigation or form interactions, dynamic page behaviour and other JavaScript features selected by the student. Students test and present the completed website.',
    publishingNote:
      'The catalogue specifies 40 sessions, four assessments and a final project. Calendar duration, session length, instructor, fee and delivery mode are not specified.',
    targetAudience: 'both',
  },

  {
    id: 'python-complete',
    title: 'Python Programming - Complete Course',
    category: 'Technology | Programming',
    ageGroup: 'general',
    minAge: 0,
    maxAge: 99,
    domainTag: 'Complete Python Programming',
    badge: '40 Sessions',
    description:
      'Develop practical Python programming skills through a structured progression. Students learn core syntax and data structures, practise logic through conditions and loops, write reusable functions, work with files and data formats, and explore object-oriented programming. The course then introduces graphics and graphical user interfaces so learners can apply their knowledge in an application.',
    suitableFor:
      'Learners who want to progress from Python fundamentals to building small applications.',
    level:
      'Progressive beginner-to-advanced coverage; the catalogue does not specify an age or grade range.',
    topics: [
      'Python fundamentals: variables, data types, type conversion, operators, strings and collections.',
      'Input/output, conditions, loops, nested loops, control statements and pattern programming.',
      'Functions, parameters, return values, scope, built-in methods, lambda functions, map, filter, reduce and recursion.',
      'File handling, CSV and JSON, exception handling, modules and packages.',
      'Object-oriented programming: classes, objects, constructors, inheritance, encapsulation and polymorphism.',
      'Turtle graphics and GUI programming with Tkinter, including widgets, events and dialog boxes.',
    ],
    technologies:
      'Python; CSV and JSON data formats; Python modules and packages; Turtle Graphics; Tkinter.',
    learningOutcomes: [
      'Write Python programs using core language features.',
      'Break problems into functions and reusable modules.',
      'Read and write files and handle common program errors.',
      'Apply object-oriented programming concepts.',
      'Create simple graphics and GUI-based applications.',
    ],
    practicalWork:
      'A Python application planned and developed by the student, with a graphical interface, working program features, appropriate data structures and error handling. The student tests, demonstrates and presents the application.',
    publishingNote:
      'The catalogue specifies 40 sessions, four assessments and a final application project. It does not specify learner age, calendar duration or session length.',
    targetAudience: 'both',
  },

  {
    id: 'python-level-1',
    title: 'Python Level 1 - Fundamentals',
    category: 'Technology | Programming',
    ageGroup: 'general',
    minAge: 0,
    maxAge: 99,
    domainTag: 'Python Fundamentals',
    badge: '30 Sessions',
    description:
      'An entry-level course that introduces programming in a clear, practical sequence. Students set up Python, write their first programs, understand how data is stored and processed, and learn to control program flow. They then move into strings and common data structures before practising functions, file handling and introductory object-oriented programming.',
    suitableFor:
      'School students and first-time Python learners.',
    level:
      'Beginner. The catalogue describes it as suitable for school students but does not give a specific age or grade.',
    topics: [
      'Installing Python and setting up an IDE; syntax and first program.',
      'Variables, data types, input/output, type conversion and operators.',
      'Conditional statements, nested conditions, for and while loops, and loop-control statements.',
      'Strings, string methods and slicing.',
      'Lists, tuples, sets and dictionaries.',
      'Functions, parameters, return values, scope, lambda functions, modules and libraries.',
      'File handling, exception handling and introductory OOP.',
    ],
    technologies:
      'Python and a Python IDE. The catalogue does not prescribe a particular IDE.',
    learningOutcomes: [
      'Set up a Python programming environment.',
      'Write programs using variables, operators, conditions and loops.',
      'Store and manipulate information using Python collections.',
      'Create functions and use modules.',
      'Work with files, handle exceptions and understand classes and objects.',
    ],
    practicalWork:
      'Mini projects including a calculator, quiz and number-guessing game, followed by a final Python project and presentation.',
    publishingNote:
      'The catalogue specifies 30 sessions. Session length, calendar duration, instructor, fee and delivery mode are not specified.',
    targetAudience: 'both',
  },

  {
    id: 'python-level-2',
    title: 'Python Level 2 - Intermediate & Advanced',
    category: 'Technology | Programming',
    ageGroup: 'general',
    minAge: 0,
    maxAge: 99,
    domainTag: 'Advanced Python & Algorithms',
    badge: '30 Sessions',
    description:
      'Extend Python knowledge into algorithmic thinking and structured problem-solving. Students learn to plan solutions with flowcharts and pseudocode, work with nested data structures, implement searching and sorting methods, and explore recursion and object-oriented programming. The course combines conceptual understanding with algorithm-based practice and a final project.',
    suitableFor:
      'School students who have already learned basic Python programming.',
    level:
      'Intermediate to advanced; intended for Classes 7-11.',
    topics: [
      'Computational thinking, algorithms, flowcharts, pseudocode and algorithm design.',
      'Advanced conditions, nested loops, number problems and string manipulation.',
      'Lists, nested lists and two-dimensional lists.',
      'Linear search, binary search, sorting concepts, bubble sort, selection sort and insertion sort.',
      'Functions, modular programming, recursion and dictionaries.',
      'Stacks, queues, mathematical algorithms and number patterns.',
      'Exception handling, file management and object-oriented programming.',
      'Classes, constructors, inheritance, polymorphism and selected Python libraries.',
    ],
    technologies:
      'Python; flowcharts and pseudocode; Random, Math and Turtle libraries.',
    learningOutcomes: [
      'Design a logical solution before writing code.',
      'Implement and compare basic searching and sorting algorithms.',
      'Solve problems using lists, dictionaries, stacks and queues.',
      'Use recursion and modular functions appropriately.',
      'Apply OOP concepts and selected Python libraries.',
    ],
    practicalWork:
      'Algorithm-based mini projects and a final Python project that demonstrates computational thinking and programming skills.',
    publishingNote:
      'The catalogue specifies 30 sessions and identifies Classes 7-11 as the intended school range. It recommends foundational Python knowledge; formal entry requirements are not specified.',
    targetAudience: 'both',
  },

  {
    id: 'scratchjr',
    title: 'ScratchJr - Creative Coding for Young Learners',
    category: 'Technology | Coding for Kids / Visual Programming',
    ageGroup: 'junior',
    minAge: 5,
    maxAge: 8,
    domainTag: 'Creative Coding for Young Learners',
    badge: '30 Sessions',
    description:
      'Introduce early coding concepts through playful, visual activities rather than text-based programming. Learners explore characters and backgrounds, arrange visual command blocks, and see how instructions create movement, sound and interaction. As confidence grows, they use these building blocks to tell stories and create simple games.',
    suitableFor:
      'Young learners who are beginning to explore coding.',
    level: 'Beginner; suggested age range 5-8 years.',
    topics: [
      'ScratchJr interface, tools, characters (sprites) and backgrounds.',
      'Motion, start/stop triggers, looks and sound blocks.',
      'Command sequences, events, repeat blocks, speed and movement.',
      'Character interaction, pages and storytelling.',
      'Animated stories, mazes, chase games and racing games.',
      'Problem-solving, debugging and creative project development.',
    ],
    technologies:
      'ScratchJr visual programming environment and its built-in character, background, motion, looks, sound, trigger and repeat blocks.',
    learningOutcomes: [
      'Understand that coding instructions are followed in sequence.',
      'Control characters and change scenes using visual blocks.',
      'Combine movement, sound and events to create animations.',
      'Develop early problem-solving and debugging habits.',
      'Express ideas through interactive stories and games.',
    ],
    practicalWork:
      'Animated characters and stories, a moving-car animation, day-and-night and underwater scenes, a simple maze, a character-chase game, a racing game and a final ScratchJr project.',
    publishingNote:
      "The catalogue specifies 30 sessions and notes that topics may be adapted to the learner's age, prior knowledge and pace.",
    targetAudience: 'both',
  },

  {
    id: 'scratch-programming',
    title: 'Scratch Programming - Visual Coding & Game Development',
    category: 'Technology | Coding for Kids / Game Development',
    ageGroup: 'junior',
    minAge: 7,
    maxAge: 14,
    domainTag: 'Visual Coding & Game Development',
    badge: '30 Sessions',
    description:
      'Use visual programming to understand how software works. Students create scripts by connecting Scratch blocks and progressively learn programming ideas such as events, sequences, loops, conditions, sensing, variables and operators. They apply these concepts to increasingly complex animations and games, building confidence through experimentation and project work.',
    suitableFor:
      'School-age learners interested in coding, animation and making games.',
    level: 'Beginner to advanced; suggested age range 7-14 years.',
    topics: [
      'Scratch interface, stage, sprites, costumes, motion, looks and sound.',
      'Events, broadcasting, control blocks, sequences and loops.',
      'If and if-else conditions, sensing and user interaction.',
      'Variables, scorekeeping, operators, random values and sprite cloning.',
      'Interactive animations, lists, advanced variables and custom blocks.',
      'Game projects, debugging and final project presentation.',
    ],
    technologies:
      'Scratch visual programming environment, including motion, looks, sound, events, control, sensing, operators, variables, lists and custom blocks.',
    learningOutcomes: [
      'Build scripts by combining visual programming blocks.',
      'Use events, loops and conditions to control project behaviour.',
      'Store scores and other information using variables and lists.',
      'Create interactive animations and games.',
      'Identify and fix errors in a project.',
    ],
    practicalWork:
      'Projects include a maze game, catching game, Pong game, space shooter, racing game, quiz game and platformer, followed by a final interactive game.',
    publishingNote:
      'The catalogue specifies 30 sessions and notes that topics may be adapted to learner age, prior knowledge and pace.',
    targetAudience: 'both',
  },

  {
    id: 'english-language',
    title: 'English Language Skills - Grade-wise Learning Programme',
    category: 'School Education | English Language',
    ageGroup: 'general',
    minAge: 0,
    maxAge: 99,
    domainTag: 'English Language Skills',
    description:
      'A broad English programme designed to strengthen communication and literacy across school years. It develops accuracy in grammar, confidence in speaking and listening, reading fluency and comprehension, and the ability to write for different purposes. Vocabulary, spelling, literature and academic study skills are integrated so learners can understand texts, express ideas clearly and become more independent in their learning.',
    suitableFor:
      'School learners in the United States and United Kingdom, with lessons adapted to their age, ability and school expectations.',
    level:
      'Grades 1-12. Placement should consider demonstrated ability, not grade or age alone.',
    topics: [
      'Grammar and sentence structure: parts of speech, sentence types, agreement, verb tenses, clauses, punctuation and reported speech.',
      'Reading and comprehension: phonics and decoding at early levels, fluency, sequencing, inference, main ideas, text evidence and critical reading.',
      'Writing and composition: sentences, paragraphs, narratives, descriptive, informative, persuasive and research-based writing.',
      'Speaking, listening and communication: pronunciation, conversation, storytelling, discussion, presentations, debates and interviews.',
      'Vocabulary and spelling: word relationships, prefixes, suffixes, spelling patterns, idioms and precise word choice.',
      'Literature and language techniques: stories, novels, plays, poetry, character, plot, theme and figurative language.',
      'Study and academic skills: note-taking, summarising, research, source evaluation and academic integrity.',
    ],
    technologies:
      'English-language teaching materials and age-appropriate reference resources. The catalogue does not prescribe a particular software platform or digital tool.',
    learningOutcomes: [
      'Use grammar and sentence structures accurately in speech and writing.',
      'Read a range of texts with increasing fluency and understanding.',
      'Plan, draft, revise and edit different forms of writing.',
      'Speak clearly, listen actively and contribute to discussions.',
      'Build vocabulary, spelling and understanding of literary techniques.',
      'Develop independent study, research and presentation skills.',
    ],
    practicalWork:
      'Learner work may include written compositions, reading responses, vocabulary records, spoken presentations, book reviews, reports and research-based writing. The framework does not prescribe one single final software or construction project.',
    publishingNote:
      'The catalogue is a planning framework for Grades 1-12, not a mandatory national syllabus. US and UK frameworks differ by jurisdiction. Map the programme to the relevant local curriculum before claiming official alignment. The source recommends a short reading, writing, grammar and speaking assessment for placement.',
    targetAudience: 'both',
  },

  {
    id: 'mathematics',
    title: 'Mathematics - Kindergarten to Grade 10',
    category: 'School Education | Mathematics',
    ageGroup: 'general',
    minAge: 0,
    maxAge: 99,
    domainTag: 'Mathematics Learning Programme',
    description:
      'A progressive mathematics framework that develops understanding from early number concepts to secondary-level mathematical reasoning. Learners build fluency with calculations and number relationships, then extend their skills through fractions, decimals, percentages, algebra, geometry, measurement, statistics and probability. Practical applications and multi-step problems help students connect mathematical ideas to real situations.',
    suitableFor:
      'Kindergarten and school learners following a grade-based mathematics programme.',
    level: 'Kindergarten (KG) through Grade 10.',
    topics: [
      'Early mathematics: counting, number recognition, comparing quantities, basic operations, shapes, patterns, sorting, measurement, time and direction.',
      'Number sense and arithmetic: place value, rounding, estimation, four operations, factors, multiples, fractions, decimals and percentages.',
      'Ratio, proportion, rates, integers, powers, roots and financial mathematics.',
      'Algebra: expressions, equations, inequalities, polynomials, identities, factorisation, functions and graphs.',
      'Geometry: shapes, lines, angles, triangles, quadrilaterals, circles, coordinates, transformations and trigonometry.',
      'Measurement and mensuration: perimeter, area, circumference, surface area, volume, unit conversion, speed and time.',
      'Data and reasoning: tables, graphs, averages, statistics, probability, mathematical modelling and multi-step problem-solving.',
    ],
    technologies:
      'Mathematics teaching resources and practice materials. The catalogue does not specify a particular calculator, application, coding language or digital learning platform.',
    learningOutcomes: [
      'Develop number sense and accurate calculation strategies.',
      'Understand fractions, decimals, percentages, ratios and proportional reasoning.',
      'Use algebraic methods to represent and solve problems.',
      'Apply geometric concepts and measurement formulas.',
      'Interpret data and reason about probability.',
      'Use logical reasoning and mathematical modelling in practical contexts.',
    ],
    practicalWork:
      'Grade-appropriate worked solutions, problem sets, mathematical models, data charts and applied problem-solving tasks. The syllabus does not define one single final project.',
    publishingNote:
      'The catalogue is an international planning framework drawing on commonly taught areas across Cambridge, the UK National Curriculum and US Common Core. Topic sequence and depth must be adapted to the selected curriculum, school year and learner needs. Do not claim formal alignment without a separate curriculum mapping review.',
    targetAudience: 'both',
  },
];



export const FAQ_ITEMS = [
  {
    question: 'What is CoDMux?',
    answer:
      'CoDMux provides structured learning programmes in frontend web development, Python programming, Scratch coding, English language skills and mathematics.',
  },
  {
    question: 'Which courses are available?',
    answer:
      'Our current catalogue includes Complete Frontend Web Development, Python Programming Complete Course, Python Level 1, Python Level 2, ScratchJr, Scratch Programming, English Language Skills and Mathematics.',
  },
  {
    question: 'Are the courses suitable for beginners?',
    answer:
      'Yes. The catalogue includes beginner-level programmes as well as intermediate and advanced learning paths. Please check the individual course level and suitability details.',
  },
  {
    question: 'What will students learn?',
    answer:
      'Students learn through structured topics, practical exercises, projects and learning outcomes specified in each course curriculum.',
  },
  {
    question: 'How many sessions are included?',
    answer:
      'Session counts differ by course. The current catalogue specifies 40 sessions for the complete frontend course and complete Python course, and 30 sessions for Python Level 1, Python Level 2, ScratchJr and Scratch Programming. Session counts for English and Mathematics are not specified.',
  },
  {
    question: 'What are the course fees?',
    answer:
      'Course fees have not been specified in the current catalogue. Please contact CoDMux for confirmed pricing.',
  },
  {
    question: 'Are instructors and batch schedules confirmed?',
    answer:
      'Instructor names, calendar duration, session timings and delivery mode must be confirmed separately before publishing.',
  },
  {
    question: 'How can I register my interest?',
    answer:
      'Select your preferred course and use the registration or notification option on the website. Our team can follow up with confirmed programme details.',
  },
];
