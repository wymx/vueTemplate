import { PageInfo } from '../domain/page-info';
import { closeLoading, showLoading } from '../util/loading-utils';
import { g, r } from '../util/log-utils';
import { initPage } from '../service/init-page';

import inquirer, { QuestionCollection } from 'inquirer';
// 交互提示
const questions: QuestionCollection = [
  {
    name: 'pageName',
    message: 'Input the page name: ',
    default: '',
  },
  {
    type: 'list',
    name: 'pageType',
    message: 'Choose the page header: ',
    choices: ['header', 'noheader'],
  },
  {
    name: 'pageSubs',
    message: 'Input the pageSubs use,split: ',
    default: '',
  },
];

const createNewPage = async (pageName: string, pageType: string, pageSubs: string) => {
  showLoading('Generating, please wait...');
  try {
    // 1. 构造 ComponentInfo 对象
    const pageInfo = new PageInfo(pageName, pageType, pageSubs);
    // 2. 创建文件目录及文件
    await initPage(pageInfo);

    closeLoading();
    g(`page [${pageInfo.lowCamelName}] created done!`);
  } catch (e: any) {
    closeLoading();
    r(e.message);
  }
};

export const createPage = () => {
  inquirer.prompt(questions).then(({ pageName, pageType, pageSubs }) => {
    createNewPage(pageName, pageType, pageSubs);
  });
};
