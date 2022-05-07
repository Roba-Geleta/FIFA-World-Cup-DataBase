// SET UP

import * as SQL from './SQL.js'
const db = openDatabase("Project3380", "1.0", "Project3380", 1024*1024)

// Add OnClick functionality to the query buttons
let queryList = [SQL.q1, SQL.q2, SQL.q3, SQL.q4, SQL.q5, SQL.q6, SQL.q7, SQL.q8, SQL.q9, SQL.q10,
    SQL.q11, SQL.q12, SQL.q13, SQL.q14, SQL.q15, SQL.q16, SQL.q17, SQL.q18, SQL.q19, SQL.q20, SQL.q21, SQL.q22, SQL.q23, SQL.q24, SQL.q25, SQL.q26]

let QueryNameList = [SQL.SQ1, SQL.SQ2, SQL.SQ3, SQL.SQ4, SQL.SQ5, SQL.SQ6, SQL.SQ7, SQL.SQ8, SQL.SQ9, SQL.SQ10, SQL.SQ11, SQL.SQ12, SQL.SQ13, SQL.SQ14, SQL.SQ15, SQL.SQ16,
    SQL.SQ17, SQL.SQ18, SQL.SQ19, SQL.SQ20, SQL.SQ21, SQL.SQ22, SQL.SQ23, SQL.SQ24, SQL.SQ25, SQL.SQ26]

let TableTitle = ""

for (let i = 1; i <= 26; i++) {

    let id = "Query" + i

    $("#" + id).on('click', function () {
        TableTitle = QueryNameList[i-1];
        if(i>16)
        {
            TableTitle+= " Table";
        }
        QueryClicked(id, queryList[i-1], TableTitle)


    });

}


for (let i = 1; i <= 26; i++) {

    let id = "Query" + i

    $("#" + id).html(QueryNameList[i-1]);
}

$('#dataTableList').append('<h2 style="tableInfo" class="tableInfo"><strong>Database summary: Match statistics for every FIFA World Cup game ever played from 1930 to 2014</strong><br><br> ' +
    'Table will be shown here after a button is clicked</h2>');


// Functions

function tableOutPut(result)
{
    let dataTable = `<tr>`
    for (let i in result.rows[0]) {
        dataTable += `<th>${i}</th>`
    }
    dataTable += `</tr>`

    for (let i of result.rows) {
        dataTable += `<tr>`
        for (let m in result.rows[0]) {
            dataTable += `<td class="Qtd">${i[m]}</td>`
        }
        dataTable += `</tr>`
    }
    $('#dataTableList').append(dataTable);
}

function QueryClicked(QClicked, QuerySelected, QueryTitle)
{
    db.transaction((transaction) => {

        $('#dataTableList').children().remove();
        $('#QuerySelectedTitle').html('')
        $('#QuerySelectedTitle').html(`<h2 class="QTitle" >Current Table: ${QueryTitle}</h2>`)
        transaction.executeSql(QuerySelected, undefined, (transaction, result)=>{

            if (result.rows.length) {

                tableOutPut(result)

                for (let i = 0; i < result.rows.length; i++) {

                    let row = result.rows[i]
                }

            }
            else {
                $('#dataTableList').append('<h2> <strong>Table is empty</strong></h2>');
            }
        }, (txe, e)=> {
            console.log("DB error: " + e.message);
        })

    });
}

$("#csvdownloadbutton").on('click', function () {
    csvDownloader()
});

function csvDownloader()
{
    let tableToExport = $('#dataTableList tr').length == 0;

    if (!tableToExport)
        $('#dataTableList').table2csv();

    else
        $('#dataTableList').append('<h2 class="tableInfo" style="text-align: center">Can not export to CSV as no table is selected</h2>');
}


// CREATE TABLES USING WebSQL
db.transaction((transaction) => {

    let createTablesQuery = [SQL.Match, SQL.MatchLocation, SQL.Team, SQL.AwayTeam, SQL.HomeTeam, SQL.Officials, SQL.PlayedAt, SQL.PlayedBy, SQL.Officiated, SQL.PlaysAgainst]

    for (let query of createTablesQuery) {
        transaction.executeSql(query, undefined, ()=>{console.log("Success create")}, (txe, e)=>{
            console.log("DB error: " + e.message);
        })
    }

});


// The below creates the database, handles queries and shows output

$(document).ready(() => {

    //  Fetch CSV file, build the database, populate it and execute queries

    $.ajax({
        url: "WorldCupMatches.csv",
        dataType: "text",
        success: (data) => {

            let dataArrays = $.csv.toObjects(data)

            $(".queryButtons").hide();
            $(".queryButtons2").hide();

            for (let element in dataArrays) {

                // CSV columns
                let Datetime = dataArrays[element]["Datetime"];
                let Stage = dataArrays[element]["Stage"];
                let Stadium = dataArrays[element]["Stadium"];
                let City = dataArrays[element]["City"];
                let HomeTeamName = dataArrays[element]["HomeTeamName"];
                let HomeTeamGoals = dataArrays[element]["HomeTeamGoals"];
                let AwayTeamGoals = dataArrays[element]["AwayTeamGoals"];
                let AwayTeamName = dataArrays[element]["AwayTeamName"];
                let Attendance = dataArrays[element]["Attendance"];
                let HalfTimeHomeGoals = dataArrays[element]["HalfTimeHomeGoals"];
                let HalfTimeAwayGoals = dataArrays[element]["HalfTimeAwayGoals"];
                let Referee = dataArrays[element]["Referee"];
                let Assistant1 = dataArrays[element]["Assistant1"];
                let Assistant2 = dataArrays[element]["Assistant2"];
                let HomeTeamInitials = dataArrays[element]["HomeTeamInitials"];
                let AwayTeamInitials = dataArrays[element]["AwayTeamInitials"];

                // SQL insert statements

                let insertTeam = `INSERT INTO Team VALUES ("${HomeTeamName}", "${HomeTeamInitials}");`

                let insertTeam2= `INSERT INTO Team VALUES ("${AwayTeamName}", "${AwayTeamInitials}");`

                let insertMatch = `INSERT INTO Match VALUES ("${Datetime}", "${Stage}", "${Stadium}", ${HalfTimeAwayGoals},
                ${HalfTimeHomeGoals}, ${AwayTeamGoals}, ${HomeTeamGoals}, "${AwayTeamName}", "${HomeTeamName}", ${Attendance}, "${Referee}");`

                let insertMatchLocation = `INSERT INTO MatchLocation VALUES ("${Stadium}", "${City}");`

                let insertAwayTeam = `INSERT INTO AwayTeam VALUES ("${AwayTeamName}", "${Datetime}", "${AwayTeamInitials}");`

                let insertHomeTeam = `INSERT INTO HomeTeam VALUES ("${HomeTeamName}", "${Datetime}", "${HomeTeamInitials}");`

                let insertOfficials = `INSERT INTO Officials VALUES ("${Referee}", "${Datetime}", "${Assistant1}", "${Assistant2}");`

                let insertPlayedAt = `INSERT INTO PlayedAt VALUES ("${Stadium}", "${HomeTeamName}");`
                let insertPlayedAt2 = `INSERT INTO PlayedAt VALUES ("${Stadium}", "${AwayTeamName}");`

                let insertPlayedBy = `INSERT INTO PlayedBy VALUES ("${Datetime}", "${Stage}", "${Stadium}", "${HomeTeamName}");`
                let insertPlayedBy2 = `INSERT INTO PlayedBy VALUES ("${Datetime}", "${Stage}", "${Stadium}", "${AwayTeamName}");`

                let insertOfficiated = `INSERT INTO Officiated VALUES ("${Referee}", "${HomeTeamName}", "${Datetime}");`
                let insertOfficiated2 = `INSERT INTO Officiated VALUES ("${Referee}", "${AwayTeamName}", "${Datetime}");`

                let insertPlaysAgainst = `INSERT INTO PlaysAgainst VALUES ("${AwayTeamName}", "${HomeTeamName}", "${Datetime}");`


                db.transaction((transaction) => {

                    let insertTableQueries = [insertTeam, insertTeam2, insertMatch, insertMatchLocation, insertAwayTeam, insertHomeTeam, insertOfficials, insertPlayedAt, insertPlayedAt2, insertPlayedBy, insertPlayedBy2, insertOfficiated, insertOfficiated2, insertPlaysAgainst]

                    for (let query of insertTableQueries) {

                        transaction.executeSql(query, undefined, () => {
                            console.log("Success create")
                            },(txe, e) => {
                                console.log("DB error: " + e.message);
                        })
                    }

                });
            }

            $(".queryButtons").show();
            $(".queryButtons2").show();
        }
    })
})

$("#STB").on('click', function () {
    scrollToBottom();
});

let scrollingElement = (document.scrollingElement || document.body)
function scrollToBottom() {
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}




