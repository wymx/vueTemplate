import { closeLoading, showLoading } from '../util/loading-utils';
import { g, r } from '../util/log-utils';
import inquirer, { QuestionCollection } from 'inquirer';
import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs'; // 引入文件系统
import child_process from 'child_process'; // 开启一个子进程
const exec = child_process.exec;

import { evnConfig } from '../config/evnConfig';
const choices = Object.keys(evnConfig);
// 交互提示
const questions: QuestionCollection = [
  {
    type: 'list',
    name: 'evnType',
    message: '选择上传环境: ',
    choices: choices,
  },
];

const upFiles = async (pageType: string) => {
  showLoading('开始上传中...');
  try {
    const configInfo = evnConfig[pageType];

    //检查环境配置是否正确
    await checkDev(pageType);
    //链接ssh
    await initSSH(configInfo);
    //创建历史记录
    await buildHistory('build', configInfo);
    //下载历史记录并添加新记录
    await downLoadHistory(configInfo);

    //删除文件夹
    if (pageType.indexOf('-clear') > -1) {
      await runRemoteCommand(`rm -rf ${configInfo.path}/*`, configInfo);
    }

    //上传文件
    await upload(configInfo);

    closeLoading();
    // g(`上传到 [${pageType}] 环境成功!`);
  } catch (e: any) {
    closeLoading();
    r(`❌上传到 [${pageType}] 环境失败，请检查!`);
    process.exit(-1);
  }
};

export const upFile = () => {
  inquirer.prompt(questions).then(({ evnType }) => {
    upFiles(evnType);
  });
};

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
//检查本地环境和上传环境是否统一
const checkDev = async (pageType: string) => {
  const _branch = (await execute('git branch')) + '';
  const infoPath = path.resolve(__dirname, '../../../.env');
  const files = fs.readFileSync(infoPath) + '';
  if (pageType.indexOf('fat') > -1 && files.indexOf('https://m.fat.aipu-waton.com/aipu-mall-bff') > -1) {
    if (_branch.indexOf('* fat-release') != -1) {
      g(`将上传到${pageType}----------`);
    } else {
      r('当前不是fat-release分支，不能发到fat环境中，请切换分支');
      process.exit(-1);
    }
  } else if (pageType == 'dev' && files.indexOf('https://m.fat.aipu-waton.com/aipu-mall-bff') > -1) {
    if (_branch.indexOf('* master') != -1) {
      g(`将上传到${pageType}=========`);
    } else {
      r('当前不是master分支，不能发到dev环境中，请切换分支');
      process.exit(-1);
    }
  } else if (pageType == 'pro' && files.indexOf('https://app-api.aipu-waton.com/aipu-mall-bff') > -1) {
    if (_branch.indexOf('* release') != -1) {
      g(`将上传到${pageType}++++++++++`);
    } else {
      r('当前不是release分支，不能发到pro环境中，请切换分支');
      process.exit(-1);
    }
  } else {
    r('检查环境出错，请检查配置文件');
    process.exit(-1);
  }
};
//执行远端命令
const runRemoteCommand = (cm: any, config: any) => {
  return new Promise((resolve, reject) => {
    ssh.execCommand(cm, { cwd: config.path }).then(function (result: any) {
      if (result.stderr) {
        reject(result.stderr);
      } else {
        resolve('');
      }
    });
  });
};
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
//上传文件夹
const upload = (config: any) => {
  showLoading('开始上传...');
  const startTime = new Date().getTime();
  const distPath = path.resolve(__dirname, '../../../dist');
  // console.log(distPath);
  ssh.putDirectory(distPath, config.path).then(
    function () {
      const endTime = new Date().getTime();
      const diff = (endTime - startTime) / 1000;
      g(`✅ 已成功发布到服务器，耗时${diff}秒！ \n`);
      closeLoading();
      process.exit(0);
    },
    function (error) {
      r(`❌发布失败请检查${error} \n`);
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
      buildHistory('merge', config);
    },
    function (error) {
      r(`❌文件下载失败请检查${error} \n`);
    },
  );
};

// 添加历史记录
const buildHistory = async (type: string, configInfo: any) => {
  console.log(configInfo);

  // 执行git log命令 查看当前分支提交历史
  const _history = await execute('git log -1');
  // 日志拼接
  const newStr = '打包日期：' + new Date().toLocaleString() + '\n' + _history;

  // 添加历史信息
  const historyPath = path.resolve(__dirname, '../../../dist/history.json');
  // 如果json文不存在就创建一个，初始值为 { list: [] }
  if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify({ list: [] }));
  }
  // 读取本次打包后的dist/index.html内容
  const html = fs.readFileSync(path.resolve(__dirname, '../../../dist/index.html'), 'utf-8');
  // 获取到当前histyory.json的内容
  const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
  // 将当前打包的信息push到history的list中，包含构建时间和index.html内容还有id
  // 实际应用中还可以添加其他的很多信息
  const userName = await execute('git config user.name');

  //当前打包文件名称数组
  const path1 = path.resolve(__dirname, '../../../dist/libs/');
  const libs = fs.readdirSync(path1);
  const path2 = path.resolve(__dirname, '../../../dist/static/css/');
  const staticCss = fs.readdirSync(path2);
  const path3 = path.resolve(__dirname, '../../../dist/static/js/');
  const staticJs = fs.readdirSync(path3);
  const path4 = path.resolve(__dirname, '../../../dist/static/png/');
  const staticPng = fs.readdirSync(path4);

  const nowBuildInfo = {
    //打包时间
    time: new Date().toLocaleString('zh-cn'),
    //页面信息
    html,
    // 模拟生成一个随机的id
    id: Math.random().toString(16).substr(2),
    // ... 分支信息，commit信息，构建时间，构建人，构建环境等字段
    buildInfo: newStr,
    // 打包人信息
    buildUser: userName,
    // 当前打包文件名称信息
    libs: libs,
    staticCss: staticCss,
    staticJs: staticJs,
    staticPng: staticPng,
  };
  history.list.push(nowBuildInfo);

  // 如果长度超过5，删除第一个（如果文件没有改变，编译后文件相同，不能删除）
  // if (history.list.length > 5) {
  //   // 1.删除FTP上的文件
  //   const oldInfo = history.list[0];
  //   oldInfo.libs.forEach(async (element: string) => {
  //     const filePath = `${configInfo.path}/libs/${element}`;
  //     console.log('删除libs：', filePath);
  //     await runRemoteCommand(`rm ${filePath}`, configInfo);
  //   });
  //   oldInfo.staticCss.forEach(async (element: string) => {
  //     const filePath = `${configInfo.path}/static/css/${element}`;
  //     console.log('删除staticCss：', filePath);
  //     await runRemoteCommand(`rm ${filePath}`, configInfo);
  //   });
  //   oldInfo.staticJs.forEach(async (element: string) => {
  //     const filePath = `${configInfo.path}/static/js/${element}`;
  //     console.log('删除staticJs：', filePath);
  //     await runRemoteCommand(`rm ${filePath}`, configInfo);
  //   });
  //   oldInfo.staticPng.forEach(async (element: string) => {
  //     const filePath = `${configInfo.path}/static/png/${element}`;
  //     console.log('删除staticPng：', filePath);
  //     await runRemoteCommand(`rm ${filePath}`, configInfo);
  //   });

  //   // 2.删除历史记录文件
  //   history.list.shift();
  // }

  // 将最新的构建记录内容写入到history.json中
  fs.writeFile(historyPath, JSON.stringify(history, null, 2), 'utf-8', function (err) {
    if (err != null) {
      if (type == 'build') {
        r('版本历史录入ERROR:' + err);
      } else if (type == 'merge') {
        r('版本历史合并ERROR:' + err);
      }
      process.exit(-1);
    } else {
      if (type == 'build') {
        g('版本历史录入成功');
      } else if (type == 'merge') {
        g('版本历史合并成功');
      }
    }
  });
};

// 递归读取文件
// const readdir = (p: any) => {
//   //读取当前目录下的文件
//   const files = fs.readdirSync(p);
//   console.log(files); //[ '01.html', 'a.txt', 'b.txt', 'c' ]
//   const fileArray: any = [];
//   //循环当前目录下的文件
//   files.forEach((file) => {
//     //如果是文件就直接打印，否则就读文件夹
//     const msg = fs.statSync(path.join(__dirname, p, file));
//     if (msg.isFile()) {
//       console.log(path.join(__dirname, p, file));
//       fileArray.push(file);
//     } else {
//       readdir(path.join(p, file));
//     }
//   });
//   return fileArray;
// };
