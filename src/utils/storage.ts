// Saving the Data to storage
export const saveData = async (key: string, value: any) => {
  try {
    localStorage.setItem(key, key !== 'accessToken' ? JSON.stringify(value) : value);
  } catch (e) {
    return e;
  }
};

// Reading the Data from storage
export const readData = async (key: string) => {
  try {
    const sessionData: any = localStorage.getItem(key);
    if (sessionData !== null) {
      return key !== 'accessToken' ? JSON.parse(sessionData) : sessionData;
    }
  } catch (e) {
    return e;
  }
};

// Clearing All Storage
export const clearStorage = async () => {
  try {
    localStorage.clear();
  } catch (e) {
    return e;
  }
};

// remove item from storage
export const removeItemValue = async (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return e;
  }
};

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export async function checkToken() {
  const userToken = await readData('accessToken');

  if (userToken) {
    const decodedJwt = parseJwt(userToken);
    if (decodedJwt.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  }
  return false;
}
