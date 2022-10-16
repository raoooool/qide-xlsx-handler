import Excel from "exceljs";

export async function getExcel() {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const wb = new Excel.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  return { wb, file };
}
