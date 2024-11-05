import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse';
import { validateCPForCNPJ } from './util';

async function readCSV() {
    const records: Array<Record<string, string>> = [];

    const fileContent = fs.createReadStream('./data.csv');

    const parser = fileContent.pipe(parse({
        columns: true,
        delimiter: ',',
        skip_empty_lines: true
    }));

    for await (const record of parser) {
        records.push(record);
    }

    const formattedRecords = records.map(record => {
        record["CPF/CNPJ Validation"] = validateCPForCNPJ(record.nrCpfCnpj) ? "CPF/CNPJ Válido" : "CPF/CNPJ Inválido";
        record["vlPresta"] = String(parseFloat(record.vlTotal) / parseFloat(record.qtPrestacoes));
        Object.keys(record)
            .forEach(key => {
                if (key.includes("vl")) {
                    record[key] = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(Number(record[key]));
                }
            });
        return record;
    });

    return formattedRecords;
}

async function createExcelFile() {
    const records = await readCSV();

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(records);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados Formatados");

    XLSX.writeFile(workbook, "./formatted_data.xlsx");
    fs.writeFileSync("./formatted_data.json", JSON.stringify(records, null, 2), { encoding: "utf-8" });
    console.log("Arquivo Excel 'formatted_data.xlsx' gerado com sucesso!");
    console.log("Arquivo Json 'formatted_data.json' gerado com sucesso!");
}

createExcelFile()