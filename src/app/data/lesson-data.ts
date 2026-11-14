import { Lesson } from '../models/quiz.model';

export const LESSONS: readonly Lesson[] = [
  // ── exp-001: Introduction to Fractions ──
  {
    id: 'lesson-001-1', courseId: 'exp-001', order: 1,
    title: 'What is a Fraction?',
    content: 'A fraction represents a part of a whole. It consists of two numbers separated by a line: the numerator (top) tells how many parts you have, and the denominator (bottom) tells how many equal parts the whole is divided into. For example, 3/4 means 3 out of 4 equal parts.',
    keyPoints: ['Numerator = parts you have', 'Denominator = total equal parts', 'The denominator can never be zero'],
    durationMinutes: 5,
  },
  {
    id: 'lesson-001-2', courseId: 'exp-001', order: 2,
    title: 'Equivalent Fractions',
    content: 'Fractions that represent the same value are called equivalent fractions. You can find equivalent fractions by multiplying or dividing both the numerator and denominator by the same number. For example, 1/2 = 2/4 = 3/6 = 4/8.',
    keyPoints: ['Multiply or divide both parts by the same number', '1/2 = 2/4 = 3/6', 'Simplifying means dividing to get the smallest denominator'],
    durationMinutes: 6,
  },
  {
    id: 'lesson-001-3', courseId: 'exp-001', order: 3,
    title: 'Adding and Subtracting Fractions',
    content: 'To add or subtract fractions with the same denominator, simply add or subtract the numerators and keep the denominator. When denominators differ, find a common denominator first, then add or subtract the numerators.',
    keyPoints: ['Same denominator: add numerators directly', 'Different denominators: find a common denominator first', 'Always simplify the result'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-001-4', courseId: 'exp-001', order: 4,
    title: 'Multiplying and Dividing Fractions',
    content: 'To multiply fractions, multiply the numerators together and the denominators together. To divide fractions, flip the second fraction (take its reciprocal) and multiply.',
    keyPoints: ['Multiplication: multiply tops, multiply bottoms', 'Division: flip the second fraction, then multiply', 'Simplify when possible'],
    durationMinutes: 7,
  },

  // ── exp-002: Algebra Basics ──
  {
    id: 'lesson-002-1', courseId: 'exp-002', order: 1,
    title: 'Variables and Constants',
    content: 'A variable is a symbol (usually a letter) that represents an unknown or changing value. A constant is a fixed value that does not change. In the expression 3x + 5, x is the variable and 3 and 5 are constants.',
    keyPoints: ['Variables represent unknown values', 'Constants are fixed numbers', 'Coefficients are numbers multiplied by variables'],
    durationMinutes: 6,
  },
  {
    id: 'lesson-002-2', courseId: 'exp-002', order: 2,
    title: 'Solving Linear Equations',
    content: 'To solve a linear equation, isolate the variable on one side. Use inverse operations: addition cancels subtraction, multiplication cancels division. Whatever you do to one side, do to the other.',
    keyPoints: ['Isolate the variable', 'Use inverse operations', 'Keep both sides balanced'],
    durationMinutes: 10,
  },
  {
    id: 'lesson-002-3', courseId: 'exp-002', order: 3,
    title: 'Working with Expressions',
    content: 'An algebraic expression combines variables, constants, and operations. You can simplify expressions by combining like terms (terms with the same variable raised to the same power).',
    keyPoints: ['Combine like terms to simplify', 'Like terms have the same variable and exponent', 'Order of operations still applies'],
    durationMinutes: 8,
  },

  // ── exp-008: The Solar System ──
  {
    id: 'lesson-008-1', courseId: 'exp-008', order: 1,
    title: 'The Inner Planets',
    content: 'The four inner planets — Mercury, Venus, Earth, and Mars — are rocky and relatively small. They are called terrestrial planets. Mercury is closest to the Sun and has no atmosphere, Venus is the hottest planet, Earth supports life, and Mars has the largest volcano in the solar system.',
    keyPoints: ['Mercury, Venus, Earth, Mars', 'Rocky and small', 'Also called terrestrial planets'],
    durationMinutes: 6,
  },
  {
    id: 'lesson-008-2', courseId: 'exp-008', order: 2,
    title: 'The Outer Planets',
    content: 'The outer planets — Jupiter, Saturn, Uranus, and Neptune — are gas giants (or ice giants). They are much larger than the inner planets and have ring systems. Jupiter is the largest, Saturn has the most prominent rings.',
    keyPoints: ['Jupiter, Saturn, Uranus, Neptune', 'Gas giants are enormous', 'Saturn has the most visible rings'],
    durationMinutes: 7,
  },
  {
    id: 'lesson-008-3', courseId: 'exp-008', order: 3,
    title: 'Moons, Asteroids, and Comets',
    content: 'The solar system also contains moons, asteroids, and comets. Earth has one moon, Jupiter has over 90. The asteroid belt lies between Mars and Jupiter. Comets are made of ice and dust and develop tails when near the Sun.',
    keyPoints: ['Moons orbit planets', 'Asteroid belt between Mars and Jupiter', 'Comets have icy tails near the Sun'],
    durationMinutes: 5,
  },
  {
    id: 'lesson-008-4', courseId: 'exp-008', order: 4,
    title: 'The Sun and Beyond',
    content: 'The Sun is a star at the center of our solar system, providing light and heat. It contains 99.8% of the solar system\'s mass. Beyond Neptune lies the Kuiper Belt and the Oort Cloud, home to many comets.',
    keyPoints: ['The Sun is a star', 'It holds 99.8% of the system\'s mass', 'Kuiper Belt and Oort Cloud are at the edge'],
    durationMinutes: 6,
  },

  // ── exp-014: Python for Beginners ──
  {
    id: 'lesson-014-1', courseId: 'exp-014', order: 1,
    title: 'Variables and Data Types',
    content: 'In Python, variables store data. You create a variable by assigning a value with =. Common data types include int (whole numbers), float (decimals), str (text), and bool (True/False). Python is dynamically typed, so you don\'t declare types explicitly.',
    keyPoints: ['Use = to assign values', 'Common types: int, float, str, bool', 'Python infers the type automatically'],
    durationMinutes: 7,
  },
  {
    id: 'lesson-014-2', courseId: 'exp-014', order: 2,
    title: 'Loops and Conditionals',
    content: 'Use if, elif, and else for conditionals. Use for and while loops for repetition. Indentation (spaces at the start of lines) defines code blocks in Python — typically 4 spaces.',
    keyPoints: ['if/elif/else for decisions', 'for and while loops for repetition', 'Indentation defines code blocks'],
    durationMinutes: 10,
  },
  {
    id: 'lesson-014-3', courseId: 'exp-014', order: 3,
    title: 'Functions',
    content: 'Functions are reusable blocks of code defined with the def keyword. They can accept parameters and return values. Functions help avoid code repetition and make programs more organized.',
    keyPoints: ['Use def to define functions', 'Functions can take parameters', 'Use return to send back a result'],
    durationMinutes: 9,
  },
  {
    id: 'lesson-014-4', courseId: 'exp-014', order: 4,
    title: 'Lists and Dictionaries',
    content: 'Lists store ordered collections: [1, 2, 3]. Dictionaries store key-value pairs: {"name": "Alice"}. Both are mutable, meaning you can change their contents after creation.',
    keyPoints: ['Lists use square brackets [ ]', 'Dictionaries use curly braces { }', 'Both are mutable'],
    durationMinutes: 8,
  },

  // ── exp-015: Data Structures in C++ ──
  {
    id: 'lesson-015-1', courseId: 'exp-015', order: 1,
    title: 'Arrays',
    content: 'An array stores elements of the same type in contiguous memory. Access is O(1) by index, but insertion and deletion in the middle are O(n). In C++, use std::array or raw arrays.',
    keyPoints: ['Contiguous memory storage', 'O(1) access by index', 'Fixed size in standard arrays'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-015-2', courseId: 'exp-015', order: 2,
    title: 'Linked Lists',
    content: 'A linked list is a chain of nodes, each containing data and a pointer to the next node. Insertion and deletion at known positions is O(1), but access by index is O(n).',
    keyPoints: ['Nodes contain data + next pointer', 'O(1) insert/delete at known positions', 'O(n) random access'],
    durationMinutes: 10,
  },
  {
    id: 'lesson-015-3', courseId: 'exp-015', order: 3,
    title: 'Stacks and Queues',
    content: 'A stack is LIFO (Last In, First Out) — push and pop from the top. A queue is FIFO (First In, First Out) — enqueue at the back, dequeue from the front. Both can be built using arrays or linked lists.',
    keyPoints: ['Stack = LIFO', 'Queue = FIFO', 'Can be built on arrays or linked lists'],
    durationMinutes: 7,
  },
  {
    id: 'lesson-015-4', courseId: 'exp-015', order: 4,
    title: 'Trees',
    content: 'A tree is a hierarchical structure with a root node and child nodes. Binary trees have at most two children per node. Binary Search Trees (BST) keep left children smaller and right children larger for efficient searching.',
    keyPoints: ['Hierarchical, not linear', 'Binary trees: max 2 children per node', 'BST enables O(log n) search'],
    durationMinutes: 12,
  },

  // ── exp-027: Ancient Civilizations ──
  {
    id: 'lesson-027-1', courseId: 'exp-027', order: 1,
    title: 'Mesopotamia: The Cradle of Civilization',
    content: 'Mesopotamia, located between the Tigris and Euphrates rivers (modern Iraq), is one of the earliest known civilizations. The Sumerians invented cuneiform writing around 3200 BCE, built city-states like Ur and Uruk, and developed the wheel and agriculture.',
    keyPoints: ['Located between Tigris and Euphrates', 'Invented cuneiform writing ~3200 BCE', 'City-states: Ur, Uruk, Babylon'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-027-2', courseId: 'exp-027', order: 2,
    title: 'Ancient Egypt: Land of the Pharaohs',
    content: 'Ancient Egypt thrived along the Nile River for over 3,000 years. The Egyptians built pyramids as tombs for pharaohs, developed hieroglyphic writing, and made advances in medicine, mathematics, and engineering. The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World.',
    keyPoints: ['Civilization along the Nile River', 'Built the Great Pyramids of Giza', 'Hieroglyphic writing system'],
    durationMinutes: 10,
  },
  {
    id: 'lesson-027-3', courseId: 'exp-027', order: 3,
    title: 'Contributions to Humanity',
    content: 'Ancient civilizations laid the foundation for modern society. Mesopotamia gave us writing, law (Code of Hammurabi), and the wheel. Egypt contributed monumental architecture, papyrus, and medicine. Both developed calendars, mathematics, and irrigation systems.',
    keyPoints: ['Writing systems: cuneiform and hieroglyphs', 'Code of Hammurabi: early law', 'Advances in math, medicine, and engineering'],
    durationMinutes: 6,
  },

  // ── exp-021: English Grammar Essentials ──
  {
    id: 'lesson-021-1', courseId: 'exp-021', order: 1,
    title: 'Parts of Speech',
    content: 'The eight parts of speech are: nouns (names), pronouns (replaces nouns), verbs (actions), adjectives (describe nouns), adverbs (describe verbs), prepositions (show relationships), conjunctions (connect), and interjections (emotions).',
    keyPoints: ['8 parts of speech', 'Nouns name, verbs act, adjectives describe', 'Conjunctions connect ideas'],
    durationMinutes: 7,
  },
  {
    id: 'lesson-021-2', courseId: 'exp-021', order: 2,
    title: 'Verb Tenses',
    content: 'Tenses show when an action happens: past (walked), present (walk/walks), future (will walk). Each has simple, continuous, and perfect forms. The perfect tense uses "have/has/had" to connect past and present.',
    keyPoints: ['Past, present, future tenses', 'Simple, continuous, perfect forms', 'Perfect tense links past to present'],
    durationMinutes: 9,
  },
  {
    id: 'lesson-021-3', courseId: 'exp-021', order: 3,
    title: 'Sentence Structure',
    content: 'A complete sentence needs a subject and a predicate. Simple sentences have one clause. Compound sentences join two with a conjunction. Complex sentences combine an independent and dependent clause.',
    keyPoints: ['Subject + predicate = sentence', 'Simple, compound, and complex types', 'Use commas to separate clauses correctly'],
    durationMinutes: 8,
  },

  // ── exp-009: Chemical Bonding ──
  {
    id: 'lesson-009-1', courseId: 'exp-009', order: 1,
    title: 'Ionic Bonds',
    content: 'Ionic bonds form when one atom transfers electrons to another, creating charged ions that attract each other. This typically happens between metals (lose electrons) and nonmetals (gain electrons). The result is a crystalline compound like NaCl (table salt).',
    keyPoints: ['Electron transfer creates ions', 'Metal + nonmetal', 'Forms crystalline solids'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-009-2', courseId: 'exp-009', order: 2,
    title: 'Covalent Bonds',
    content: 'Covalent bonds form when two atoms share electrons. This happens between nonmetals. In a water molecule (H₂O), oxygen shares electrons with two hydrogen atoms. Single, double, and triple bonds share 1, 2, or 3 electron pairs.',
    keyPoints: ['Atoms share electrons', 'Nonmetal + nonmetal', 'Single, double, triple bonds'],
    durationMinutes: 7,
  },
  {
    id: 'lesson-009-3', courseId: 'exp-009', order: 3,
    title: 'Metallic Bonds and Electronegativity',
    content: 'Metallic bonds form a "sea of electrons" around metal atoms, giving metals their conductivity and malleability. Electronegativity measures how strongly an atom attracts electrons. A large difference in electronegativity produces ionic bonds; a small difference produces covalent bonds.',
    keyPoints: ['Metals: shared electron sea', 'Electronegativity = electron attraction strength', 'Large difference → ionic, small difference → covalent'],
    durationMinutes: 9,
  },

  // ── exp-028: The French Revolution ──
  {
    id: 'lesson-028-1', courseId: 'exp-028', order: 1,
    title: 'Causes of the Revolution',
    content: 'The French Revolution (1789) was caused by heavy taxation on the poor, food shortages, Enlightenment ideas about equality, and the financial crisis of the monarchy. The Third Estate (commoners) bore the tax burden while the clergy and nobility paid almost nothing.',
    keyPoints: ['Unfair taxation on the poor', 'Enlightenment ideas spread', 'Financial crisis of the monarchy'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-028-2', courseId: 'exp-028', order: 2,
    title: 'Key Events: Bastille to Reign of Terror',
    content: 'The storming of the Bastille on July 14, 1789, marked the start of the Revolution. The Declaration of the Rights of Man established equal rights. The Reign of Terror under Robespierre saw thousands executed by guillotine.',
    keyPoints: ['Storming of the Bastille — July 14, 1789', 'Declaration of the Rights of Man', 'Reign of Terror under Robespierre'],
    durationMinutes: 10,
  },
  {
    id: 'lesson-028-3', courseId: 'exp-028', order: 3,
    title: 'Rise of Napoleon',
    content: 'After the Revolution, political instability led to Napoleon Bonaparte\'s rise to power. He crowned himself Emperor in 1804, reformed French law (Napoleonic Code), and conquered much of Europe before his defeat at Waterloo in 1815.',
    keyPoints: ['Napoleon seized power in 1799', 'Created the Napoleonic Code', 'Defeated at Waterloo, 1815'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-028-4', courseId: 'exp-028', order: 4,
    title: 'Impact on Modern Democracy',
    content: 'The French Revolution inspired democratic movements worldwide. It spread ideas of liberty, equality, and popular sovereignty. It also influenced the Haitian Revolution and Latin American independence movements.',
    keyPoints: ['Spread democratic ideals', 'Inspired other revolutions', 'Established popular sovereignty'],
    durationMinutes: 6,
  },

  // ── exp-034: Watercolor Painting ──
  {
    id: 'lesson-034-1', courseId: 'exp-034', order: 1,
    title: 'Materials and Setup',
    content: 'You need watercolor paper (140lb or heavier), brushes (round #6 and #10), a palette, watercolor paints, two water containers, and paper towels. Tape your paper to a board to prevent warping.',
    keyPoints: ['Use heavyweight paper (140lb+)', 'Round brushes in multiple sizes', 'Two water cups: one for rinsing, one for clean water'],
    durationMinutes: 5,
  },
  {
    id: 'lesson-034-2', courseId: 'exp-034', order: 2,
    title: 'Wet-on-Wet Technique',
    content: 'Wet-on-wet means applying wet paint to wet paper. Wet the paper first with clean water, then add paint. The colors blend and spread softly, creating dreamy gradients perfect for skies and backgrounds.',
    keyPoints: ['Wet the paper before applying paint', 'Colors blend and spread naturally', 'Great for skies and soft backgrounds'],
    durationMinutes: 8,
  },
  {
    id: 'lesson-034-3', courseId: 'exp-034', order: 3,
    title: 'Dry Brush and Color Mixing',
    content: 'Dry brush uses minimal water for textured, sharp strokes. Color mixing on the palette creates new colors. Mix complementary colors (opposite on the color wheel) to create muted, natural tones.',
    keyPoints: ['Dry brush: minimal water, lots of texture', 'Mix on the palette, not on the paper', 'Complementary colors create muted tones'],
    durationMinutes: 7,
  },
];

export function getLessonsForCourse(courseId: string): Lesson[] {
  return LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function hasLessons(courseId: string): boolean {
  return LESSONS.some((l) => l.courseId === courseId);
}
