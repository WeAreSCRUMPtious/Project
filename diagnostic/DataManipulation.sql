-- Queries that are used on our website for user interaction.

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

-- Show Full Profile Data
SELECT * FROM Profiles_Skills PS
    INNER JOIN Profiles P on PS.profile_id = P.profile_id
    INNER JOIN Skills S on PS.skill_id = S.skill_id
    INNER JOIN Profiles_Courses PC on P.profile_id = PC.profile_id
    INNER JOIN Courses C on PC.course_id = C.course_id
    WHERE PS.profile_id = 1;

-- Show Skills tied to a profile
SELECT skill_name FROM Skills S
    INNER JOIN Profiles_Skills PS ON S.skill_id = PS.skill_id
    Where PS.profile_id = 1; --Add variable here

-- Show Courses tied to a profile
SELECT course_name FROM Courses C
INNER JOIN Profiles_Courses PC ON C.course_id = PC.course_id
Where PC.profile_id = 1; --Add variable here
