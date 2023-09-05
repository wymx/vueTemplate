import { PageInfo } from '../domain/page-info';
import fs from 'fs';
// import * as path from 'path';
import {
  indexTemplate,
  indexNHTemplate,
  pageTemplate,
  apiTemplate,
  modelTemplate,
  routerTemplate,
} from '../util/template-utils';
import { g } from '../util/log-utils';
import { execCmd } from '../util/cmd-utils';

/**
 * 创建page文件,api/model文件,router文件
 */
export const initPage = (pageInfo: PageInfo) =>
  new Promise((resolve, reject) => {
    if (fs.existsSync(pageInfo.fullPagePath)) {
      return reject(new Error('page已存在'));
    }
    if (fs.existsSync(pageInfo.fullApiPath)) {
      return reject(new Error('model已存在'));
    }
    if (fs.existsSync(pageInfo.fullRouterPath)) {
      return reject(new Error('router已存在'));
    }

    // 1. 创建组件根目录
    fs.mkdirSync(pageInfo.fullPagePath);
    fs.mkdirSync(pageInfo.fullApiPath);
    fs.mkdirSync(pageInfo.fullRouterPath);

    // 2. 初始化 package.json
    execCmd(`cd ${pageInfo.fullPagePath}`)
      .then((r) => {
        console.log(r);

        // 3. 创建 pages
        createSrcIndex(pageInfo);

        // 4. 创建 api/model
        createModel(pageInfo);

        // 5. 创建 router
        createRouter(pageInfo);

        g('component init success');

        return resolve(pageInfo);
      })
      .catch((e) => {
        return reject(e);
      });
  });

const createSrcIndex = (pageInfo: PageInfo) => {
  let content = '';
  if (pageInfo.type === 'noheader') {
    content = indexNHTemplate();
  } else {
    content = indexTemplate();
  }
  const fileFullName = `${pageInfo.fullPagePath}/index.vue`;
  fs.writeFileSync(fileFullName, content);

  fs.mkdirSync(`${pageInfo.fullPagePath}/${pageInfo.lowCamelName}/`);
  const fileName = `${pageInfo.fullPagePath}/${pageInfo.lowCamelName}/` + `${pageInfo.lowCamelName}.vue`;
  const templateInfos = pageTemplate(pageInfo.lowCamelName);
  fs.writeFileSync(fileName, templateInfos);

  for (let i = 0; i < pageInfo.subArray.length; i++) {
    const item = pageInfo.subArray[i];
    const fileName = `${pageInfo.fullPagePath}/${item}/${item}.vue`;
    const templateInfo = pageTemplate(item);
    const itemPath = `${pageInfo.fullPagePath}/${item}`;
    fs.mkdirSync(itemPath);
    fs.writeFileSync(fileName, templateInfo);
  }
};

const createModel = (pageInfo: PageInfo) => {
  const fileName = `${pageInfo.fullApiPath}/${pageInfo.lowCamelName}.ts`;
  const templateInfo = apiTemplate(pageInfo.lowCamelName, pageInfo.upCamelName);
  fs.writeFileSync(fileName, templateInfo);

  const fileNames = `${pageInfo.fullApiPath}/` + `${pageInfo.lowCamelName}Model.ts`;
  const templateInfos = modelTemplate(pageInfo.lowCamelName);
  fs.writeFileSync(fileNames, templateInfos);

  // 接口引入
  const { apiPath } = pageInfo;
  const apiTsPath = `${apiPath}/index.ts`;
  if (fs.existsSync(apiTsPath)) {
    const content = fs.readFileSync(apiTsPath).toString();
    const result = content + `export * from './${pageInfo.lowCamelName}/${pageInfo.lowCamelName}';`;
    fs.writeFileSync(apiTsPath, result);
  }
};
const createRouter = (pageInfo: PageInfo) => {
  const fileName = `${pageInfo.fullRouterPath}/${pageInfo.lowCamelName}.ts`;
  const templateInfo = routerTemplate(pageInfo.lowCamelName, pageInfo.subArray);
  fs.writeFileSync(fileName, templateInfo);

  // 更改根router
  const { routerPath } = pageInfo;
  const routeTsPath = `${routerPath}/routes.ts`;
  if (fs.existsSync(routeTsPath)) {
    const content = fs.readFileSync(routeTsPath).toString();
    const index = content.indexOf(`]; //end`);
    let result = content.substring(0, index - 1) + `\n${pageInfo.lowCamelName}Routes,\n` + content.substring(index);
    result =
      `import ${pageInfo.lowCamelName}Routes from './${pageInfo.lowCamelName}/${pageInfo.lowCamelName}';\n` + result;
    fs.writeFileSync(routeTsPath, result);
  }
};
