import helpr from '../../cryptos';
import http from './httpService';
const apiEndpoint = '/game';

export async function bet(obj) {
	const getproobj = helpr.encryptobj(obj);

	const { data } = await http.post(apiEndpoint + '/bet', { enc: getproobj });

	return helpr.decryptobj(data);
}

export default {
	bet
};
