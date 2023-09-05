import { program } from 'commander';
import { createPage } from './command/create-page';
import { removePage } from './command/remove-page';
import { upFile } from './command/up-file';
import { buildLog } from './command/check-save';
import { bulidCheck } from './command/check-save';
import { bulidBack } from './command/build-back';
export const mainEntry = () => {
  console.log('hello cli mainEntry');

  program.command('create').description('创建新页面').alias('c').action(createPage);

  program.command('remove').description('删除新页面').alias('r').action(removePage);

  program.command('upFile').description('删除新页面').alias('u').action(upFile);

  program.command('buildLog').description('打包信息保存').alias('b').action(buildLog);

  program.command('bulidCheck').description('打包分支检查').alias('ce').action(bulidCheck);

  program.command('bulidBack').description('回滚历史版本').alias('bc').action(bulidBack);

  program.parse(process.argv);

  if (!program.args.length) {
    program.help();
  }
};
