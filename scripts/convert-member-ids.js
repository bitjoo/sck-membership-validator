require('dotenv').config({ path: '.env.local' });
const fs = require("fs");

const { 
    MEMBERSHIP_ID_XLSX_PATH: inputFile,
    MEMBERSHIP_ID_XLSX_COLUMN: columnName
 } = process.env;

const fileType = "xlsx"

if (!inputFile) {
    throw new Error("Environment variable MEMBERSHIP_ID_XLSX_PATH missing or empty.")
}

if (!inputFile.endsWith(`.${fileType}`)) {
    throw new Error("File needs to be an Excel Sheet (xlsx)");
}

const parser = require('simple-excel-to-json')

console.log("Start converting...", inputFile)

const doc = parser.parseXls2Json(inputFile); 

const memberIds = doc[0].map(row => row[columnName])

fs.writeFileSync("./data/membership_ids.json", JSON.stringify(memberIds));

console.log("Converting successful!")