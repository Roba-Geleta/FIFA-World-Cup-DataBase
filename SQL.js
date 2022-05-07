// Below are the table creation SQL statements

export let Match = 'CREATE TABLE Match' +
    '(Datetime VARCHAR(100) NOT NULL,' +
    'Stage VARCHAR(100) NOT NULL,' +
    'Stadium VARCHAR(100) NOT NULL,' +
    'HalfTimeAwayGoals INTEGER,' +
    'HalfTimeHomeGoals INTEGER,' +
    'AwayTeamGoals INTEGER,' +
    'HomeTeamGoals INTEGER,' +
    'AwayTeamName VARCHAR(10),' +
    'HomeTeamName VARCHAR(10),' +
    'Attendance INTEGER,' +
    'Referee VARCHAR(100),' +
    'PRIMARY KEY(Datetime, Stage, Stadium),' +
    'FOREIGN KEY(AwayTeamName) REFERENCES AwayTeam(TeamName),' +
    'FOREIGN KEY(HomeTeamName) REFERENCES HomeTeam(TeamName),' +
    'FOREIGN KEY(Referee) REFERENCES Officials);'

export let MatchLocation = "CREATE TABLE MatchLocation"+
    "(Stadium VARCHAR(100) NOT NULL,"+
    "City VARCHAR(100),"+
    "PRIMARY KEY(Stadium));";

export let Team = "CREATE TABLE Team"+
    "(TeamName VARCHAR(100) NOT NULL,"+
    "TeamInitials VARCHAR(100),"+
    "PRIMARY KEY(TeamName));";

export let AwayTeam = "CREATE TABLE AwayTeam"+
    "(TeamName VARCHAR(100) NOT NULL,"+
    "Time VARCHAR(100) NOT NULL," +
    "TeamInitials VARCHAR(100),"+
    "PRIMARY KEY(TeamName, Time));";

export let HomeTeam = "CREATE TABLE HomeTeam"+
    "(TeamName VARCHAR(100) NOT NULL,"+
    "Time VARCHAR(100) NOT NULL," +
    "TeamInitials VARCHAR(100),"+
    "PRIMARY KEY(TeamName, Time));";

export let Officials = '' +
    'CREATE TABLE Officials (' +
    'Referee VARCHAR(100) NOT NULL,' +
    'Date VARCHAR(100) NOT NULL,' +
    'Assistant1 VARCHAR(100),' +
    'Assistant2 VARCHAR(100),' +
    'PRIMARY KEY(Referee, Date));';

export let PlayedAt = "CREATE TABLE PlayedAt"+
    "(MatchStadium VARCHAR(100) NOT NULL,"+
    "TeamName VARCHAR(100) NOT NULL,"+
    "PRIMARY KEY(MatchStadium,TeamName)," +
    "FOREIGN KEY(MatchStadium) REFERENCES MatchLocation(Stadium),"+
    "FOREIGN KEY(TeamName) REFERENCES Team);"

export let PlayedBy = "CREATE TABLE PlayedBy"+
    '(Datetime VARCHAR(100) NOT NULL,' +
    'Stage VARCHAR(100) NOT NULL,' +
    'Stadium VARCHAR(100) NOT NULL,' +
    "TeamName VARCHAR(100) NOT NULL,"+
    "PRIMARY KEY(Datetime,Stage, Stadium, TeamName)," +
    "FOREIGN KEY(Datetime) REFERENCES Match,"+
    "FOREIGN KEY(Stage) REFERENCES Match,"+
    "FOREIGN KEY(Stadium) REFERENCES Match,"+
    "FOREIGN KEY(TeamName) REFERENCES Team);"

export let Officiated = "CREATE TABLE Officiated"+
    '(Referee VARCHAR(100) NOT NULL,' +
    "TeamName VARCHAR(100) NOT NULL,"+
    "Date VARCHAR(100) NOT NULL,"+
    "PRIMARY KEY(Referee, TeamName)," +
    "FOREIGN KEY(Referee) REFERENCES Officials,"+
    "FOREIGN KEY(TeamName) REFERENCES Team,"+
    "FOREIGN KEY(Date) REFERENCES Officials);";


export let PlaysAgainst = '' +
    'CREATE TABLE PlaysAgainst (' +
    'AwayTeamName VARCHAR(100) NOT NULL,' +
    'HomeTeamName VARCHAR(100) NOT NULL,' +
    'Time VARCHAR(100) NOT NULL,' +
    'PRIMARY KEY(AwayTeamName, HomeTeamName, Time)' +
    "FOREIGN KEY(AwayTeamName) REFERENCES AwayTeam(TeamName),"+
    "FOREIGN KEY(HomeTeamName) REFERENCES HomeTeam(TeamName),"+
    "FOREIGN KEY(Time) REFERENCES HomeTeam);";

// Below are SQL Queries

export let SQ1 = 'Q1: Which teams played in the match with the single highest number of total goals, limited to top 25 entries?';
export let SQ2 = 'Q2: Which teams has had most total attendance in their matches, limited to top 25 entries?';
export let SQ3 = 'Q3: Which matches had one team winning at half time but lost at full time?';
export let SQ4 = 'Q4: How many unique teams have played at each stadium?';
export let SQ5 = 'Q5: Which teams have reached the finals, and how many times?';
export let SQ6 = 'Q6: How many games has each referee refereed?';
export let SQ7 = 'Q7: Which locations has hosted final match?';
export let SQ8 = 'Q8: Which teams have won the world cup, and how many times?';
export let SQ9 = 'Q9: Which matches have the biggest goal difference, limited to top 25 entries?';
export let SQ10= 'Q10: How many matches has each team played?';
export let SQ11= 'Q11: What is the average number of away and home goals for each stage?';
export let SQ12= 'Q12: Which referees officiated 5+ matches and did not officiate for a World Cup Final match?';
export let SQ13= 'Q13: Which teams playing as the HomeTeam have more than 10 match wins?';
export let SQ14= 'Q14: Which teams playing as the AwayTeam have more than 10 match wins?';
export let SQ15= 'Q15: Which Referees have never played the part of an assistant?';
export let SQ16= 'Q16: Which teams have never made it past the group stage?';
export let SQ17= 'Match';
export let SQ18= 'MatchLocation';
export let SQ19= 'Team';
export let SQ20= 'AwayTeam';
export let SQ21= 'HomeTeam';
export let SQ22= 'Officials';
export let SQ23= 'PlayedAt';
export let SQ24= 'PlayedBy';
export let SQ25= 'Officiated';
export let SQ26= 'PlaysAgainst';

export let q1 = `SELECT Datetime, T1.TeamName as HomeTeamName, T2.TeamName as AwayTeamName, AwayTeamGoals, HomeTeamGoals, (HomeTeamGoals + AwayTeamGoals) as TotalGoals FROM Match 
    LEFT JOIN Team as T1 on Match.HomeTeamName = T1.TeamName 
    LEFT JOIN Team as T2 on Match.AwayTeamName = T2.TeamName 
    ORDER BY TotalGoals DESC LIMIT 25;`

export let q2 = `SELECT  TeamName || ' (HOME)' AS TeamName, TeamInitials, SUM(Attendance) AS TotalAttendance From Team 
    LEFT JOIN Match ON Team.TeamName = Match.HomeTeamName 
    GROUP BY HomeTeamName
    UNION SELECT TeamName || ' (AWAY)' AS TeamName, TeamInitials, SUM(Attendance) AS TotalAttendance From Team 
    LEFT JOIN Match ON Team.TeamName = Match.AwayTeamName
    GROUP BY AwayTeamName ORDER BY TotalAttendance DESC LIMIT 25;`

export let q3 = `SELECT Datetime, Stage, AwayTeamName, HomeTeamName, HalfTimeAwayGoals, HalfTimeHomeGoals, AwayTeamGoals, HomeTeamGoals FROM Match 
    WHERE (HalfTimeHomeGoals > HalfTimeAwayGoals AND HomeTeamGoals < AwayTeamGoals) or (HalfTimeHomeGoals < HalfTimeAwayGoals AND HomeTeamGoals > AwayTeamGoals);`

export let q4 = `SELECT MatchStadium, City, COUNT(DISTINCT(TeamName)) AS TotalTeams FROM PlayedAt LEFT JOIN MatchLocation ON PlayedAt.MatchStadium = MatchLocation.Stadium 
    GROUP BY MatchStadium ORDER BY TotalTeams DESC;`

export let q5 = `SELECT TeamName, COUNT(TeamName) AS TotalFinalsReached FROM PlayedBy 
    WHERE Stage="Final" GROUP BY TeamName ORDER BY TotalFinalsReached DESC;`

export let q6 = `SELECT Officials.Referee, COUNT(Officials.Referee) AS TotalMatchRefereed FROM Match 
    LEFT JOIN Officials on Match.Datetime = Officials.Date and Match.Referee = Officials.Referee 
    GROUP BY Officials.Referee ORDER BY TotalMatchRefereed DESC;`

export let q7 = `SELECT Stadium, City, COUNT(Stadium) AS NumOfFinalsHosted FROM Match 
    NATURAL JOIN MatchLocation WHERE Stage="Final" 
    GROUP BY Stadium ORDER BY NumOfFinalsHosted DESC;`

export let q8 = `SELECT TeamName, COUNT(TeamName) AS NumOfWorldCupsWon FROM Match 
    NATURAL JOIN PlayedBy WHERE Stage="Final" AND 
    ((PlayedBy.TeamName = Match.HomeTeamName AND Match.HomeTeamGoals > Match.AwayTeamGoals) OR 
    (PlayedBy.TeamName = Match.AwayTeamName AND Match.AwayTeamGoals > Match.HomeTeamGoals)) 
    GROUP By TeamName ORDER BY NumOfWorldCupsWon DESC;`

export let q9 = `SELECT Datetime, HomeTeamName, AwayTeamName, HomeTeamGoals, AwayTeamGoals, ABS(AwayTeamGoals - HomeTeamGoals) AS GoalDifference FROM Match
    GROUP BY Datetime ORDER BY GoalDifference DESC LIMIT 25;`

export let q10 = `SELECT TeamName, COUNT(TeamName) AS TotalMatchesPlayed FROM PlayedBy
      GROUP BY TeamName ORDER BY TotalMatchesPlayed DESC;`

export let q11 = `SELECT Stage, ROUND(AVG(AwayTeamGoals), 1) AS AverageAwayTeamGoals, ROUND(AVG(HomeTeamGoals), 1) AS AverageHomeTeamGoals FROM Match
    GROUP BY Stage ORDER BY AverageAwayTeamGoals DESC, AverageHomeTeamGoals DESC;`


export let q12 = `SELECT Referee, COUNT(Referee) as NumberOfMatchesOfficiated FROM Officials GROUP BY Referee HAVING NumberOfMatchesOfficiated >= 5 AND
    Referee IN (SELECT Referee FROM Match WHERE Stage = "Final")
    ORDER BY NumberOfMatchesOfficiated DESC`

export let q13 = `SELECT HomeTeamName,COUNT(HomeTeamName) AS NumberOfWinsAsHomeTeam FROM HomeTeam 
    LEFT JOIN Match on HomeTeam.Time = Match.Datetime WHERE 
    (HomeTeam.TeamName = Match.HomeTeamName AND Match.HomeTeamGoals > Match.AwayTeamGoals) 
    GROUP BY TeamName HAVING NumberOfWinsAsHomeTeam > 10 ORDER BY NumberOfWinsAsHomeTeam DESC;`

export let q14 = `SELECT AwayTeamName,COUNT(AwayTeamName) AS NumberOfWinsAsAwayTeam FROM AwayTeam 
    LEFT JOIN Match on AwayTeam.Time = Match.Datetime WHERE 
    (AwayTeam.TeamName = Match.AwayTeamName AND Match.HomeTeamGoals < Match.AwayTeamGoals) 
    GROUP BY TeamName HAVING NumberOfWinsAsAwayTeam > 10 
    ORDER BY NumberOfWinsAsAwayTeam DESC;`

export let q15 = `SELECT Referee FROM Officials AS O WHERE NOT EXISTS 
    (SELECT * FROM Officials as O2 WHERE O2.Referee != O.Referee AND (O.Referee = O2.Assistant1 or O.Referee = O2.Assistant2)) 
    GROUP BY Referee;`

export let q16 = `SELECT TeamName FROM Team WHERE NOT EXISTS 
    (SELECT * FROM Match WHERE (TeamName = HomeTeamName or TeamName = AwayTeamName) AND (STAGE NOT LIKE 'Group%'));`

export let q17 = 'SELECT * FROM Match'
export let q18 = 'SELECT * FROM MatchLocation'
export let q19 = 'SELECT * FROM Team'
export let q20 = 'SELECT * FROM AwayTeam'
export let q21 = 'SELECT * FROM HomeTeam'
export let q22 = 'SELECT * FROM Officials'
export let q23 = 'SELECT * FROM PlayedAt'
export let q24 = 'SELECT * FROM PlayedBy'
export let q25 = 'SELECT * FROM Officiated'
export let q26 = 'SELECT * FROM PlaysAgainst'
