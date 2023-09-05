import fs from 'fs'; // 引入文件系统

import * as path from 'path';
import { g, r } from '../util/log-utils';

import { closeLoading, showLoading } from '../util/loading-utils';
import inquirer, { QuestionCollection } from 'inquirer';
import { NodeSSH } from 'node-ssh';

import { evnConfig } from '../config/evnConfig';

const choices = Object.keys(evnConfig);

// 交互提示
const questions: QuestionCollection = [
  {
    type: 'list',
    name: 'evnType',
    message: '版本回滚环境: ',
    choices: choices,
  },
];

const ssh = new NodeSSH();
//连接远端
const initSSH = (config: any) => {
  return new Promise((resolve) => {
    ssh
      .connect({
        host: config.host,
        username: config.username,
        password: config.password,
      })
      .then(() => {
        resolve('');
      });
  });
};

export const bulidBack = () => {
  inquirer.prompt(questions).then(({ evnType }) => {
    backVersion(evnType);
  });
};

const backVersion = async (pageType: string) => {
  showLoading('获取版本列表...');
  try {
    const configInfo = evnConfig[pageType];
    await initSSH(configInfo);
    //获取版本列表
    await downLoadHistory(configInfo);

    closeLoading();
    // g(`回滚操作成功!`);
  } catch (e: any) {
    closeLoading();
    r(`❌回滚操作失败，请检查!`);
  }
};

async function backHistory(history: any, config: any) {
  // 执行版本回滚操作
  // 更改index.html
  const indexPath = path.resolve(__dirname, '../../../dist/index.html');
  history.html = history.html.replace(/[\r\n]/g, '');
  history.html = history.html.replace('\\"', '"');

  fs.writeFile(indexPath, history.html, 'utf-8', function (err) {
    if (err != null) {
      r('历史版本写入index失败:' + err);
      process.exit(-1);
    } else {
      g('历史版本写入index成功');
      upload(config);
    }
  });
}
//上传文件
const upload = (config: any) => {
  showLoading('开始回滚...');
  const startTime = new Date().getTime();
  const distPath = path.resolve(__dirname, '../../../dist/index.html');
  ssh.putFile(distPath, `${config.path}/index.html`).then(
    function () {
      const endTime = new Date().getTime();
      const diff = (endTime - startTime) / 1000;
      g(`✅ 回滚成功，耗时${diff}秒！ \n`);
      closeLoading();
      process.exit(0);
    },
    function (error) {
      r(`❌回滚失败${error} \n`);
      closeLoading();
      process.exit(0);
    },
  );
};

//下载文件
const downLoadHistory = (config: any) => {
  console.log('下载中...');
  const distPath = `${config.path}/history.json`;
  const localPath = path.resolve(__dirname, '../../../dist/history.json');
  // console.log(distPath);
  ssh.getFile(localPath, distPath).then(
    function () {
      g(`✅ 下载历史记录已成功 \n`);
      readHistory(config);
    },
    function (error) {
      r(`❌文件下载失败请检查${error} \n`);
      process.exit(0);
    },
  );
};
//读取历史记录文件
const readHistory = (config: any) => {
  const localPath = path.resolve(__dirname, '../../../dist/history.json');
  const jsonObject = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
  const historyArray: any = [];
  jsonObject.list.forEach((element: any) => {
    historyArray.push({ name: element.id + ' ' + element.time, value: element });
  });

  const historyQuestions: QuestionCollection = [
    {
      type: 'rawlist',
      name: 'backInfo',
      message: '选择回滚的时间: ',
      choices: historyArray,
    },
  ];

  inquirer.prompt(historyQuestions).then((element) => {
    // g('回滚的提交信息');
    g(element.backInfo.buildInfo);
    backHistory(element.backInfo, config);
  });
};
