import Excel from "exceljs";
import { useMemo, useState } from "react";
import { Button } from "tdesign-react";

export default function () {
  const [templateWs, setTemplateWs] = useState<Excel.Worksheet>();

  async function onTemplateBtnClick() {
    const [fileHandle] = await window.showOpenFilePicker();
    const fileData = await fileHandle.getFile();
    const wb = new Excel.Workbook();
    await wb.xlsx.load(await fileData.arrayBuffer());
    setTemplateWs(wb.worksheets[0]);
  }

  // const templateData = useMemo(
  //   () => templateWs?.getSheetValues() || [],
  //   [templateWs]
  // );

  return (
    <div>
      <div></div>
      <div>
        <Button>test</Button>
        {/* <Button onClick={onTemplateBtnClick}>选择模板文件</Button> */}
      </div>
    </div>
  );
}
