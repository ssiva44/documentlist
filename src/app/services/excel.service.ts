import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService { 

    public exportAsExcelFile(json: any[], links: any[], excelFileName: string, sheetName: any): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

        for (let i = 0; i < links.length; i++) {            
            worksheet['A' + (2 + i)].l = { Target: links[i] };
            worksheet['A' + (2 + i)].s = { color: "blue" };
        }        
        
        const workbook: XLSX.WorkBook = { Sheets: { [sheetName]: worksheet }, SheetNames: [sheetName] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer', bookSST: true, cellStyles: true });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

}