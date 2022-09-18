import { useState } from "react";

function Box(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      className="border-dashed border-4 border-purple-200 rounded-lg w-1/3 bg-purple-100 flex justify-center items-center text-purple-900 text-lg cursor-pointer"
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [templateFilePath, setTemplateFilePath] = useState("");
  const [dataFilePath, setDataFilePath] = useState("");
  const [outputDirPath, setOutputDirPath] = useState("");

  const configs = {
    templateFile: {
      placeholder: "请选择模版文件",
      state: templateFilePath,
      onClick: async () => {
        const result = await window.xlsx_handler.getFileName();
        result && setTemplateFilePath(result);
      },
    },
    dataFile: {
      placeholder: "请选择数据文件",
      state: dataFilePath,
      onClick: async () => {
        const result = await window.xlsx_handler.getFileName();
        result && setDataFilePath(result);
      },
    },
    outputDir: {
      placeholder: "请选择输出目录",
      state: outputDirPath,
      onClick: async () => {
        const result = await window.xlsx_handler.getDirName();
        result && setOutputDirPath(result);
      },
    },
  };

  function reset() {
    setDataFilePath("");
    setTemplateFilePath("");
    setOutputDirPath("");
  }

  function start() {
    if (!templateFilePath || !dataFilePath || !outputDirPath) {
      return window.xlsx_handler.alert("三条好汉缺一不可！");
    }
    window.xlsx_handler
      .xlsxHandler(templateFilePath, dataFilePath, outputDirPath)
      .then((resp) => {
        window.xlsx_handler.alert(resp.message);
      })
      .catch((err) => {
        console.error(err);
        window.xlsx_handler.alert(err.message);
      });
  }

  return (
    <div className="bg-purple-50 h-screen p-6 font-mono flex flex-col">
      <div className="text-3xl font-bold text-purple-900">
        培训表格处理小能手
      </div>
      <div className="flex-1 flex mt-6 gap-6">
        {Object.values(configs).map((item) => {
          return (
            <Box key={item.placeholder} onClick={item.onClick}>
              <div className="break-all p-4">
                {item.state || item.placeholder}
              </div>
            </Box>
          );
        })}
      </div>
      <div className="flex gap-6 text-purple-50">
        <div
          onClick={reset}
          className="py-1 w-1/4 mt-6 rounded-lg bg-purple-900 text-center  cursor-pointer hover:bg-purple-800"
        >
          重新选
        </div>
        <div
          onClick={start}
          className="py-1 w-3/4 mt-6 rounded-lg bg-purple-900 text-center  cursor-pointer hover:bg-purple-800"
        >
          好了
        </div>
      </div>
    </div>
  );
}
