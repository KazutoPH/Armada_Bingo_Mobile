import http from './httpService';
import hrlpr from '../../cryptos';
const apiEndpoint = '/history';

export async function gethistory() {
	try {
		const { data } = await http.post(apiEndpoint + '/gethist');
		return hrlpr.decryptobj(data);
	} catch (ex) {}
}

export default {
	gethistory
};
