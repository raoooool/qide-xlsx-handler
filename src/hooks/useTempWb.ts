import { getExcel } from "@/utils";
import { useState } from "react";

export default function () {
  const [tempFile, setTempFile] = useState<File>();

  async function onTempFileChoose() {
    const { file } = await getExcel();
    setTempFile(file);
  }

  return {
    tempFile,
    onTempFileChoose,
  };
}
