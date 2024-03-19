import http from './httpService';
import helpers from '../../cryptos';
const apiEndpoint = '/drp';

export async function withdrawbanks() {
	const { data } = await http.post(apiEndpoint + '/getdrpcashoutlist');
	return helpers.decryptobj(data);
}
export async function drreqpayoutinsta(senddata) {
	const drreqpob = helpers.encryptobj(senddata);
	const { data } = await http.post(apiEndpoint + '/witdrw', {
		enc: drreqpob
	});
	return helpers.decryptobj(data);
}

export async function cashpick(senddata) {
	const cashpob = helpers.encryptobj(senddata);
	const { data } = await http.post(apiEndpoint + '/cashpick', { enc: cashpob });
	return helpers.decryptobj(data);
}

export async function newrequestcash(senddata) {
	const cashpob = helpers.encryptobj(senddata);
	const { data } = await http.post('reqpay/insreqcash', { enc: cashpob });

	return helpers.decryptobj(data);
}
export async function getreqcash() {
	const { data } = await http.post('reqpay/getreqcash');

	return helpers.decryptobj(data);
}
export async function deleterequestcash(senddata) {
	const cashpob = helpers.encryptobj(senddata);
	const { data } = await http.post('reqpay/delreqcash', { enc: cashpob });

	return helpers.decryptobj(data);
}

export default {
	withdrawbanks,
	drreqpayoutinsta
};
