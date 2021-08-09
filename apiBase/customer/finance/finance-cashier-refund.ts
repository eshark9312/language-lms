import { instance } from "~/apiBase/instance";

const url = "/api/Refunds";

class Refunds {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IRefunds[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IRefunds>>(`${url}/${id}`);

  add = (data: IRefunds) => instance.post(url, data);

  update = (data: IRefunds) => instance.put(url, data, {});
}

export const refundsApi = new Refunds();