import axios from "axios";
import Cookie from "universal-cookie";

const baseurl = import.meta.env.VITE_APP_BACKEND_URL;
const cookies = new Cookie(null, { path: '/' });

interface DefaultOpts {
  type?: string;
  url: string;
  token?: string;
  data?: Record<string, any> | any[];
  formdata?: boolean;
}

const axiosinstance = axios.create({
  baseURL: baseurl,
});

export function getCookies(name: string): string | null {
  const token = cookies.get(name);
  return token || null;
}

export function setCookie(name: string, value: string): string {
  cookies.set(name, value);
  return "cookie saved successfully";
}

export function removeCookies(): void {
  ['token', 'user'].forEach((key) => cookies.remove(key));
}

export function makeRequest({ type = "GET", url, data, formdata }: DefaultOpts) {
  const token = getCookies("token");
  let fm: FormData | undefined;
  if (formdata && data) {
    fm = new FormData();
    Object.keys(data).forEach((key) => {
      fm!.append(key, data[key]);
    });
  }
  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
      ...(formdata ? {} : { "Content-Type": "application/json" }),
    },
  };

  if (type === "GET") {
    return axiosinstance.get(url, config);
  } else {
    if (formdata && fm) {
      return axiosinstance.post(url, fm, config);
    } else {
      return axiosinstance.post(url, data, config);
    }
  }
}
