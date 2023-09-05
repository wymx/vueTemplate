/**
 * 验证手机号是否合格
 * true--说明合格
 */
export function isPhone(phoneStr: number): boolean {
  const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(String(phoneStr))) {
    return false;
  } else {
    return true;
  }
}

export function isPassword(passwordStr: any): boolean {
  const myreg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
  if (!myreg.test(String(passwordStr))) {
    return false;
  } else {
    return true;
  }
}

export function isAllNumber(password: any) {
  // 使用正则表达式匹配密码是否全为数字
  const regex = /^[0-9]+$/;
  // 判断密码是否全为数字
  if (regex.test(password)) {
    return false; // 密码全为数字，校验失败
  } else {
    return true; // 密码不全为数字，校验通过
  }
}

/**
 * 验证身份证号是否合格
 * true--说明合格
 */
export function isIdCard(idCardStr: number): boolean {
  const idcardReg =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  if (idcardReg.test(String(idCardStr))) {
    return true;
  } else {
    return false;
  }
}

/**
 * 验证车牌号是否合格
 * true--说明合格
 */
export function isVehicleNumber(vehicleNumber: string) {
  const xreg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  const creg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
  if (vehicleNumber.length == 7) {
    return creg.test(vehicleNumber);
  } else if (vehicleNumber.length == 8) {
    return xreg.test(vehicleNumber);
  } else {
    return false;
  }
}

/**
 * 验证字符串是否为空（也不能为纯空格）
 * true--说明为空， false--说明不为空
 */
export function isEmptyString(string: any): boolean {
  if (
    string == undefined ||
    typeof string == 'undefined' ||
    !string ||
    string == null ||
    string == '' ||
    /^\s+$/gi.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
/**
 * 验证邮箱
 * 非下划线的单词字符 + 2个以上单词字符 + @ + 2位以上单词字符域名 + .2位以上小写字母做域名后缀 + (.2位以上二重域名后缀)?
 * /^(用户名)@(组织名)\.(一级域名后缀)(二级域名后缀)?$/
 * true--说明为空， false--说明不为空
 */
export function isEmail(string: any): boolean {
  const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
  if (reg.test(string)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 验证姓名
 * 中文
 * true--说明为空， false--说明不为空
 */
export function isCnText(string: any): boolean {
  const reg = /^[\u4e00-\u9fa5]+$/;
  if (reg.test(string)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 生日转为年龄（精确到月份）
 */
export function birsdayToAge(birsday: any) {
  const aDate = new Date();
  const thisYear = aDate.getFullYear();
  const bDate = new Date(birsday);
  const brith = bDate.getFullYear();
  let age = thisYear - brith;
  if (aDate.getMonth() == bDate.getMonth()) {
    if (aDate.getDate() < bDate.getDate()) {
      age = age - 1;
    }
  } else {
    if (aDate.getMonth() < bDate.getMonth()) {
      age = age - 1;
    }
  }
  return age;
}

/**
 * 判断数据类型
 * @param {any} val - 基本类型数据或者引用类型数据
 * @return {string} - 可能返回的结果有，均为小写字符串
 * number、boolean、string、null、undefined、array、object、function等
 */
export function getType(val: any): string {
  //判断数据是 null 和 undefined 的情况
  if (val == null) {
    return val + '';
  }
  return typeof val === 'object' ? Object.prototype.toString.call(val).slice(8, -1).toLowerCase() : typeof val;
}

/*
 * 验证是否为数字
 */
export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 * 是否为数组
 */
export function isArray(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * 是否空数组
 */
export function isArrayEmpty(val: any) {
  if (val && val instanceof Array && val.length > 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * 获取url参数字符串
 * 没有返回null
 */
export function getQueryString(name: any) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

/**
 * 去除参数空数据（用于向后台传递参数的时候）
 * @param {Object} obj [参数对象]
 */
export function filterEmptyData(obj: any) {
  for (const prop in obj) {
    obj[prop] === '' ? delete obj[prop] : obj[prop];
  }
  return obj;
}
/**
 * 数字四舍五入（保留n位小数）
 */
export function round(number: number, n: any): number {
  n = n ? parseInt(n) : 0;
  if (n <= 0) return Math.round(number);
  number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n);
  return number;
}

/**
 *数字金额转文字  函数
 *
 * @export
 * @param {*} money
 * @returns
 */
export function convertCurrency(money: any) {
  //汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  //基本单位
  const cnIntRadice = ['', '拾', '佰', '仟'];
  //对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆'];
  //对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘'];
  //整数金额时后面跟的字符
  const cnInteger = '整';
  //整型完以后的单位
  const cnIntLast = '元';
  //最大处理的数字
  const maxNum = 999999999999999.9;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = '';
  //分离金额后用的数组，预定义
  let parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    const decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

/**
 *时间增加或减少几天
 * date  当前日期 例： 2020-06-10
 * days  增加的天数 例： 30
 * return 增加后的天数
 */
export function addDate(date: any, days: any) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  let month: any = d.getMonth() + 1;
  let day: any = d.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  const val = d.getFullYear() + '-' + month + '-' + day;
  return val;
}

/*-
 *数字每千位加逗号
 *
 */
export function commafy(num: number) {
  return (
    num &&
    num.toString().replace(/\d+/, function (s) {
      return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    })
  );
}

/**
 *数字补位
 * numberPad用于按照位数补0,默认为2
 */
export function numberPad(source: any, length = 2) {
  let pre = '';
  const negative = source < 0;
  const string = String(Math.abs(source));
  if (string.length < length) {
    pre = new Array(length - string.length + 1).join('0');
  }
  return (negative ? '-' : '') + pre + string;
}

/**
 *随机数
 *
 */
export function numberRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/*
 *手机号码中间4位隐藏花号（*）显示
 *
 */
export function hideMobile(mobile: any) {
  return mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}

/**
 * 去除字符串空格
 * @param str 要处理的字符串
 * @param type 1：所有空格 2：前后空格 3：前空格 4：后空格
 */
export function strTrim(str: string, type: number): string {
  switch (type) {
    case 1:
      return str.replace(/\s+/g, '');
    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, '');
    case 3:
      return str.replace(/(^\s*)/g, '');
    case 4:
      return str.replace(/(\s*$)/g, '');
    default:
      return str;
  }
}

/**
 * 字母大小写切换
 * @param str 要处理的字符串
 * @param type 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
 */
export function strChangeCase(str: string, type: number): string {
  function ToggleCase(str: string): string {
    let itemText = '';
    str.split('').forEach(function (item) {
      if (/^([a-z]+)/.test(item)) {
        itemText += item.toUpperCase();
      } else if (/^([A-Z]+)/.test(item)) {
        itemText += item.toLowerCase();
      } else {
        itemText += item;
      }
    });
    return itemText;
  }

  switch (type) {
    case 1:
      return str.replace(/^(\w)(\w+)/, function (v1, v2) {
        return v1.toUpperCase() + v2.toLowerCase();
      });
    case 2:
      return str.replace(/^(\w)(\w+)/, function (v1, v2) {
        return v1.toLowerCase() + v2.toUpperCase();
      });
    case 3:
      return ToggleCase(str);
    case 4:
      return str.toUpperCase();
    case 5:
      return str.toLowerCase();
    default:
      return str;
  }
}

/**
 * 检测密码强度
 * @param str 字符串
 * @returns 1：密码弱 2：密码中等 3：密码强 4：密码很强
 */
export function checkPwd(str: string): number {
  let nowLv = 0;
  if (str.length < 6) {
    return nowLv;
  }
  if (/[0-9]/.test(str)) {
    nowLv++;
  }
  if (/[a-z]/.test(str)) {
    nowLv++;
  }
  if (/[A-Z]/.test(str)) {
    nowLv++;
  }
  return nowLv;
}

/**
 * 简单数组排序，针对数字数组
 * @param type 1：降序，0：升序
 */
export function sortArr(arr: [], type: number) {
  if (type == 1) {
    //降序
    arr.sort(function (a, b) {
      return b - a;
    });
  } else {
    arr.sort(function (a, b) {
      return a - b;
    });
  }
  return arr;
}

/**
 * 时间日期转换
 * @param date 当前时间，new Date() 格式
 * @param format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns 返回拼接后的时间字符串
 */
export function formatDate(date: Date, format: string): string {
  const we = date.getDay(); // 星期
  const z = getWeek(date); // 周
  const qut = Math.floor((date.getMonth() + 3) / 3).toString(); // 季度
  const opt: { [key: string]: string } = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月(月份从0开始，要+1)
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    'q+': qut, // 季度
  };
  // 中文数字 (星期)
  const week: { [key: string]: string } = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
  };
  // 中文数字（季度）
  const quarter: { [key: string]: string } = {
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
  };
  if (/(W+)/.test(format))
    format = format.replace(
      RegExp.$1,
      RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' + week[we] : '周' + week[we]) : week[we],
    );
  if (/(Q+)/.test(format))
    format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? '第' + quarter[qut] + '季度' : quarter[qut]);
  if (/(Z+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 3 ? '第' + z + '周' : z + '');
  for (const k in opt) {
    const r = new RegExp('(' + k + ')').exec(format);
    // 若输入的长度不为1，则前面补零
    if (r) format = format.replace(r[1], RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'));
  }
  return format;
}

/**
 * 获取当前日期是第几周
 * @param dateTime 当前传入的日期值
 * @returns 返回第几周数字值
 */
export function getWeek(dateTime: Date): number {
  const temptTime = new Date(dateTime.getTime());
  // 周几
  const weekday = temptTime.getDay() || 7;
  // 周1+5天=周六
  temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);
  let firstDay = new Date(temptTime.getFullYear(), 0, 1);
  const dayOfWeek = firstDay.getDay();
  let spendDay = 1;
  if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1;
  firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay);
  const d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
  return Math.ceil(d / 7);
}

/**
 * 获取当前日期
 * @returns 返回XX月xx日 XX：xx  格式
 */
export function ChineseNowTime() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
 * @param param 当前时间，new Date() 格式或者字符串时间格式
 * @param format 需要转换的时间格式字符串
 * @description param 10秒：  10 * 1000
 * @description param 1分：   60 * 1000
 * @description param 1小时： 60 * 60 * 1000
 * @description param 24小时：60 * 60 * 24 * 1000
 * @description param 3天：   60 * 60* 24 * 1000 * 3
 * @returns 返回拼接后的时间字符串
 */
export function formatPast(param: string | Date, format = 'YYYY-mm-dd'): string {
  // 传入格式处理、存储转换值
  let t: any, s: number;
  // 获取js 时间戳
  let time: number = new Date().getTime();
  // 是否是对象
  // eslint-disable-next-line no-constant-condition
  typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param);
  // 当前时间戳 - 传入时间戳
  time = Number.parseInt(`${time - t}`);
  if (time < 10000) {
    // 10秒内
    return '刚刚';
  } else if (time < 60000 && time >= 10000) {
    // 超过10秒少于1分钟内
    s = Math.floor(time / 1000);
    return `${s}秒前`;
  } else if (time < 3600000 && time >= 60000) {
    // 超过1分钟少于1小时
    s = Math.floor(time / 60000);
    return `${s}分钟前`;
  } else if (time < 86400000 && time >= 3600000) {
    // 超过1小时少于24小时
    s = Math.floor(time / 3600000);
    return `${s}小时前`;
  } else if (time < 259200000 && time >= 86400000) {
    // 超过1天少于3天内
    s = Math.floor(time / 86400000);
    return `${s}天前`;
  } else {
    // 超过3天
    // eslint-disable-next-line no-constant-condition
    const date = typeof param === 'string' || 'object' ? new Date(param) : param;
    return formatDate(date, format);
  }
}

/**
 * 时间问候语
 * @param param 当前时间，new Date() 格式
 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
 * @returns 返回拼接后的时间字符串
 */
export function formatAxis(param: Date): string {
  const hour: number = new Date(param).getHours();
  if (hour < 6) return '凌晨好';
  else if (hour < 9) return '早上好';
  else if (hour < 12) return '上午好';
  else if (hour < 14) return '中午好';
  else if (hour < 17) return '下午好';
  else if (hour < 19) return '傍晚好';
  else if (hour < 22) return '晚上好';
  else return '夜深了';
}

/**
 * @param: fileName - 文件名称
 * @param: 数据返回 1) 无后缀匹配 - false
 * @param: 数据返回 2) 匹配图片 - image
 * @param: 数据返回 3) 匹配 txt - txt
 * @param: 数据返回 4) 匹配 excel - excel
 * @param: 数据返回 5) 匹配 word - word
 * @param: 数据返回 6) 匹配 pdf - pdf
 * @param: 数据返回 7) 匹配 ppt - ppt
 * @param: 数据返回 8) 匹配 视频 - video
 * @param: 数据返回 9) 匹配 音频 - radio
 * @param: 数据返回 10) 匹配 安装包 - exe
 * @param: 数据返回 11) 其他匹配项 - other
 **/
export function matchFileSuffixType(fileName: any) {
  // 后缀获取
  let suffix = '';
  // 获取类型结果
  let result: any = '';
  try {
    const flieArr = fileName.toLowerCase().split('.');
    suffix = flieArr[flieArr.length - 1];
  } catch (err) {
    suffix = '';
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false;
    return result;
  }
  // 图片格式
  const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
  // 进行图片匹配
  result = imglist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'image';
    return result;
  }
  // 匹配txt
  const txtlist = ['txt'];
  result = txtlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'txt';
    return result;
  }
  // 匹配 excel
  const excelist = ['xls', 'xlsx'];
  result = excelist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'excel';
    return result;
  }
  // 匹配 word
  const wordlist = ['doc', 'docx'];
  result = wordlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'word';
    return result;
  }
  // 匹配 pdf
  const pdflist = ['pdf'];
  result = pdflist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'pdf';
    return result;
  }
  // 匹配 ppt
  const pptlist = ['ppt'];
  result = pptlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'ppt';
    return result;
  }
  // 匹配 视频
  const videolist = ['mp4', 'm2v', 'mkv'];
  result = videolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'video';
    return result;
  }
  // 匹配 音频
  const radiolist = ['mp3', 'wav', 'wmv'];
  result = radiolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'radio';
    return result;
  }
  // 匹配 安装文件
  const exelist = ['exe'];
  result = exelist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'exe';
    return result;
  }
  // 其他 文件类型
  result = 'other';
  return result;
}
