import RuleStore from "@/stores/RuleStore";
import Excel from "exceljs";
import { Button, message, Space } from "tdesign-react";
import { BlobWriter, ZipWriter, BlobReader } from "@zip.js/zip.js";
import { v4 } from "uuid";
import useDataWb from "@/pages/hooks/useDataWb";
import useTempWb from "@/pages/hooks/useTempWb";
import { template } from "lodash-es";

export default function () {
  const { onDataFileChoose, dataWb, dataFile, dataRule } = useDataWb();
  const { onTempFileChoose, tempFile } = useTempWb();
  const { rules } = RuleStore.useContainer();

  async function onStart() {
    if (!tempFile || !dataFile || !dataRule) {
      message.error("不要调皮");
      return;
    }
    message.loading("生成中", 0);
    const peopleCount = Math.max(
      (dataWb?.worksheets[0].rowCount || 0) - Number(dataRule.startRow) + 1,
      0
    );

    const zipFileWriter = new BlobWriter();
    const zipWriter = new ZipWriter(zipFileWriter);

    // 对人数处理
    const promises = Array(peopleCount)
      .fill(null)
      .map(async (_, index) => {
        const wb = new Excel.Workbook();
        await wb.xlsx.load(await tempFile.arrayBuffer());
        const tempWs = wb.worksheets[0];
        const rowIndex = Number(dataRule.startRow) + index;
        const { startRow, ...dataRuleMap } = dataRule;
        // 对每个数据表处理
        Object.entries(dataRuleMap).forEach(([wsName, ruleKey]) => {
          const dataWs = dataWb?.getWorksheet(wsName);
          const ruleArr =
            rules.find((item) => item.id === ruleKey)?.rules || [];
          // 对每个映射处理
          ruleArr.forEach(([col, cell, special]) => {
            const preCellData = dataWs?.getRow(rowIndex).getCell(col).value;
            const postCellData = tempWs.getCell(cell).value;
            tempWs.getCell(cell).value = special
              ? template(special)({ pre: preCellData, post: postCellData })
              : preCellData;
          });
        });
        // 获取人名
        const name =
          dataWb?.worksheets[0].getRow(rowIndex).getCell("A").toString() ||
          v4();
        const buffer = await wb.xlsx.writeBuffer();
        zipWriter.add(name + ".xlsx", new BlobReader(new Blob([buffer])));
      });

    await Promise.all(promises);
    const blob = await zipWriter.close();
    const saveHandle = await window.showSaveFilePicker({
      suggestedName: "data.zip",
    });
    const writableStream = await saveHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
    message.closeAll();
    message.success("生成成功");
  }

  return (
    <div>
      <Space direction="vertical">
        <Button onClick={onDataFileChoose}>
          {dataFile ? `已选择 ${dataFile.name}` : "选择数据文件"}
        </Button>
        <Button onClick={onTempFileChoose}>
          {tempFile ? `已选择 ${tempFile.name}` : "选择模板文件"}
        </Button>
        <Button onClick={onStart}>开始生成</Button>
      </Space>
    </div>
  );
}
