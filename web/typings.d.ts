import "umi/typings";

declare global {
  interface Window {
    xlsx_handler: {
      isDev: boolean;
      getFileName: () => Promise<string>;
      getDirName: () => Promise<string>;
      xlsxHandler: (...args: string[]) => Promise<{
        message: string;
      }>;
      alert: (message: string) => void;
    };
  }
}
