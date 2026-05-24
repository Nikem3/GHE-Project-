require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const bcrypt = require('bcryptjs')
const db     = require('./connection')

db.prepare('DELETE FROM courses').run()
db.prepare('DELETE FROM users').run()
db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('users','courses')").run()

const insertUser = db.prepare(
  'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
)
insertUser.run('Nikem Parajuli',  'nikem@ghe.edu.au',  bcrypt.hashSync('nikem123',    10), 'student')
insertUser.run('Sachin Adhikari', 'sachin@ghe.edu.au', bcrypt.hashSync('sachin123',   10), 'staff')
insertUser.run('Michael Chen',    'admin@ghe.edu.au',  bcrypt.hashSync('Password123!', 10), 'admin')

const insertCourse = db.prepare(`
  INSERT INTO courses (title, level, faculty, duration_years, description, fee_per_year, intakes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const courses = [
  ['Bachelor of Business Administration', 'bachelor', 'Business', 3,
   'A comprehensive undergraduate program covering core business disciplines including management, marketing, finance, and entrepreneurship. Graduates are equipped for leadership roles across all industry sectors.',
   18500, JSON.stringify(['Feb', 'Jul'])],
  ['Bachelor of Information Technology', 'bachelor', 'Technology', 3,
   'Develop practical and theoretical skills in software development, networking, cybersecurity, and systems analysis. Industry placements are available in the final year.',
   19500, JSON.stringify(['Feb', 'Jul'])],
  ['Bachelor of Accounting', 'bachelor', 'Business', 3,
   'Gain the professional accounting knowledge required for CPA and CA pathways. Covers financial reporting, taxation, auditing, and management accounting in depth.',
   18500, JSON.stringify(['Feb', 'Jul'])],
  ['Master of Business Administration', 'master', 'Business', 1.5,
   'An internationally recognised MBA designed for working professionals. Focuses on strategic leadership, global business, innovation, and executive decision-making.',
   24000, JSON.stringify(['Feb', 'Jul', 'Nov'])],
  ['Master of Information Technology', 'master', 'Technology', 2,
   'Advanced study in AI, cloud computing, cybersecurity, and software architecture. Includes a research project completed with Adelaide-based industry partners.',
   26000, JSON.stringify(['Feb', 'Jul'])],
  ['Master of Professional Accounting', 'master', 'Business', 2,
   'A conversion program for non-accounting graduates. Covers all CPA Program foundation subjects and prepares students for careers in public and corporate accounting.',
   23500, JSON.stringify(['Feb', 'Jul'])],
  ['Graduate Diploma of Management', 'diploma', 'Business', 1,
   'A focused one-year program for professionals seeking to formalise their management capabilities. Ideal as a standalone qualification or as a pathway to the MBA.',
   16000, JSON.stringify(['Feb', 'Jul', 'Nov'])],
  ['Graduate Diploma of Information Technology', 'diploma', 'Technology', 1,
   'Designed for professionals transitioning into technology roles. Covers programming fundamentals, database design, networking essentials, and project management.',
   17000, JSON.stringify(['Feb', 'Jul'])],
]

for (const row of courses) insertCourse.run(...row)

console.log('✓ Seeded 3 users and 8 courses.')
