import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();
//连接远端
export const initSSH = (config: any) => {
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
