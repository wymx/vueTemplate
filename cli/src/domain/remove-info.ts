import * as path from 'path';
import { convertToLowCamelName } from '../util/name-utils';

export class RemoveInfo {
  /** 首字母小写的驼峰名 如：navBar */
  lowCamelName: string;
  /** 组件类型 如：tsx */

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

  constructor(pageName: string) {
    this.lowCamelName = convertToLowCamelName(pageName);

    this.pagePath = path.resolve(__dirname, '../../../src/pages');
    this.fullPagePath = path.resolve(this.pagePath, this.lowCamelName);

    this.apiPath = path.resolve(__dirname, '../../../src/apis');
    this.fullApiPath = path.resolve(this.apiPath, this.lowCamelName);

    this.routerPath = path.resolve(__dirname, '../../../src/router');
    this.fullRouterPath = path.resolve(this.routerPath, this.lowCamelName);
  }
}
