-- Queries that are used on our website for user interaction.

-- Insert a Profile
INSERT INTO Profiles (profile_pic, first_name, last_name, email, industry, github_link, linkedin_link, twitter_link)
SELECT  NULL, ?, ?, ?, ?, ?, ?, ?
WHERE NOT EXISTS
    (SELECT email FROM Profiles WHERE email = ?)
    LIMIT 1;

-- Insert Skill Relationship on signup
INSERT INTO Profiles_Skills (profile_id, skill_id)
VALUES ((   SELECT profile_id FROM Profiles p
            WHERE  p.email = '${email}';),
            SELECT skill_id FROM Skills s
            WHERE s.skill_name = '${skill_name}');

-- Insert Class Relationship

-- Insert a Skill
INSERT INTO Skills (skill_name)
    SELECT '{skill}'
    WHERE NOT EXISTS
    (SELECT * FROM Skills WHERE skill_name = '{skill}');

-- Insert a Course
INSERT INTO Courses (course_name)
    SELECT '{course}'
    WHERE NOT EXISTS
    (SELECT * FROM Courses WHERE course_name = '{course}');

-- Update Profile Data
UPDATE Profiles
SET first_name = ?, last_name = ?, email = ?, industry = ?, github_link = ?, linkedin_link = ?, twitter_link = ? 
WHERE profile_id = ?;

-- Show Full Profile Data
SELECT * FROM Profiles_Skills PS
    INNER JOIN Profiles P on PS.profile_id = P.profile_id
    INNER JOIN Skills S on PS.skill_id = S.skill_id
    INNER JOIN Profiles_Courses PC on P.profile_id = PC.profile_id
    INNER JOIN Courses C on PC.course_id = C.course_id
    WHERE PS.profile_id = 1; -- Add profile id variable here

-- Pull Full Profile by ID
SELECT * FROM Profiles
WHERE profile_id = 1; -- This would need to be passed the profile ID variable

-- Show Skills tied to a profile
-- Gives list of skills to display on profile page
SELECT skill_name FROM Skills S
    INNER JOIN Profiles_Skills PS ON S.skill_id = PS.skill_id
    Where PS.profile_id = 1; --Add variable here

-- Show Courses tied to a profile
-- Gives list of courses to display on profile page
SELECT course_name FROM Courses C
INNER JOIN Profiles_Courses PC ON C.course_id = PC.course_id
Where PC.profile_id = 1; --Add variable here

-- Search for Profiles with Skill/Course - No specification
SELECT * from Profiles P
INNER JOIN Profiles_Skills PS ON P.profile_id = PS.profile_id
INNER JOIN Skills S ON PS.skill_id = S.skill_id
INNER JOIN Profiles_Courses PC ON P.profile_id = PC.profile_id
INNER JOIN Courses C ON PC.course_id = C.course_id
WHERE S.skill_name = "CS162" OR C.course_name = "CS162" --Values here would be searched term
GROUP BY P.profile_id;