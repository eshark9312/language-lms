import {instance} from '~/apiBase/instance';

const url = '/api/Invoice';

class Invoice {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IInvoice[]>>(url, {
			params: Params,
		});

	getDetail = (id: number) =>
		instance.get<IApiResultData<IInvoice>>(`${url}/${id}`);

	update = (data) => instance.put(url, data, {});

	export = (id) => instance.get<IApiResultData>(`/api/ExportInvoice/${id}`);
}

export const invoiceApi = new Invoice();
