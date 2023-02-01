import React, { useState } from "react";
import { LinkOutlined } from "@ant-design/icons";
import { message, UploadProps } from "antd";
import { Button, Upload } from "antd";
import ReactJSON from "react-json-view";
import { parseToDOM, textHandle, copy } from "./utils";

const App: React.FC = () => {
  const [json, setJson] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".html",
    action: "",
    // 阻止上传组件默认上传
    beforeUpload: () => false,
    showUploadList: false,
    onChange(info) {
      setLoading(false);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      const reader = new FileReader();
      reader.readAsText(info.file as any);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const doms = parseToDOM(reader.result);
          for (const dom of doms) {
            // 从 dom 对象中获取 DL 标签
            if (dom.nodeName === "DL") {
              const result = textHandle(dom, null);
              setJson(result);
              setLoading(true);
              copy(JSON.stringify(result), () => {
                message.success('解析成功，数据已复制！')
              })
            }
          }
        }
      };
    },
  };
  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<LinkOutlined />}>解析书签数据</Button>
      </Upload>
      {loading && <ReactJSON src={json}></ReactJSON>}
    </div>
  );
};

export default App;
