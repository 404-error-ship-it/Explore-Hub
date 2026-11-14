import { Quiz } from '../models/quiz.model';

export const QUIZZES: readonly Quiz[] = [
  {
    courseId: 'exp-001',
    title: 'Fractions Quiz',
    description: 'Test your understanding of fractions.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'In the fraction 3/4, what is the numerator?', options: ['4', '3', '7', '1/4'], correctAnswer: 1, explanation: 'The numerator is the top number (3), and the denominator is the bottom number (4).' },
      { id: 'q2', question: 'Which fraction is equivalent to 1/2?', options: ['2/3', '3/6', '1/3', '2/5'], correctAnswer: 1, explanation: '3/6 simplifies to 1/2 because both 3 and 6 divide by 3.' },
      { id: 'q3', question: 'What is 1/4 + 1/4?', options: ['1/8', '2/8', '2/4', '1/2'], correctAnswer: 2, explanation: 'Same denominator: add numerators. 1/4 + 1/4 = 2/4, which simplifies to 1/2.' },
      { id: 'q4', question: 'How do you divide 1/2 by 1/4?', options: ['Multiply by 4/1', 'Multiply by 1/4', 'Divide denominators', 'Subtract 1/4'], correctAnswer: 0, explanation: 'To divide, flip the second fraction (reciprocal) and multiply: 1/2 × 4/1 = 4/2 = 2.' },
      { id: 'q5', question: 'What is 2/3 × 3/4?', options: ['6/12', '6/7', '5/7', '1/2'], correctAnswer: 3, explanation: 'Multiply numerators (2×3=6) and denominators (3×4=12): 6/12 = 1/2.' },
    ],
  },
  {
    courseId: 'exp-002',
    title: 'Algebra Basics Quiz',
    description: 'Test your algebra skills.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'Solve for x: x + 5 = 12', options: ['x = 7', 'x = 17', 'x = 5', 'x = 60'], correctAnswer: 0, explanation: 'Subtract 5 from both sides: x = 12 - 5 = 7.' },
      { id: 'q2', question: 'In 3x + 7, what is the coefficient of x?', options: ['7', '3', 'x', '10'], correctAnswer: 1, explanation: 'The coefficient is the number multiplied by the variable, which is 3.' },
      { id: 'q3', question: 'Simplify: 2x + 3x', options: ['5x', '6x', '5x²', 'xy'], correctAnswer: 0, explanation: 'Combine like terms: 2x + 3x = 5x.' },
      { id: 'q4', question: 'Solve: 2x = 10', options: ['x = 12', 'x = 5', 'x = 20', 'x = 8'], correctAnswer: 1, explanation: 'Divide both sides by 2: x = 10/2 = 5.' },
      { id: 'q5', question: 'What is a variable?', options: ['A fixed number', 'A symbol for an unknown value', 'An equation', 'A constant'], correctAnswer: 1, explanation: 'A variable is a symbol (usually a letter) representing an unknown or changing value.' },
    ],
  },
  {
    courseId: 'exp-008',
    title: 'Solar System Quiz',
    description: 'Test your knowledge of the solar system.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 2, explanation: 'Mercury is the closest planet to the Sun.' },
      { id: 'q2', question: 'Which planet is the largest in the solar system?', options: ['Saturn', 'Jupiter', 'Earth', 'Neptune'], correctAnswer: 1, explanation: 'Jupiter is the largest planet, with a diameter about 11 times that of Earth.' },
      { id: 'q3', question: 'What separates Mars and Jupiter?', options: ['The Kuiper Belt', 'The Oort Cloud', 'The Asteroid Belt', 'The Milky Way'], correctAnswer: 2, explanation: 'The asteroid belt lies between Mars and Jupiter.' },
      { id: 'q4', question: 'Which planet has the most prominent rings?', options: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'], correctAnswer: 2, explanation: 'Saturn has the most visible and prominent ring system.' },
      { id: 'q5', question: 'What percentage of the solar system\'s mass does the Sun contain?', options: ['50%', '75%', '90%', '99.8%'], correctAnswer: 3, explanation: 'The Sun contains about 99.8% of the total mass of the solar system.' },
    ],
  },
  {
    courseId: 'exp-014',
    title: 'Python Basics Quiz',
    description: 'Test your Python knowledge.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'Which keyword defines a function in Python?', options: ['function', 'def', 'fn', 'func'], correctAnswer: 1, explanation: 'The def keyword is used to define functions in Python.' },
      { id: 'q2', question: 'What is the output of: print(type(42))?', options: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"], correctAnswer: 1, explanation: '42 is an integer, so type(42) returns <class \'int\'.' },
      { id: 'q3', question: 'How do you create a list in Python?', options: ['{1, 2, 3}', '[1, 2, 3]', '(1, 2, 3)', '<1, 2, 3>'], correctAnswer: 1, explanation: 'Lists are created with square brackets: [1, 2, 3].' },
      { id: 'q4', question: 'Which loop iterates over a sequence?', options: ['while', 'for', 'repeat', 'loop'], correctAnswer: 1, explanation: 'The for loop iterates over a sequence (like a list or range).' },
      { id: 'q5', question: 'What does the len() function do?', options: ['Returns the last element', 'Returns the length', 'Returns the type', 'Returns the first element'], correctAnswer: 1, explanation: 'len() returns the number of items in an object.' },
    ],
  },
  {
    courseId: 'exp-015',
    title: 'Data Structures Quiz',
    description: 'Test your data structures knowledge.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'What is the time complexity of array access by index?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctAnswer: 1, explanation: 'Array access by index is O(1) — constant time.' },
      { id: 'q2', question: 'Which structure is LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctAnswer: 1, explanation: 'A stack is Last In, First Out (LIFO).' },
      { id: 'q3', question: 'Which structure is FIFO?', options: ['Queue', 'Stack', 'Tree', 'Heap'], correctAnswer: 0, explanation: 'A queue is First In, First Out (FIFO).' },
      { id: 'q4', question: 'In a Binary Search Tree, where are smaller values stored?', options: ['Right subtree', 'Left subtree', 'Root only', 'Anywhere'], correctAnswer: 1, explanation: 'In a BST, smaller values go to the left subtree.' },
      { id: 'q5', question: 'What is the access time of a linked list by index?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, explanation: 'Linked list access by index is O(n) because you must traverse from the head.' },
    ],
  },
  {
    courseId: 'exp-027',
    title: 'Ancient Civilizations Quiz',
    description: 'Test your knowledge of ancient civilizations.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'Where was Mesopotamia located?', options: ['Between the Nile and Congo', 'Between the Tigris and Euphrates', 'Between the Indus and Ganges', 'Between the Yellow and Yangtze'], correctAnswer: 1, explanation: 'Mesopotamia was located between the Tigris and Euphrates rivers (modern Iraq).' },
      { id: 'q2', question: 'What writing system did the Sumerians invent?', options: ['Hieroglyphs', 'Cuneiform', 'Phoenician', 'Latin'], correctAnswer: 1, explanation: 'The Sumerians invented cuneiform writing around 3200 BCE.' },
      { id: 'q3', question: 'Which structure is one of the Seven Wonders of the Ancient World?', options: ['Hanging Gardens', 'Great Pyramid of Giza', 'Colossus of Rhodes', 'All of the above'], correctAnswer: 3, explanation: 'All of these were Seven Wonders, but the Great Pyramid of Giza is the most associated with Egypt.' },
      { id: 'q4', question: 'What early law code came from Mesopotamia?', options: ['Code of Hammurabi', 'Magna Carta', 'Twelve Tables', 'Edict of Milan'], correctAnswer: 0, explanation: 'The Code of Hammurabi was one of the earliest known legal codes.' },
      { id: 'q5', question: 'Along which river did Ancient Egypt thrive?', options: ['Tigris', 'Euphrates', 'Nile', 'Amazon'], correctAnswer: 2, explanation: 'Ancient Egypt thrived along the Nile River.' },
    ],
  },
  {
    courseId: 'exp-021',
    title: 'English Grammar Quiz',
    description: 'Test your grammar knowledge.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'How many parts of speech are there?', options: ['6', '7', '8', '9'], correctAnswer: 2, explanation: 'There are 8 parts of speech: noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection.' },
      { id: 'q2', question: 'Which sentence uses the past tense?', options: ['She walks to school.', 'She will walk to school.', 'She walked to school.', 'She is walking to school.'], correctAnswer: 2, explanation: '"Walked" is the past tense form of "walk."' },
      { id: 'q3', question: 'What is the subject in: "The cat slept on the mat"?', options: ['slept', 'on the mat', 'the mat', 'The cat'], correctAnswer: 3, explanation: 'The subject is who or what the sentence is about — "The cat."' },
      { id: 'q4', question: 'Which is a compound sentence?', options: ['She ran fast.', 'She ran fast and won the race.', 'Although she was tired, she finished.', 'She ran.'], correctAnswer: 1, explanation: 'A compound sentence joins two independent clauses with a conjunction.' },
      { id: 'q5', question: 'Which word is an adverb?', options: ['quickly', 'beautiful', 'garden', 'happy'], correctAnswer: 0, explanation: '"Quickly" is an adverb — it describes how a verb is performed.' },
    ],
  },
  {
    courseId: 'exp-009',
    title: 'Chemical Bonding Quiz',
    description: 'Test your chemistry knowledge.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'Which bond involves electron transfer?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correctAnswer: 1, explanation: 'Ionic bonds form when one atom transfers electrons to another.' },
      { id: 'q2', question: 'Which bond involves electron sharing?', options: ['Ionic', 'Covalent', 'Metallic', 'Van der Waals'], correctAnswer: 1, explanation: 'Covalent bonds form when atoms share electrons.' },
      { id: 'q3', question: 'NaCl (table salt) is an example of which bond type?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correctAnswer: 1, explanation: 'NaCl forms an ionic bond — sodium gives an electron to chlorine.' },
      { id: 'q4', question: 'What gives metals their electrical conductivity?', options: ['Ionic bonds', 'Covalent bonds', 'Sea of shared electrons', 'Rigid crystal structure'], correctAnswer: 2, explanation: 'Metallic bonds create a "sea of electrons" that allows conductivity.' },
      { id: 'q5', question: 'A large electronegativity difference produces which bond?', options: ['Covalent', 'Ionic', 'Metallic', 'No bond'], correctAnswer: 1, explanation: 'A large electronegativity difference leads to ionic bonding.' },
    ],
  },
  {
    courseId: 'exp-028',
    title: 'French Revolution Quiz',
    description: 'Test your history knowledge.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'When was the Bastille stormed?', options: ['July 14, 1789', 'June 14, 1789', 'August 14, 1789', 'July 4, 1789'], correctAnswer: 0, explanation: 'The Bastille was stormed on July 14, 1789, now celebrated as Bastille Day.' },
      { id: 'q2', question: 'Who led the Reign of Terror?', options: ['Napoleon', 'Robespierre', 'Louis XVI', 'Lafayette'], correctAnswer: 1, explanation: 'Maximilien Robespierre led the Reign of Terror.' },
      { id: 'q3', question: 'What document established equal rights during the Revolution?', options: ['Magna Carta', 'Declaration of the Rights of Man', 'Constitution of 1791', 'Napoleonic Code'], correctAnswer: 1, explanation: 'The Declaration of the Rights of Man and of the Citizen was adopted in 1789.' },
      { id: 'q4', question: 'When was Napoleon defeated at Waterloo?', options: ['1804', '1812', '1815', '1821'], correctAnswer: 2, explanation: 'Napoleon was defeated at Waterloo in 1815.' },
      { id: 'q5', question: 'Which estate bore the heaviest tax burden?', options: ['First Estate (clergy)', 'Second Estate (nobility)', 'Third Estate (commoners)', 'All equally'], correctAnswer: 2, explanation: 'The Third Estate (commoners) bore the tax burden while clergy and nobility paid little.' },
    ],
  },
  {
    courseId: 'exp-034',
    title: 'Watercolor Painting Quiz',
    description: 'Test your art knowledge.',
    passingScore: 60,
    questions: [
      { id: 'q1', question: 'What weight paper is recommended for watercolor?', options: ['90lb', '140lb or heavier', '50lb', '300lb only'], correctAnswer: 1, explanation: '140lb or heavier paper prevents warping when wet.' },
      { id: 'q2', question: 'What does "wet-on-wet" mean?', options: ['Dry paint on wet paper', 'Wet paint on wet paper', 'Wet paint on dry paper', 'Dry paint on dry paper'], correctAnswer: 1, explanation: 'Wet-on-wet applies wet paint to pre-wetted paper for soft blends.' },
      { id: 'q3', question: 'What does the dry brush technique create?', options: ['Soft gradients', 'Sharp textured strokes', 'Smooth washes', 'No texture'], correctAnswer: 1, explanation: 'Dry brush uses minimal water for sharp, textured strokes.' },
      { id: 'q4', question: 'What do complementary colors create when mixed?', options: ['Brighter colors', 'Muted, natural tones', 'Black', 'White'], correctAnswer: 1, explanation: 'Mixing complementary colors produces muted, natural tones.' },
      { id: 'q5', question: 'Why use two water containers?', options: ['No reason', 'One for rinsing, one for clean water', 'For hot and cold', 'For different colors'], correctAnswer: 1, explanation: 'One cup rinses brushes, the other holds clean water for mixing.' },
    ],
  },
];

export function getQuizForCourse(courseId: string): Quiz | null {
  return QUIZZES.find((q) => q.courseId === courseId) ?? null;
}

export function hasQuiz(courseId: string): boolean {
  return QUIZZES.some((q) => q.courseId === courseId);
}
