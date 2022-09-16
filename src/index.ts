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

const paths = {
  public: path.join(process.cwd(), "public"),
  template: path.join(process.cwd(), "public", "template.xlsx"),
  data: path.join(process.cwd(), "public", "fake_data.xlsx"),
  output: path.join(process.cwd(), "output"),
};

function getWb(path: string) {
  const wb = new ExcelJS.Workbook();
  return wb.xlsx.load(fs.readFileSync(path));
}

async function main() {
  const templateWb = await getWb(paths.template),
    template = templateWb.getWorksheet(1),
    ziping = (await getWb(paths.data)).getWorksheet(1),
    shangjiping = (await getWb(paths.data)).getWorksheet(2),
    pingjiping = (await getWb(paths.data)).getWorksheet(3),
    zuoye = (await getWb(paths.data)).getWorksheet(4),
    jifen = (await getWb(paths.data)).getWorksheet(5),
    paiming = (await getWb(paths.data)).getWorksheet(6),
    peoples =
      ziping
        .getRows(2, ziping.actualRowCount - 1)
        ?.map((row, index) => ({
          name: row.getCell("A").value,
          index,
        }))
        .slice(0, 1) || [];

  // 组合每个人的信息
  function getPeopleData(p: typeof peoples[number]): People {
    const getPingjiaData = (ws: Worksheet) =>
      Object.values(ws.getRow(p.index + 2).values).splice(1);

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
        pingjunfen: zuoye.getRow(p.index + 2).getCell("E").value,
        pingjunfenpaiming: zuoye.getRow(p.index + 2).getCell("G").value,
        tijiaolv: zuoye.getRow(p.index + 2).getCell("I").value,
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
  for (const people of peoples) {
    const data = getPeopleData(people);
    // 致青春
    const titleCell = template.getRow(2).getCell("A");
    titleCell.value = titleCell.value
      ?.toString()
      .replace("致  ：", `致：${people.name}`);
    // 填充数据
    function fillPingjiaData(data: ExcelJS.CellValue[], templateRow: number) {
      const row = template.getRow(templateRow);
      data.forEach((item, index) => {
        row.getCell(3 + index).value = item;
      });
    }
    fillPingjiaData(data.pingjia.ziping, 11);
    fillPingjiaData(data.pingjia.shangjiping, 12);
    fillPingjiaData(data.pingjia.pingjiping, 13);
    // 写入文件
    await templateWb.xlsx.writeFile(
      path.join(paths.output, `${people.name}.xlsx`)
    );
  }
}

main();
