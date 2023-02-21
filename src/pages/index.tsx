import RuleStore from "@/stores/RuleStore";
import Excel from "exceljs";
import { Button, message } from "tdesign-react";
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
    if (!tempFile || !dataFile || !dataRule || !dataWb) {
      message.error("请先选择数据和模板文件");
      return;
    }
    try {
      message.loading("生成中", 0);
      const peopleCount = Math.max(
        dataWb.getWorksheet(1).actualRowCount - Number(dataRule.startRow) + 1,
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
          const tempWs = wb.getWorksheet(1);
          const rowIndex = Number(dataRule.startRow) + index;
          const { startRow, ...dataRuleMap } = dataRule;
          // 对每个数据表处理
          Object.entries(dataRuleMap).forEach(([wsName, ruleKey]) => {
            const dataWs = dataWb.getWorksheet(wsName);
            if (!dataWs) throw new Error("Invalid Data Worksheet.");
            const ruleArr =
              rules.find((item) => item.id === ruleKey)?.rules || [];
            // 对每个映射处理
            ruleArr.forEach(([col, cell, special]) => {
              let preCellData = dataWs.getRow(rowIndex).getCell(col)
                  .value as any,
                postCell = tempWs.getCell(cell);
              // 当数据单元格的值为公式生成或拖动批量生成时，特殊处理
              preCellData = preCellData?.sharedFormula
                ? preCellData.result || ""
                : preCellData;
              // 映射数据到模板文件
              postCell.value = special
                ? template(special)({
                    pre: preCellData,
                    post: postCell.value,
                  })
                : preCellData;
            });
          });
          // 处理行高问题
          tempWs.getRows(1, tempWs.rowCount)?.forEach((row) => {
            row.height = row.height || tempWs.properties.defaultRowHeight;
          });
          // 获取人名
          const name =
            dataWb.getWorksheet(1).getRow(rowIndex).getCell("A").toString() ||
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
    } catch (error) {
      console.error(error);
      message.closeAll();
      message.error("生成失败，如果是意料之外的，请联系管理员");
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 w-80">
      <Button
        ghost
        block
        shape="round"
        size="large"
        onClick={onDataFileChoose}
        className="truncate"
        title={dataFile ? dataFile.name : undefined}
      >
        {dataFile ? `已选择 ${dataFile.name}` : "选择数据文件"}
      </Button>
      <Button
        ghost
        block
        shape="round"
        size="large"
        onClick={onTempFileChoose}
        className="truncate"
        title={tempFile ? tempFile.name : undefined}
      >
        {tempFile ? `已选择 ${tempFile.name}` : "选择模板文件"}
      </Button>
      <Button block shape="round" size="large" onClick={onStart}>
        生成映射表格
      </Button>
    </div>
  );
}
