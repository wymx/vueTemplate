import * as path from 'path';
import { convertToUpCamelName, convertToLowCamelName } from '../util/name-utils';

export class PageInfo {
  /** 首字母大写写的驼峰名 如：NavBar */
  upCamelName: string;
  /** 首字母小写的驼峰名 如：navBar */
  lowCamelName: string;
  /** 组件类型 如：tsx */
  type: 'noheader' | 'header';

  /** page 目录所在的路径 */
  pagePath: string;
  /** page 所在的路径 */
  fullPagePath: string;

  /** api/model 目录所在的路径 */
  apiPath: string;
  /** api/model 所在的路径 */
  fullApiPath: string;

  /** router 目录所在的路径 */
  routerPath: string;
  /** router 所在的路径 */
  fullRouterPath: string;

  subArray: Array<string>;

  constructor(componentName: string, componentType: string, pageSubs: string) {
    this.subArray = pageSubs.split(',').filter(function (s) {
      return s && s.trim();
    });

    this.upCamelName = convertToUpCamelName(componentName);

    this.lowCamelName = convertToLowCamelName(componentName);
    this.type = componentType === 'noheader' ? 'noheader' : 'header';

    this.pagePath = path.resolve(__dirname, '../../../src/pages');
    this.fullPagePath = path.resolve(this.pagePath, this.lowCamelName);

    this.apiPath = path.resolve(__dirname, '../../../src/apis');
    this.fullApiPath = path.resolve(this.apiPath, this.lowCamelName);

    this.routerPath = path.resolve(__dirname, '../../../src/router');
    this.fullRouterPath = path.resolve(this.routerPath, this.lowCamelName);
  }
}
