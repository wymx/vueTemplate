import fs from 'fs'; // 引入文件系统
import child_process from 'child_process'; // 开启一个子进程
import * as path from 'path';
import { g, r } from '../util/log-utils';
const exec = child_process.exec;
// 封装命令
function execute(command: any) {
  return new Promise((resolve, reject) => {
    console.log(resolve, reject);
    exec(command, function (err, stdout, stderr) {
      console.log(err, stdout, stderr);
      if (err != null) {
        resolve(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function saveLog() {
  // 执行git log命令 查看当前分支提交历史
  const _history = await execute('git log -1');
  // 日志拼接
  const newStr = '打包日期：' + new Date().toLocaleString() + '\n' + _history;
  // 将日志写入log.txt
  const distPath = path.resolve(__dirname, '../../../dist/log.txt');
  fs.writeFile(distPath, newStr, 'utf-8', function (err) {
    if (err != null) {
      r('打包信息录入ERROR:' + err);
      process.exit(-1);
    } else {
      g('打包信息录入成功');
    }
  });

  // 添加健康检查页
  const infoPath = path.resolve(__dirname, '../../../dist/info.html');
  fs.writeFile(infoPath, 'ok', 'utf-8', function (err) {
    if (err != null) {
      r('健康检查页录入ERROR:' + err);
      process.exit(-1);
    } else {
      g('健康检查页录入成功');
    }
  });
}

async function ckeck() {
  // const _branch = (await execute('git branch')) + '';
  // if (_branch.indexOf('* fat-release') != -1 || _branch.indexOf('* release') != -1) {
  //   process.exit(0);
  // } else {
  //   r('当前不是fat-release，或release分支，请切换分支进行发包');
  //   process.exit(-1);
  // }
}
export const buildLog = () => {
  saveLog();
};

export const bulidCheck = () => {
  ckeck();
};
