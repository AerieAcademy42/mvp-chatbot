
import { Question } from './types';

export const COLORS = {
  primary: '#3498DB',
  primaryLight: '#EBF5FB',
  primaryDark: '#1A5276',
  white: '#FFFFFF',
  black: '#000000',
  jeeOrange: '#f39c12',
  jeeGreen: '#27ae60',
  jeePurple: '#8e44ad',
  jeeGray: '#bdc3c7'
};

export const MOCK_QUESTIONS: Question[] = [
  // ARCHITECTURE
  {
    id: 1,
    subject: 'Architectural Aptitude',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'Which architectural style is characterized by pointed arches, ribbed vaults, and flying buttresses?',
    options: ['Romanesque', 'Gothic', 'Renaissance', 'Baroque'],
    correctAnswer: 1,
    difficulty: 'Easy',
    explanation: 'Gothic architecture is known for its verticality and light, achieved through pointed arches, ribbed vaults, and flying buttresses.'
  },
  {
    id: 2,
    subject: 'Architectural Aptitude',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'Who designed the Fallingwater house in Pennsylvania?',
    options: ['Le Corbusier', 'Frank Lloyd Wright', 'Mies van der Rohe', 'Zaha Hadid'],
    correctAnswer: 1,
    difficulty: 'Easy',
    explanation: 'Fallingwater was designed by Frank Lloyd Wright in 1935 and is a masterpiece of organic architecture.'
  },
  // PHYSICS
  {
    id: 3,
    subject: 'Physics',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'The characteristic distance at which quantum gravitational effects are significant, the Planck length, can be determined from combination of G, h, and c. Which is correct?',
    options: ['G h^2 c^3', 'sqrt(Gh/c^3)', 'G^2 h c', 'h^2 c / G'],
    correctAnswer: 1,
    difficulty: 'Hard',
    explanation: 'The Planck length is defined as sqrt(Gh/c^3).'
  },
  {
    id: 4,
    subject: 'Physics',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'A wire of length L and resistance R is stretched to twice its length. What is its new resistance?',
    options: ['R', '2R', '4R', 'R/2'],
    correctAnswer: 2,
    difficulty: 'Medium',
    explanation: 'Resistance R = ρL/A. When length L is doubled, the cross-sectional area A is halved to keep volume constant, resulting in a resistance of 4R.'
  },
  // MATHEMATICS
  {
    id: 5,
    subject: 'Mathematics',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'Find the derivative of f(x) = sin(x^2).',
    options: ['cos(x^2)', '2x cos(x^2)', '2 sin(x) cos(x)', '-2x cos(x^2)'],
    correctAnswer: 1,
    difficulty: 'Medium',
    explanation: "Using the chain rule, the derivative of sin(u) is cos(u) * u'. Here u = x^2, so u' = 2x, making the derivative 2x cos(x^2)."
  },
  {
    id: 6,
    subject: 'Mathematics',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'The value of integral from 0 to pi/2 of sin(x) dx is:',
    options: ['0', '1', 'pi', '1/2'],
    correctAnswer: 1,
    difficulty: 'Easy',
    explanation: 'The integral of sin(x) is -cos(x). Evaluating from 0 to pi/2 gives [-cos(pi/2)] - [-cos(0)] = 0 - (-1) = 1.'
  },
  // CHEMISTRY
  {
    id: 7,
    subject: 'Chemistry',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'Which of the following has the highest electronegativity?',
    options: ['Oxygen', 'Fluorine', 'Nitrogen', 'Chlorine'],
    correctAnswer: 1,
    difficulty: 'Easy',
    explanation: 'Fluorine is the most electronegative element in the periodic table due to its small size and high effective nuclear charge.'
  },
  {
    id: 8,
    subject: 'Chemistry',
    // Added missing 'type' property
    type: 'MCQ',
    text: 'The oxidation state of Manganese in KMnO4 is:',
    options: ['+2', '+4', '+6', '+7'],
    correctAnswer: 3,
    difficulty: 'Medium',
    explanation: 'In KMnO4, Potassium (K) is +1 and Oxygen (O) is -2. Total charge 0 = 1 + Mn + 4(-2) => Mn = +7.'
  }
];

for(let i=9; i<=60; i++) {
    MOCK_QUESTIONS.push({
        id: i,
        subject: i % 4 === 0 ? 'Physics' : i % 4 === 1 ? 'Chemistry' : i % 4 === 2 ? 'Mathematics' : 'Architectural Aptitude',
        // Added missing 'type' property to dynamically generated questions
        type: 'MCQ',
        text: `Sample Question ${i} for competitive exam practice. What is the logic behind structural integrity in modern high-rise buildings?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        difficulty: 'Medium',
        explanation: 'Structural integrity in high-rise buildings depends on efficient load distribution and wind resistance strategies.'
    });
}
