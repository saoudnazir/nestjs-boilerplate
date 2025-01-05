import { UAParser } from 'ua-parser-js';

export interface RequestInfo {
  browser: string;
  platform: string;
  device: string;
}

export function getPlatformAndBrowser(userAgent: string): RequestInfo {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const obj = {
    browser: `${browser.name} ${browser.version}`,
    platform: `${os.name} ${os.version}`,
    device: 'Non-mobile',
  };

  if (device.type) {
    obj.device = `${device.vendor} ${device.model} ${device.type}`;
  }

  return obj;
}
