import { AccountAddress } from '@aptos-labs/ts-sdk';

export const functionIdToStringLong = (functionId: string) => {
  if (!functionId) return '';

  if (functionId.indexOf('0x') == 0) {
    const [moduleName, structName, functionName] = functionId.split('::');
    if (!moduleName || !structName || !functionName)
      return AccountAddress.from(functionId).toStringLong();
    return `${AccountAddress.from(moduleName).toStringLong()}::${structName}::${functionName}`;
  }
};

