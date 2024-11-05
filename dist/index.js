"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const XLSX = __importStar(require("xlsx"));
const csv_parse_1 = require("csv-parse");
const util_1 = require("./util");
function readCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const records = [];
        const fileContent = fs.createReadStream('./data.csv');
        const parser = fileContent.pipe((0, csv_parse_1.parse)({
            columns: true,
            delimiter: ',',
            skip_empty_lines: true
        }));
        try {
            for (var _d = true, parser_1 = __asyncValues(parser), parser_1_1; parser_1_1 = yield parser_1.next(), _a = parser_1_1.done, !_a; _d = true) {
                _c = parser_1_1.value;
                _d = false;
                const record = _c;
                records.push(record);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = parser_1.return)) yield _b.call(parser_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const formattedRecords = records.map(record => {
            record["CPF/CNPJ Validation"] = (0, util_1.validateCPForCNPJ)(record.nrCpfCnpj) ? "CPF/CNPJ Válido" : "CPF/CNPJ Inválido";
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
    });
}
function createExcelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield readCSV();
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(records);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados Formatados");
        XLSX.writeFile(workbook, "./formatted_data.xlsx");
        fs.writeFileSync("./formatted_data.json", JSON.stringify(records, null, 2), { encoding: "utf-8" });
        console.log("Arquivo Excel 'formatted_data.xlsx' gerado com sucesso!");
        console.log("Arquivo Json 'formatted_data.json' gerado com sucesso!");
    });
}
createExcelFile();
