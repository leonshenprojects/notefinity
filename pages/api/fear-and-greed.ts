import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const fearAndGreedData = await getCurrentFearAndGreedData();

		const url = getUrl({
			m: fearAndGreedData.value_classification,
			t: `Fear and Geed Index is ${fearAndGreedData.value}`,
			i: 25,
			s: 3,
			v: 181,
			pr: 2,
		});

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return res.status(200).json({ status: "ok" });
	} catch (error) {
		return res.status(500).json({
			error: `There was an error - ${error}`,
		});
	}
}

interface PushSaferOptions {
	m: string;
	d?: string;
	t?: string;
	// 0-`````l,
	s?: number;
	// 1 - 3
	v?: number;
	// 1 - 181
	i?: number;
	// HEX
	c?: string;
	// -2 - 2
	pr?: number;
}

interface FearAndGreedResponse {
	data: Array<FearAndGreedData>;
}

interface FearAndGreedData {
	value: string;
	value_classification: string;
	timestamp: string;
	time_until_update: string;
}

const getCurrentFearAndGreedData = async (): Promise<FearAndGreedData> => {
	const response = await fetch("https://api.alternative.me/fng", {
		method: "GET",
	});

	const { data }: FearAndGreedResponse = await response.json();

	return data[0];
};

const getUrl = (options: PushSaferOptions) => {
	const baseURL = "https://www.pushsafer.com/api";
	const key = "uovjgpwTrUqTJeF7Cf2i&m";

	return Object.keys(options).reduce((url, currentKey) => {
		if (!options[currentKey]) {
			return url;
		}

		return url + `&${currentKey}=${encodeURI(options[currentKey])}`;
	}, `${baseURL}?k=${key}`);
};
