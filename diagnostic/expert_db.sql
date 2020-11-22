SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Profiles;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Profiles_Skills;
DROP TABLE IF EXISTS Profiles_Courses;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE Profiles
(
    profile_id      int(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    profile_pic     varchar(255),
    first_name      varchar(255) NOT NULL,
    last_name       varchar(255) NOT NULL,
    email           varchar(255) NOT NULL,
    industry        varchar(255) NOT NULL,
    github_link     varchar(255),
    linkedin_link   varchar(255),
    twitter_link    varchar(255)
) ENGINE = InnoDB;

CREATE TABLE Skills
(
    skill_id     int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    skill_name   varchar(255) NOT NULL
) ENGINE = InnoDB;


CREATE TABLE Courses
(
    course_id   int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    course_name varchar(255) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE Profiles_Skills
(
    profile_id  int(11) NOT NULL,
    skill_id    int(11) NOT NULL,
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES Profiles (profile_id)  ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills (skill_id) ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE Profiles_Courses
(
    profile_id  int(11) NOT NULL,
    course_id   int(11) NOT NULL,
    PRIMARY KEY (profile_id, course_id),
    FOREIGN KEY (profile_id) REFERENCES Profiles (profile_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses (course_id) ON DELETE CASCADE
) ENGINE = InnoDB;


# Sample Data to insert
INSERT INTO Profiles (profile_pic, first_name, last_name, email, industry, github_link, linkedin_link, twitter_link)
VALUES      (NULL, 'Joe', 'Doe', 'joedoetest@oregonstate.edu', 'Oregon State University', 'https://github.com/JoeDoeOSUTest',
            'https://www.linkedin.com/in/joe-doe-OSU-test/', 'https://twitter.com/JoeDoeOSUTest'),
            (NULL, 'Jane', 'Doe', 'janedoetest@oregonstate.edu', 'Oregon State University', 'https://github.com/JaneDoeOSUTest',
            'https://www.linkedin.com/in/jane-doe-OSU-test/', 'https://twitter.com/JaneDoeOSUTest');

INSERT INTO Skills (skill_name)
VALUES  ('Python'),
        ('C'),
        ('C++'),
        ('Javascript'),
        ('Node.js'),
        ('HTML'),
        ('CSS'),
        ('React'),
        ('Java'),
        ('Rust'),
        ('SQL'),
        ('MongoDB'),
        ('Machine Learning'),
        ('Data Engineering'),
        ('GIT'),
        ('Algorithms'),
        ('UI/UX'),
        ('Mobile Development');

INSERT INTO Courses (course_name)
VALUES  ('CS162'),
        ('CS161'),
        ('CS225'),
        ('CS290'),
        ('CS325'),
        ('CS340'),
        ('CS344'),
        ('CS361'),
        ('CS261'),
        ('CS271'),
        ('CS352'),
        ('CS362'),
        ('CS372'),
        ('CS467'),
        ('CS475');

INSERT INTO Profiles_Skills(profile_id, skill_id)
VALUES  (1, 1),
        (1, 3),
        (1, 4),
        (1, 5),
        (2, 2),
        (2, 3),
        (2, 4),
        (2, 5),
        (2, 6),
        (2, 7),
        (2, 8);

INSERT INTO Profiles_Courses(profile_id, course_id)
VALUES  (1, 1),
        (1, 2),
        (1, 4),
        (2, 1),
        (2, 2),
        (2, 4),
        (2, 5),
        (2, 6),
        (2, 8);