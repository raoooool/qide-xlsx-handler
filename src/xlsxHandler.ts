import ExcelJS, { Worksheet } from "exceljs";
import fs from "fs-extra";
import path from "path";

interface People {
  pingjia: {
    ziping: ExcelJS.CellValue[];
    shangjiping: ExcelJS.CellValue[];
    pingjiping: ExcelJS.CellValue[];
  };
  chuqin: {
    chuqinlv: ExcelJS.CellValue;
  };
  zuoye: {
    tijiaolv: ExcelJS.CellValue;
    pingjunfen: ExcelJS.CellValue;
    pingjunfenpaiming: ExcelJS.CellValue;
  };
  jifen: {
    scores: ExcelJS.CellValue[];
    paiming: ExcelJS.CellValue[];
  };
}

export default async function (
  templatePath = "",
  dataFilePath = "",
  outputPath = ""
) {
  function getWb(path: string) {
    const wb = new ExcelJS.Workbook();
    return wb.xlsx.load(fs.readFileSync(path));
  }
  function getPaths() {
    return {
      template:
        templatePath || path.join(__dirname, "..", "public", "template.xlsx"),
      data:
        dataFilePath || path.join(__dirname, "..", "public", "fake_data.xlsx"),
      output: outputPath || path.join(__dirname, "..", "output"),
    };
  }
  const paths = getPaths(),
    templateWb = await getWb(paths.template),
    template = templateWb.getWorksheet(1),
    ziping = (await getWb(paths.data)).getWorksheet(1),
    shangjiping = (await getWb(paths.data)).getWorksheet(2),
    pingjiping = (await getWb(paths.data)).getWorksheet(3),
    zuoye = (await getWb(paths.data)).getWorksheet(4),
    jifen = (await getWb(paths.data)).getWorksheet(5),
    paiming = (await getWb(paths.data)).getWorksheet(6),
    peoples =
      ziping.getRows(2, ziping.actualRowCount - 1)?.map((row, index) => ({
        name: row.getCell("A").value,
        index,
      })) || [];

  // 组合每个人的信息
  function getPeopleData(p: typeof peoples[number]): People {
    const getPingjiaData = (ws: Worksheet) =>
      Object.values(ws.getRow(p.index + 2).values).slice(1);

    return {
      pingjia: {
        ziping: getPingjiaData(ziping),
        shangjiping: getPingjiaData(shangjiping),
        pingjiping: getPingjiaData(pingjiping),
      },
      chuqin: {
        chuqinlv: zuoye.getRow(p.index + 2).getCell("C").value,
      },
      zuoye: {
        pingjunfen: zuoye.getRow(p.index + 2).getCell("G").value,
        pingjunfenpaiming: zuoye.getRow(p.index + 2).getCell("I").value,
        tijiaolv: zuoye.getRow(p.index + 2).getCell("E").value,
      },
      jifen: {
        scores: Object.values(jifen.getRow(p.index + 2).values).filter(
          (_, index) => [2, 4, 6, 8, 10].includes(index)
        ),
        paiming: Object.values(paiming.getRow(p.index + 2).values).filter(
          (_, index) => [2, 4, 6, 8, 10].includes(index)
        ),
      },
    };
  }

  // 每个人生成一个文件
  fs.ensureDirSync(paths.output);
  for (const people of peoples) {
    const data = getPeopleData(people);
    // 致青春
    const titleCell = template.getCell("A2");
    titleCell.value = titleCell.value
      ?.toString()
      .replace(/致.*：/, `致${people.name}：`);
    // 填充数据
    function fillPingjiaData(data: ExcelJS.CellValue[], templateRow: number) {
      data.forEach((item, index) => {
        const cell = template.getRow(templateRow).getCell(3 + index);
        cell.value = item;
        cell.style.alignment!.horizontal = "center";
      });
    }
    fillPingjiaData(data.pingjia.ziping, 11);
    fillPingjiaData(data.pingjia.shangjiping, 12);
    fillPingjiaData(data.pingjia.pingjiping, 13);
    template.getCell("C39").value = data.chuqin.chuqinlv;
    template.getCell("E39").value = data.zuoye.tijiaolv;
    template.getCell("E40").value = data.zuoye.pingjunfen;
    template.getCell("E41").value = data.zuoye.pingjunfenpaiming;
    function fillJifenData(data: ExcelJS.CellValue[], templateRow: number) {
      data.forEach((item, index) => {
        template.getRow(templateRow).getCell(7 + index * 2).value = item;
      });
    }
    fillJifenData(data.jifen.scores, 39);
    fillJifenData(data.jifen.paiming, 41);
    // 写入文件
    await templateWb.xlsx.writeFile(
      path.join(paths.output, `${people.name}.xlsx`)
    );
  }
  return { message: "生成文件成功" };
}
