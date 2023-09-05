import shelljs from 'shelljs';
import { closeLoading } from './loading-utils';
import child_process from 'child_process'; // 开启一个子进程

// shell命令
export const execCmd = (cmd: string) =>
  new Promise((resolve, reject) => {
    shelljs.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        closeLoading();
        reject(new Error(stderr));
      }
      return resolve('');
    });
  });

const exec = child_process.exec;
// 本地命令
export const execute = (command: any) => {
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
};
