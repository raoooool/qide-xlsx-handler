import Excel from "exceljs";

export async function getFile() {
  const [fileHandle] = await window.showOpenFilePicker();
  return fileHandle.getFile();
}

export async function getExcel() {
  const file = await getFile();
  const wb = new Excel.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  return { wb, file };
}
