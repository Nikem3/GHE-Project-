require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const bcrypt = require('bcryptjs')
const db     = require('./connection')

db.prepare('DELETE FROM activity_log').run()
db.prepare('DELETE FROM enquiry_messages').run()
db.prepare('DELETE FROM enquiries').run()
db.prepare('DELETE FROM courses').run()
db.prepare('DELETE FROM users').run()
db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('users','courses','enquiries','enquiry_messages','activity_log')").run()

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

// Demo enquiries — user 1 = Nikem (student), user 2 = Sachin (staff)
const insertEnquiry = db.prepare(`
  INSERT INTO enquiries (student_id, course_id, subject, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, datetime('now', ?), datetime('now', ?))
`)
const insertMessage = db.prepare(`
  INSERT INTO enquiry_messages (enquiry_id, sender_id, body, created_at)
  VALUES (?, ?, ?, datetime('now', ?))
`)

insertEnquiry.run(1, 5, 'Entry requirements for Master of IT', 'resolved', '-6 days', '-4 days')
insertMessage.run(1, 1, 'Hi, I hold a Bachelor of Computing from Nepal. Do I meet the entry requirements for the Master of Information Technology, and is IELTS 6.5 sufficient?', '-6 days')
insertMessage.run(1, 2, 'Hi Nikem, yes — a recognised bachelor in a computing discipline meets the academic requirement, and IELTS 6.5 (no band below 6.0) is sufficient. You can apply directly through the portal.', '-5 days')
insertMessage.run(1, 1, 'Great, thank you! I will start my application this week.', '-4 days')

insertEnquiry.run(1, 1, 'Tuition fee payment plans for BBA', 'in_progress', '-2 days', '-1 days')
insertMessage.run(2, 1, 'Is it possible to pay the Bachelor of Business Administration tuition per trimester instead of the full year upfront?', '-2 days')
insertMessage.run(2, 2, 'We do offer per-trimester payment plans for international students. I am confirming the 2026 instalment schedule with finance and will update you here shortly.', '-1 days')

insertEnquiry.run(1, null, 'On-campus accommodation options', 'open', '-3 hours', '-3 hours')
insertMessage.run(3, 1, 'Does GHE Adelaide offer on-campus accommodation or partner housing for first-year international students? What are the approximate costs?', '-3 hours')

console.log('✓ Seeded 3 users, 8 courses, and 3 demo enquiries.')
