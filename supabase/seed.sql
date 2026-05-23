-- QSA Platform — seed data (mirrors the demo content).
-- Run after schema.sql. Safe to re-run: it clears the tables first.

truncate table public.donations, public.campaign_updates, public.campaigns,
               public.events, public.profiles restart identity cascade;

insert into public.profiles
  (name, university, major, degree, grad_year, state, city, industry, is_alumni, bio, initials)
values
  ('Aisha Nurlanovna', 'Stanford University', 'Computer Science', 'Master''s', 2026, 'California', 'Palo Alto', 'AI / Machine Learning', false, 'Building ML systems for healthcare. Ex-research intern at a Bay Area lab.', 'AN'),
  ('Daniyar Sultanov', 'MIT', 'Aerospace Engineering', 'PhD', 2027, 'Massachusetts', 'Cambridge', 'Aerospace', false, 'Researching propulsion systems. Founder of the campus Aerospace Club chapter.', 'DS'),
  ('Madina Ospanova', 'Harvard University', 'Economics', 'Bachelor''s', 2025, 'Massachusetts', 'Boston', 'Finance', false, 'Incoming analyst at a global bank. Mentor for first-gen students.', 'MO'),
  ('Timur Akhmetov', 'UC Berkeley', 'Data Science', 'Bachelor''s', 2024, 'California', 'Berkeley', 'Tech', true, 'Software engineer. Alumni mentor and angel investor in diaspora startups.', 'TA'),
  ('Aru Bekova', 'Columbia University', 'Biomedical Engineering', 'Master''s', 2026, 'New York', 'New York', 'Biotech', false, 'Developing diagnostic devices. Women in STEM organizer.', 'AB'),
  ('Yerlan Kazbekov', 'University of Texas at Austin', 'Petroleum Engineering', 'Bachelor''s', 2025, 'Texas', 'Austin', 'Energy', false, 'Energy transition advocate. Hackathon regular.', 'YK'),
  ('Saltanat Imangali', 'Carnegie Mellon University', 'Human-Computer Interaction', 'Master''s', 2026, 'Pennsylvania', 'Pittsburgh', 'Product Design', false, 'Product designer focused on accessibility.', 'SI'),
  ('Nurlan Abenov', 'University of Michigan', 'Mechanical Engineering', 'PhD', 2028, 'Michigan', 'Ann Arbor', 'Robotics', false, 'Robotics researcher. Builds autonomous systems.', 'NA');

insert into public.events
  (organizer, title, description, date, city, state, venue, lat, lng, attendees, category)
values
  ('QSA National', 'Nauryz Spring Gathering 2026', 'Annual celebration of the Kazakh new year with food, music, and community.', '2026-03-21T17:00:00Z', 'New York', 'New York', 'Brooklyn Expo Center', 40.7359, -73.9911, 340, 'Nauryz'),
  ('Founders Club', 'Bay Area Founders Mixer', 'Meet Kazakh founders, operators, and investors in Silicon Valley.', '2026-06-12T18:30:00Z', 'San Francisco', 'California', 'SoMa Startup Hub', 37.7785, -122.4056, 120, 'Startup'),
  ('QSA Careers', 'East Coast Career Conference', 'Recruiting, panels, and resume workshops with alumni from top firms.', '2026-09-28T09:00:00Z', 'Boston', 'Massachusetts', 'MIT Media Lab', 42.3608, -71.0871, 210, 'Conference'),
  ('QSA Texas', 'Austin Tech Meetup', 'Casual evening for students and engineers in Texas.', '2026-07-08T19:00:00Z', 'Austin', 'Texas', 'Capital Factory', 30.2682, -97.7404, 65, 'Meetup'),
  ('Women in STEM', 'Women in STEM Networking Night', 'Connect with women leaders across science and engineering.', '2026-05-30T18:00:00Z', 'Chicago', 'Illinois', '1871 Innovation Center', 41.8857, -87.6347, 90, 'Networking');

insert into public.campaigns
  (id, student_name, initials, university, major, degree, state, short_bio, story, goals, target, raised, urgency, verified, status)
values
  ('11111111-1111-1111-1111-111111111111', 'Aibek Zhumagali', 'AZ', 'Cornell University', 'Computer Science', 'Bachelor''s', 'New York',
   'First-gen student admitted to Cornell CS, raising funds to cover the tuition gap.',
   'I grew up in a small town near Almaty and became the first in my family to study abroad. Cornell offered me a partial scholarship, but a significant tuition gap remains. With the community''s help I can focus on my studies and give back through mentorship and open-source work.',
   array['Cover the remaining tuition gap for the academic year', 'Afford on-campus housing close to labs', 'Buy a development laptop for research'],
   25000, 16400, 'High', true, 'approved'),
  ('22222222-2222-2222-2222-222222222222', 'Gulnara Serik', 'GS', 'Johns Hopkins University', 'Public Health', 'Master''s', 'Maryland',
   'MPH candidate researching maternal health, raising funds for final-year tuition.',
   'My research focuses on improving maternal health outcomes in rural Central Asia. I am one year away from completing my Master of Public Health and need support to finish without taking on unsustainable debt.',
   array['Fund the final two semesters of the MPH program', 'Travel to a field site for data collection'],
   18000, 4200, 'Medium', true, 'approved'),
  ('33333333-3333-3333-3333-333333333333', 'Ruslan Daribay', 'RD', 'Georgia Tech', 'Electrical Engineering', 'PhD', 'Georgia',
   'PhD student building low-cost sensors, raising funds for a conference and equipment.',
   'I design affordable environmental sensors for developing regions. Presenting at an international conference would open doors to collaborations, and lab equipment would accelerate my prototypes.',
   array['Cover travel to an IEEE conference', 'Purchase prototyping equipment'],
   9000, 8100, 'Low', true, 'approved');

insert into public.donations (campaign_id, donor_name, amount, anonymous) values
  ('11111111-1111-1111-1111-111111111111', 'Timur A.', 1000, false),
  ('11111111-1111-1111-1111-111111111111', 'Anonymous', 500, true),
  ('11111111-1111-1111-1111-111111111111', 'Madina O.', 250, false),
  ('11111111-1111-1111-1111-111111111111', 'QSA Alumni Fund', 5000, false),
  ('22222222-2222-2222-2222-222222222222', 'Anonymous', 2000, true),
  ('22222222-2222-2222-2222-222222222222', 'Aru B.', 200, false),
  ('33333333-3333-3333-3333-333333333333', 'Founders Club', 3000, false),
  ('33333333-3333-3333-3333-333333333333', 'Daniyar S.', 500, false);

insert into public.campaign_updates (campaign_id, date, text) values
  ('11111111-1111-1111-1111-111111111111', '2026-04-02', 'Reached 65% of the goal — thank you to every donor!'),
  ('11111111-1111-1111-1111-111111111111', '2026-03-10', 'Campaign verified by QSA moderators.'),
  ('22222222-2222-2222-2222-222222222222', '2026-04-15', 'Acceptance letter and tuition verified.'),
  ('33333333-3333-3333-3333-333333333333', '2026-04-20', 'Almost funded — 90% reached!');
