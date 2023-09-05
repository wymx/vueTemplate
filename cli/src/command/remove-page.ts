import { RemoveInfo } from '../domain/remove-info';
import { closeLoading, showLoading } from '../util/loading-utils';
import { g, r } from '../util/log-utils';
import fs from 'fs';
import path from 'path';

import inquirer, { QuestionCollection } from 'inquirer';
// 交互提示
const questions: QuestionCollection = [
  {
    name: 'pageName',
    message: 'Input the page name: ',
    default: '',
  },
];

const removeOnePage = async (pageName: string) => {
  showLoading('Remove, please wait...');
  try {
    // 1. 构造 ComponentInfo 对象
    const removeInfo = new RemoveInfo(pageName);
    // 2. 修改router文件
    changeFile(removeInfo);
    // 3. 删除目录
    removeDir(removeInfo);

    closeLoading();
    g(`page [${removeInfo.lowCamelName}] remove done!`);
  } catch (e: any) {
    closeLoading();
    r(e.message);
  }
};

export const removePage = () => {
  inquirer.prompt(questions).then(({ pageName }) => {
    removeOnePage(pageName);
  });
};

const changeFile = (removeInfo: RemoveInfo) => {
  // 更改根router
  const { routerPath } = removeInfo;
  const routeTsPath = `${routerPath}/routes.ts`;
  if (fs.existsSync(routeTsPath)) {
    const content = fs.readFileSync(routeTsPath).toString();

    const routeString = `${removeInfo.lowCamelName}Routes,`;
    // const stringLength = routeString.length;
    // const index = content.indexOf(routeString);
    // let result = content.substring(0, index - 1) + content.substring(index + stringLength);

    const importString = `import ${removeInfo.lowCamelName}Routes from './${removeInfo.lowCamelName}/${removeInfo.lowCamelName}';`;
    // const ipStringLength = importString.length;
    // const ipIndex = result.indexOf(importString);
    // result = result.substring(0, ipIndex - 1) + result.substring(index + ipStringLength);

    let result = content.replace(routeString, '');
    result = result.replace(importString, '');

    fs.writeFileSync(routeTsPath, result);
  }
};
const removeDir = (removeInfo: RemoveInfo) => {
  // 1.删除apis下目录
  removeDirPath(removeInfo.fullApiPath);
  // 2.删除pages下目录
  removeDirPath(removeInfo.fullPagePath);
  // 3.删除router下目录
  removeDirPath(removeInfo.fullRouterPath);
};

const removeDirPath = (p: string) => {
  const statObj = fs.statSync(p); // fs.statSync同步读取文件状态，判断是文件目录还是文件。
  if (statObj.isDirectory()) {
    //如果是目录
    let dirs = fs.readdirSync(p); //fs.readdirSync()同步的读取目标下的文件 返回一个不包括 '.' 和 '..' 的文件名的数组['b','a']
    dirs = dirs.map((dir) => path.join(p, dir)); //拼上完整的路径
    for (let i = 0; i < dirs.length; i++) {
      // 深度 先将儿子移除掉 再删除掉自己
      removeDirPath(dirs[i]);
    }
    fs.rmdirSync(p); //删除目录
  } else {
    fs.unlinkSync(p); //删除文件
  }
};
